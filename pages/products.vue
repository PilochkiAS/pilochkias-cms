<template >
  <v-layout column>




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
        pwaPrompt: null
      }
    },
    components: {
      ProductItem
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
  .carousel1 {
    height: 50vh;
  }
  .banner {
    background-color: #80DEEA;
    background-image: url("https://images.ua.prom.st/912438962_w800_h640_dsc_0133.jpg");
    background-size: cover;
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
  .carousel1 {
    .v-carousel__controls {
      background: none;
      justify-content: flex-start;
      padding-left: 20%;
    }
    .v-btn--active:before, .v-btn:hover:before, .v-btn:focus:before {
      background: none;
    }
    .v-btn i{
      color: white !important;
      opacity: 1;
    }
    .v-btn--active i{
      color: #26C6DA !important;
    }
  }
  .carousel2 {
    .v-carousel__controls {
      background: none;
    }
    .v-btn--active:before, .v-btn:hover:before, .v-btn:focus:before {
      background: none;
    }
    .v-btn--active i{
      color: #26C6DA !important;
    }
  }
  .v-carousel {
    box-shadow: none;
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
