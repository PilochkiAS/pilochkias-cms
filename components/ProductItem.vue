<template>
  <v-card flat tile hover>
    <v-layout :column="isModuleList" class="custom-cards">
      <v-flex xs5 class="py-0">
        <!--<v-img-->
        <!--:src="`https://unsplash.it/150/300?image=${Math.floor(Math.random() * 100) + 1}`"-->
        <!--height="150px"-->
        <!--&gt;</v-img>-->
        <v-img
                :src="getImageUrl(item.mainImage)"
                height="150px"
        >
          <v-layout fill-height class="ma-0">
            <span class="white--text discount-label pa-1" v-if="item.discount > 0">
              <v-img src="/sale.png" height="40" width="40"/>
            </span>
          </v-layout>
        </v-img>
      </v-flex>

      <v-flex xs7>
        <v-card-title primary-title class="py-0">
          <div>
            <div class="title">{{ item.title }}</div>
          </div>
        </v-card-title>
      </v-flex>
    </v-layout>

    <v-divider light inner></v-divider>

    <v-card-actions>
      <div :class="item.discount > 0 ? 'grey--text discount mr-1' : 'accent--text font-weight-bold'" >{{ item.price }} грн</div>
      <div class="accent--text" v-if="item.discount > 0">{{ item.discount }} грн</div>
      <v-spacer></v-spacer>
      <v-btn icon :class="isModuleList ? 'action-btn hidden-sm-and-down':'action-btn'">
        <v-icon>favorite</v-icon>
      </v-btn>
      <v-btn icon :class="isModuleList ? 'action-btn hidden-sm-and-down':'action-btn'">
        <v-icon>share</v-icon>
      </v-btn>
      <v-btn icon
             class="action-btn"
             @click="$store.commit('addToCart', item)"
      >
        <v-icon>add_shopping_cart</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    created () {

    },
    methods: {
      getImageUrl (id) {
        if (id) {
          return '/api/image/' + id
        }
        return ''
      }
    },
    props: ['isModuleList', 'item']
  }
</script>

<style lang="stylus" scoped>
  .v-btn.action-btn:hover .v-btn__content .v-icon {
    color: #26C6DA;
  }
  .discount {
    text-decoration: line-through;
  }
  .discount-label {
    height: 2rem;
  }

  @media screen and (max-width: 960px) {
  }
</style>
<style lang="stylus">


  @media screen and (max-width: 960px) {
  }
</style>
