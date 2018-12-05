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
                  <v-flex xs12 sm6>
                    <h5 class="image-input-label px-2 subheading">Основное фото</h5>
                    <v-img
                            :src="'/api/image/' + editedItem.mainImage"
                            height="150"
                            v-if="editedItem.mainImage && editedItem.mainImage.length > 0"
                            class="main-image"
                    >
                      <v-layout fill-height justify-end class="bg-darken">
                        <v-btn dark icon @click="removeMainImage">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-layout>
                    </v-img>
                    <v-btn flat
                           block
                           large
                           color="grey"
                           @click='pickMainImage'
                           v-else
                           class="image-upload-btn my-0"
                    >
                      <v-progress-circular :value="mainImageLoading" v-if="mainImageLoading > 0"></v-progress-circular>
                      <v-icon v-else>attach_file</v-icon>
                    </v-btn>
                    <input
                            type="file"
                            style="display: none"
                            ref="mainImage"
                            accept="image/*"
                            @change="mainImageUpload"
                    >
                  </v-flex>
                  <v-flex xs12 sm6>
                    <h5 class="image-input-label px-2 subheading">Дополнительное фото</h5>
                    <v-img
                            :src="'/api/image/' + editedItem.secondImage"
                            height="150"
                            v-if="editedItem.secondImage && editedItem.secondImage.length > 0"
                            class="main-image"
                    >
                      <v-layout fill-height justify-end class="bg-darken">
                        <v-btn dark icon @click="removeSecondImage">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-layout>
                    </v-img>
                    <v-btn flat
                           block
                           large
                           color="grey"
                           @click='pickSecondImage'
                           v-else
                           class="image-upload-btn my-0"
                    >
                      <v-progress-circular :value="secondImageLoading" v-if="secondImageLoading > 0"></v-progress-circular>
                      <v-icon v-else>attach_file</v-icon>
                    </v-btn>
                    <input
                            type="file"
                            style="display: none"
                            ref="secondImage"
                            accept="image/*"
                            @change="secondImageUpload"
                    >
                  </v-flex>
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
        headers: [
          {
            text: 'Товар',
            align: 'left',
            sortable: false,
            value: 'title'
          },
          { text: 'Категория', value: 'category' },
          { text: 'Цена со скидкой', value: 'discount' },
          { text: 'Цена', value: 'price' },
          { text: 'Действия', value: 'name', sortable: false }
        ],
        products: [],
        editedIndex: -1,
        editedItem: {
          title: '',
          description: '',
          category: 0,
          price: null,
          discount: null,
          mainImage: null,
          secondImage: null
        },
        defaultItem: {
          title: '',
          description: '',
          category: 0,
          price: null,
          discount: null,
          mainImage: null,
          secondImage: null
        },
        mainImageLoading: null,
        secondImageLoading: null
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
        let { data } = await this.$axios.get('/api/products')
        this.products = data.data
        // ToDo: initialize content to vuex store & get content from there.
        // this.$store.commit('initProducts', data)
      },
      async createProduct (product) {
        Object.assign(product, {
          mainImage: '',
          secondImage: '',
          isPublished: false
        })
        let { data } = await this.$axios.post('/api/products', product)
        return data.data
      },
      async updateProduct (product) {
        let { data } = await this.$axios.put('/api/product/' + product._id, product)
        return data
      },
      async removeProduct (product) {
        let { data } = await this.$axios.delete('/api/product/' + product._id)
        return data
      },
      async imageUpload (formData, cb) {
        let { data } = await this.$axios.post('/api/images', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress (progressEvent) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)

            cb(percentCompleted)
            return percentCompleted
          }
        })
        return data
      },
      async removeImage (id) {
        let { data } = await this.$axios.delete('/api/image/' + id)
        return data
      },

      mainImageUpload () {
        const formData = new FormData()
        const imageFile = this.$refs.mainImage
        // ToDo: check if imageFile consist an image

        formData.append('productImage', imageFile.files[0])

        this.imageUpload(formData, percent => {
          this.mainImageLoading = percent === 100 ? -1 : percent
        }).then(image => {
          this.editedItem.mainImage = image.data
        })
      },
      secondImageUpload () {
        const formData = new FormData()
        const imageFile = this.$refs.secondImage
        // ToDo: check if imageFile consist an image

        formData.append('productImage', imageFile.files[0])

        this.imageUpload(formData, percent => {
          this.secondImageLoading = percent === 100 ? -1 : percent
        }).then(image => {
          this.editedItem.secondImage = image.data
        })
      },
      removeMainImage () {
        this.removeImage(this.editedItem.mainImage).then(image => {
          this.$refs.mainImage.value = ''
          this.editedItem.mainImage = null
          this.callSnackbar('Изображение удалено.', 'success')
        })
      },
      removeSecondImage () {
        this.removeImage(this.editedItem.secondImage).then(() => {
          this.$refs.secondImage.value = ''
          this.editedItem.secondImage = null
          this.callSnackbar('Изображение удалено.', 'success')
        })
      },

      editItem (item) {
        this.editedIndex = this.products.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.products.indexOf(item)
        const confirmRemove = confirm('Are you sure you want to delete this item?')

        if (confirmRemove) {
          this.removeProduct(item).then(() => {
            this.products.splice(index, 1)
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

        // this.$refs.mainImage.value = ''
        // this.$refs.secondImage.value = ''
      },
      save () {
        if (this.editedIndex > -1) {
          this.updateProduct(this.editedItem).then(data => {
            Object.assign(this.products[this.editedIndex], data)
            this.callSnackbar('Товар успешно изменен.', 'success')
          })
        } else {
          this.createProduct(this.editedItem).then(product => {
            this.products.push(product)
            this.callSnackbar('Товар успешно создан.', 'success')
          })
        }
        this.close()
      },

      pickMainImage () {
        console.log('==> pickMainImage')
        this.$refs.mainImage.click()
      },
      pickSecondImage () {
        console.log('==> pickSecondImage')
        this.$refs.secondImage.click()
      },
      callSnackbar (message, color) {
        this.snackbarMessage = message
        this.snackbarColor = color
        this.snackbar = true
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
