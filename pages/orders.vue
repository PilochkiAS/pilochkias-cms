<template >
  <v-layout column>
    <v-toolbar class="mb-4">
      <v-layout align-center>
        <v-text-field
                placeholder="Поиск"
                solo
                clearable
                class="search-products-input"
                v-model="search"
                hide-details
        ></v-text-field>
      </v-layout>

      <v-toolbar-items>
        <v-btn icon class="mx-sm-0"><v-icon>filter_list</v-icon></v-btn>
        <new-product-dialog v-model="dialog">
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field v-model="editedItem.title" label="Название"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="editedItem.category" label="Категория"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="editedItem.description" label="Описание"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="editedItem.discount" label="Цена со скидкой"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="editedItem.price" label="Цена"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </new-product-dialog>
      </v-toolbar-items>
    </v-toolbar>

    <v-data-table
            :headers="headers"
            :items="orders"
            :search="search"
            class="elevation-1"
            :loading="false"
    >
      <template slot="items" slot-scope="props">
        <td class="">{{ props.item.id }}</td>
        <td class=" max-width__category">{{ props.item.customerName }}</td>
        <td class="">{{ props.item.totalPrice }}</td>
        <td class="">{{ props.item.isDone ? 'Обработан' : 'Новый' }}</td>
        <td class="">{{ props.item.createdAt }}</td>
        <td class="justify-center layout px-0">
          <v-btn small
                 @click="editItem(props.item)"
                 icon
          >
            <v-icon small>edit</v-icon>
          </v-btn>

          <v-btn small
                 @click="deleteItem(props.item)"
                 icon
          >
            <v-icon small>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>

    <v-snackbar
            v-model="snackbar"
            :color="snackbarColor"
            :timeout="2000"
            top
            right
    >
      {{ snackbarMessage }}
      <v-btn
              dark
              flat
              @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>
<script>
  import NewProductDialog from '~/components/NewProductDialog'
  import moment from 'moment'

  export default {
    data () {
      return {
        pwaPrompt: null,
        snackbar: false,
        snackbarMessage: '',
        snackbarColor: '',
        moduleList: true,
        dialog: false,
        search: '',
        imageName: '',
        imageFile: '',
        imageUrl: '',
        headers: [
          {
            text: 'Заказ',
            align: 'left',
            value: 'id'
          },
          { text: 'Покупатель', value: 'customerName' },
          { text: 'Общая сумма', value: 'totalPrice' },
          { text: 'Состояние', value: 'isDone' },
          { text: 'Дата оформления', value: 'createdAt' },
          { text: 'Действия', value: 'id', sortable: false }
        ],
        orders: [],
        editedIndex: -1,
        editedItem: {
          id: '',
          customerName: '',
          customer: '',
          totalPrice: 0,
          products: [],
          isDone: null,
          createdAt: null
        },
        defaultItem: {
          number: '',
          customerName: '',
          customer: '',
          totalPrice: 0,
          isDone: null,
          createdAt: new Date()
        }
      }
    },
    components: {
      NewProductDialog
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Создать товар' : 'Изменить товар'
      }
    },
    methods: {
      /**
       * API actions
       * */
      async initialize () {
        let { data } = await this.fetchOrders()

        this.orders = data.map((obj, index) => {
          let totalPrice = 0

          obj.products.forEach(product => {
            if (product.discount) totalPrice += product.discount
            else totalPrice += product.price
          })

          return {
            id: index + 1,
            _id: obj._id,
            customerName: obj.customer.fullName,
            customer: obj.customer,
            totalPrice,
            products: obj.products,
            isDone: obj.isDone,
            createdAt: moment(obj.createdAt).format('DD.MM.YY, h:mm:ss a')
          }
        })
      },
      async fetchOrders () {
        let { data } = await this.$axios.get('/api/orders?populate=true')
        console.log('==> fetchOrders', data)
        return data
      },
      async createProduct (product) {
        Object.assign(product, {
          mainImage: '',
          secondImage: '',
          isPublished: false
        })
        let { data } = await this.$axios.post('/api/orders', product)
        console.log('==> createProduct', data)
        return data.data
      },
      async updateProduct (product) {
        let { data } = await this.$axios.put('/api/product/' + product._id, product)
        console.log('==> updateProduct', data)
      },
      async removeProduct (product) {
        let { data } = await this.$axios.delete('/api/product/' + product._id)
        console.log('==> removeProduct', data)
      },

      editItem (item) {
        this.editedIndex = this.orders.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.orders.indexOf(item)
        const confirmRemove = confirm('Are you sure you want to delete this item?')

        if (confirmRemove) {
          this.removeProduct(item).then(() => {
            this.orders.splice(index, 1)
            this.callSnackbar('Товар успешно удален.', 'success')
          })
        }
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        if (this.editedIndex > -1) {
          this.updateProduct(this.editedItem).then(() => {
            Object.assign(this.orders[this.editedIndex], this.editedItem)
            this.callSnackbar('Товар успешно изменен.', 'success')
          })
        } else {
          this.createProduct(this.editedItem).then(product => {
            this.orders.push(product)
            this.callSnackbar('Товар успешно создан.', 'success')
          })
        }
        this.close()
      },

      callSnackbar (message, color) {
        this.snackbarMessage = message
        this.snackbarColor = color
        this.snackbar = true
      },

      pickMainImage () {
        this.$refs.mainImage.click()
      },
      pickSecondImage () {
        this.$refs.secondImage.click()
      }
    },
    mounted () {
      this.initialize()
    }
  }
</script>
<style lang="stylus" scoped>
  .main-image {
    border-radius: 10px;
    .layout {
      display: none;
      background-color: rgba(0,0,0,0.4);

      p {
        padding-top: 13px !important;
      }
    }
    &:hover {
      .layout {
        display: flex;
      }
    }
  }
  .image-upload-btn {
    height: 150px;
    background-color: #f5f5f5;
    border-radius: 10px;
    border: 2px dotted #bdbdbd;
  }
  .image-input-label {
    /*border-bottom: 1px solid rgba(0,0,0,0.38);*/
    color: rgba(0,0,0,0.54);
  }
  .max-width__category {
    max-width: 200px;
    overflow-x: scroll;
  }
  .max-width__title {
    max-width: 200px;
    overflow-x: scroll;
  }
  .edit-product-dialog {
    display: flex !important;
    align-items: center;
  }

  @media screen and (max-width: 960px) {

  }

</style>

<style lang="stylus">
  .search-products-input {
    .v-input__slot {
      box-shadow: none !important;
      /*background: #e0e0e0 !important;*/
      background: #fff0 !important;
    }
  }

  @media screen and (max-width: 960px) {

  }
</style>
