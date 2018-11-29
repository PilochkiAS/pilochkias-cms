const state = () => ({
  products: []
})

const getters = {
  getSortedProducts (state) {

  }
}

const mutations = {
  initProducts (state, products) {
    state.products = products
  },
  removeFromCart (state, product) {
    let products = state.products
    products = products.filter(item => item.id !== product.id)
    state.products = products
  }
}

const actions = {
  async nuxtServerInit ({ commit }, { req }) {

  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
