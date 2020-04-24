<template>
  <div>
    <div v-if="error.statusCode">
      <v-row align="center" justify="center">
        <v-img v-if="settings.httpStatusCodeCats" :src="`https://http.cat/${error.statusCode}`" />
        <h1 v-else class="text-center display-4">{{ error.statusCode }}</h1>
      </v-row>
      <v-row align="center" justify="center">
        <p v-if="error.message" class="text-center">{{ error.message }}</p>
      </v-row>
      <v-row align="center" justify="center">
        <p v-if="error.statusCode === 403" class="text-center secondary--text">I'm sorry, but I'm afraid I can't let you do that.</p>
        <p v-else class="text-center secondary--text">I do believe that this is, in fact, an error.</p>
      </v-row>
    </div>
    <v-row v-else align="center" justify="center">
      <h1 class="display-4 text-center">Awww fucking hell.</h1>
      <p class="text-center">An unknown error has occurred. Probably another god damn bug.</p>
    </v-row>
    <v-row align="center" justify="center">
      <v-btn text to="/">
        Go home
      </v-btn>
    </v-row>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  computed: {
    settings () {
      return this.$store.state.siteSettings.settings
    }
  },
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
