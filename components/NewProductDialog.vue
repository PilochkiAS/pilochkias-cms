<template>
  <v-dialog v-model="dialog" max-width="500px" class="edit-product-dialog">
    <v-btn slot="activator" color="primary" icon dark class="">
      <v-icon>add</v-icon>
    </v-btn>
    <slot></slot>
  </v-dialog>
</template>
<script>
  export default {
    data () {
      return {
        dialog: false
      }
    },
    props: ['value'],
    methods: {

    },
    async mounted () {
    },
    watch: {
      dialog (to, from) {
        this.$emit('input', to)
      },
      value (to, from) {
        this.dialog = to
      }
    },
    components: {
    }
  }
</script>
<style lang="stylus" scoped>

  @media screen and (max-width: 960px) {
  }
</style>
<style lang="stylus">


  @media screen and (max-width: 960px) {
  }
</style>
