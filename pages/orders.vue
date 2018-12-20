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

        <v-dialog v-model="dialog" max-width="500px" class="edit-order-dialog">
          <v-btn slot="activator" color="primary" icon dark class="hidden-sm-and-down hidden-sm-and-up">
            <v-icon>add</v-icon>
          </v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">Просмотр заказа</span>
              <v-spacer></v-spacer>
              <p class="ma-0">id: {{ editedItem.id }}</p>
            </v-card-title>

            <v-card-text class="pt-0 ">
              <v-container grid-list-md class="pt-0">
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                            value="Информация о покупателе"
                            box
                            readonly
                            class="pt-3 mt-0 hide-details"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                            :value="editedItem.customer.fullName"
                            readonly
                            label="Имя"
                            class="pt-0 mt-0 hide-details"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                            :value="editedItem.customer.email"
                            readonly
                            label="Email"
                            class="pt-0 mt-0 hide-details"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                            :value="editedItem.customer.phone"
                            readonly
                            label="Телефон"
                            class="pt-0 mt-0 hide-details"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                            :value="editedItem.customer.address"
                            readonly
                            label="Адрес доставки"
                            class="pt-0 mt-0 hide-details"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea
                        name="input-7-1"
                        label="Гравировка"
                        :value="editedItem.engraving.length > 0 ? editedItem.engraving : 'Без гравировки'"
                        class="pt-0 mt-0 hide-details"
                        readonly
                    ></v-textarea>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field
                            value="Товары"
                            box
                            readonly
                            class="pt-3 mt-0 hide-details"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12
                          v-for="product in editedItem.products"
                          :key="product.title"
                  >
                    <v-card flat tile class="py-0 px-0">
                        <!--<v-card-title primary-title class="py-1 px-3">-->
                          <!--<h4 class="mb-0">{{ product.product.title}}</h4>-->
                          <!--<v-spacer></v-spacer>-->
                        <!--</v-card-title>-->

                        <v-layout class="ma-0 pb-2 px-3">
                          <v-img
                                  :src="'/api/image/' + product.product.mainImage"
                                  height="100px"
                          ></v-img>

                          <v-flex xs7 class="py-0">
                            <v-layout class="ma-0 px-1">
                              <h4 class="mb-1">{{ product.product.title}}</h4>
                            </v-layout>
                            <v-layout class="ma-0 px-1">
                              <p class="ma-0">Сумма:</p>
                              <p class="primary--text ml-1 mb-0">{{ product.totalPrice }} грн</p>
                            </v-layout>
                            <v-layout class="ma-0 px-1">
                              <p class="ma-0">Количество:</p>
                              <p class="primary--text ml-1 mb-0">{{ product.number }} шт</p>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                      </v-card>
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
        </v-dialog>
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
        <td class="" @click="editItem(props.item)">{{ props.item.id }}</td>
        <td class=" max-width__category" @click="editItem(props.item)">{{ props.item.customerName }}</td>
        <td class="" @click="editItem(props.item)">{{ props.item.totalPrice }}</td>
        <td class="" @click="editItem(props.item)">{{ props.item.isDone ? 'Обработан' : 'Новый' }}</td>
        <td class="" @click="editItem(props.item)">{{ props.item.createdAt }}</td>
        <td class="justify-center layout px-0 pt-1">
          <v-btn small
                 @click="editItem(props.item)"
                 icon
          >
            <v-icon small>info</v-icon>
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
            :timeout="1000"
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
  import moment from 'moment'

  export default {
    data () {
      return {
        snackbar: false,
        snackbarMessage: '',
        snackbarColor: '',
        dialog: false,
        search: '',
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
          engraving: '',
          totalPrice: 0,
          products: [],
          isDone: null,
          createdAt: null
        },
        defaultItem: {
          id: '',
          customerName: '',
          customer: '',
          engraving: '',
          totalPrice: 0,
          products: [],
          isDone: null,
          createdAt: new Date()
        }
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    computed: {
    },
    methods: {
      async initialize () {
        let { data } = await this.fetchOrders()

        this.orders = data.map((obj, index) => {
          let totalPrice = 0

          obj.products.forEach(product => {
            totalPrice += product.totalPrice
          })

          return {
            id: obj.id,
            _id: obj._id,
            customerName: obj.customer.fullName,
            customer: obj.customer,
            totalPrice,
            products: obj.products,
            engraving: obj.engraving,
            isDone: obj.isDone,
            createdAt: moment(obj.createdAt).format('DD.MM.YY, h:mm:ss a')
          }
        })
      },
      /**
       * API actions
       * */
      async fetchOrders () {
        let { data } = await this.$axios.get('/api/orders?populate=true')
        console.log('==> fetchOrders', data)
        return data
      },
      async updateOrder (order) {
        let { data } = await this.$axios.put('/api/order/' + order._id, order)
        console.log('==> updateOrder', data)
      },
      async removeOrder (order) {
        let { data } = await this.$axios.delete('/api/order/' + order._id)
        console.log('==> removeOrder', data)
      },

      editItem (item) {
        this.editedIndex = this.orders.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.orders.indexOf(item)
        const confirmRemove = confirm('Вы действительно хотите удалить этот элемент?')

        if (confirmRemove) {
          this.removeOrder(item).then(() => {
            this.orders.splice(index, 1)
            this.callSnackbar('Заказ успешно удален.', 'success')
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
          this.updateOrder(this.editedItem).then(() => {
            Object.assign(this.orders[this.editedIndex], this.editedItem)
            this.callSnackbar('Заказ успешно изменен.', 'success')
          })
          this.close()
        }
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
  .edit-order-dialog {
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
  .edit-order-dialog {
    input {
      color: #47494e;
    }


  }

  .hide-details .v-text-field__details {
    display: none;
  }

  @media screen and (max-width: 960px) {

  }
</style>
