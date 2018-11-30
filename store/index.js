import Vue from 'vue'
import Vuex from 'vuex'
import products from './products'

Vue.use(Vuex)

const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  }
}

export const store = () => {
  return new Vuex.Store({
    state: {
      sidebar: false
    },
    mutations,
    modules: {
      products
    }
  })
}

export default store
