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
        <v-dialog v-model="dialog" max-width="500px" class="edit-product-dialog">
          <v-btn slot="activator" color="primary" icon dark class="">
            <v-icon>add</v-icon>
          </v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="editedItem.title" label="Название"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="editedItem.category" label="Категория"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="editedItem.description" label="Описание"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field v-model="editedItem.discount" label="Скидка"></v-text-field>
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
        </v-dialog>
      </v-toolbar-items>
    </v-toolbar>

    <v-data-table
            :headers="headers"
            :items="products"
            :search="search"
            class="elevation-1"
            :loading="false"
    >
      <template slot="items" slot-scope="props">
        <td class="max-width__title">{{ props.item.title }}</td>
        <td class="text-xs-right max-width__category">{{ props.item.category }}</td>
        <td class="text-xs-right">{{ props.item.discount }}</td>
        <td class="text-xs-right">{{ props.item.price }}</td>
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

    <v-layout justify-center class="pt-4" v-if="pwaPrompt">
      <v-btn
              slot="activator"
              color="primary"
              outline
              dark
              @click="installAppBtnClick"
      >
        Установить Приложение
      </v-btn>
    </v-layout>
  </v-layout>
</template>
<script>
  import ProductItem from '~/components/ProductItem'

  export default {
    data () {
      return {
        pwaPrompt: null,
        moduleList: true,
        dialog: false,
        search: '',
        headers: [
          {
            text: 'Товар',
            align: 'left',
            sortable: false,
            value: 'title'
          },
          { text: 'Категория', value: 'category' },
          { text: 'Скидка', value: 'discount' },
          { text: 'Цена', value: 'price' },
          { text: 'Действия', value: 'name', sortable: false }
        ],
        products: [
          {
            title: 'Frozen Yogurt',
            description: 'Frozen Yogurt',
            category: 1,
            price: 160,
            discount: 140
          }
        ],
        editedIndex: -1,
        editedItem: {
          title: '',
          description: '',
          category: 0,
          price: null,
          discount: null
        },
        defaultItem: {
          title: '',
          description: '',
          category: 0,
          price: null,
          discount: null
        }
      }
    },
    components: {
      ProductItem
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    created () {
      // this.initialize()
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Создать товар' : 'Изменить товар'
      }
    },
    methods: {
      installAppBtnClick (e) {
        // Show the prompt
        this.pwaPrompt.prompt()
        // Wait for the user to respond to the prompt
        this.pwaPrompt.userChoice
          .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt')
            } else {
              console.log('User dismissed the A2HS prompt')
            }
            // hide our user interface that shows our A2HS button
            this.pwaPrompt = null
          })
      },

      created () {
        // this.initialize()
      },

      editItem (item) {
        this.editedIndex = this.products.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.products.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.products.splice(index, 1)
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
          Object.assign(this.products[this.editedIndex], this.editedItem)
        } else {
          this.products.push(this.editedItem)
        }
        this.close()
      }
    },
    mounted () {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault()
        // Stash the event so it can be triggered later.
        this.pwaPrompt = e
      })
    }
  }
</script>
<style lang="stylus" scoped>
  .bg-darken {
    background-color: rgba(71, 73, 78, 0.25);
  }
  .max-width__category {
    max-width: 200px;
    overflow-x: scroll;
  }
  .max-width__title {
    max-width: 200px;
    overflow-x: scroll;
  }
  .banner {
    background-color: #80DEEA;
    background-image: url("https://images.ua.prom.st/912438962_w800_h640_dsc_0133.jpg");
    background-size: cover;
  }
  .edit-product-dialog {
    display: flex !important;
    align-items: center;
  }
  .banner-text {
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: #80DEEAA8;
    h1 {
      font-size: 40px;
    }
  }
  .products-carousels {
    flex-direction: row;
  }

  @media screen and (max-width: 960px) {
    .display-2 {
      font-size: 2.2rem !important;
    }
    .banner-text {
      h1 {
        font-size: 1.5rem;
      }
      h2 {
        font-size: 1.2rem;
      }
    }
    .products-carousels {
      flex-direction: column !important;
    }
    .headline {
      font-size: 1.5rem !important;
    }
  }

</style>

<style lang="stylus">
  .search-products-input {
    .v-input__slot {
      /*margin: 0;*/
      box-shadow: none !important;
      /*background: #e0e0e0 !important;*/
      background: #fff0 !important;
    }
  }

  @media screen and (max-width: 960px) {
    .carousel1 {
      .v-carousel__controls {
        justify-content: center;
        padding-left: unset;
      }
    }
  }
</style>
