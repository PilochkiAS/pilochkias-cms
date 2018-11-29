<template>
  <v-app>
    <v-navigation-drawer
      :clipped="true"
      v-model="drawer"
      fixed
      app
    >
      <SideBar/>
    </v-navigation-drawer>

    <v-toolbar fixed app clipped-left dark color="primary">
      <v-toolbar-side-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down ml-5">
        <v-btn flat
               router to="/"
               active-class="secondary primary--text"
               exact
        >
          Товары
        </v-btn>
        <v-btn flat
               router to="/orders"
               active-class="secondary primary--text"
               exact
        >
          Заказы
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-navigation-drawer
      temporary
      right
      v-model="rightDrawer"
      fixed
    >
      <CartSideBar v-model="rightDrawer"/>
    </v-navigation-drawer>
    <v-footer :fixed="fixed" app class="text-xs-center">
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import SideBar from '~/components/SideBar'
  import CartSideBar from '~/components/CartSideBar'

  export default {
    data () {
      return {
        clipped: false,
        drawer: false,
        sheet: false,
        fixed: false,
        right: true,
        rightDrawer: false,
        title: 'PilochkiAS CMS'
      }
    },
    created () {
      this.$vuetify.theme.primary = '#C2185B'
      this.$vuetify.theme.secondary = '#FCE4EC'
      this.$vuetify.theme.accent = '#26C6DA'
    },
    computed: {
      cartProducts (value) {
        return this.$store.state.cart.products
      }
    },
    components: {
      SideBar,
      CartSideBar
    }
  }
</script>

<style lang="stylus" scoped>
  .mt-custom{
    margin-top: 112px !important;
  }
  .header{
    padding: 0 3rem;

    .v-toolbar__content{
      height: auto;
    }
  }
  .fab-animation {
    animation: rotate 2s ease-in 1s infinite normal forwards;

    &:before {
      position: absolute;
      width: 56px;
      height: 56px;
      background-color: #C2185B;
      animation: zoom-out 3s linear 0s infinite normal;
    }
  }

  @media screen and (max-width: 960px) {
    .mt-custom{
      margin-top: 0 !important;
    }
    .header{
      padding: 0;
      font-size: 0.8rem;
    }
  }
</style>
<style lang="stylus" scoped>
  .v-badge__badge.accent span{
    padding-top: 1px;
    padding-left: 1px;
  }
  @media screen and (max-width: 960px) {

  }
</style>
