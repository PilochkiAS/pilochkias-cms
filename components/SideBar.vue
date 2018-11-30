<template>
  <v-layout column fill-height class="pb-4">
    <v-list>
      <v-list-tile router to="/"
                   active-class="secondary primary--text"
                   exact
      >
        <v-list-tile-action>
          <v-icon>apps</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Товары</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile router to="/orders"
                   active-class="secondary primary--text"
                   exact
      >
        <v-list-tile-action>
          <v-icon>assignment</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Заказы</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        sheet: false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .time {
    display: flex;
    justify-content: center;
  }
  .d-flex > * {
    /*flex: 0 1 auto !important;*/
  }
</style>
