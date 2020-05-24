<template>
  <div>
    <h1 class="display-3 text-center">
      What the fuck?
    </h1>

    <div v-if="error.statusCode">
      <v-img v-if="settings.enableErrorCats" :src="`https://http.cat/${error.statusCode}`" />
      <h1 v-else class="display-1 text-center">
        HTTP {{ error.statusCode }}
      </h1>
    </div>

    <v-divider />

    <v-card>
      <v-list-item two-line>
        <v-list-item-content>
          <v-list-item-title class="overline">
            Error details
          </v-list-item-title>
          <v-list-item-subtitle class="title">
            {{ error.message }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="error.stack" two-line>
        <v-list-item-content>
          <v-list-item-title class="overline">
            Stack trace
          </v-list-item-title>
          <v-list-item-subtitle>{{ error.stack }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
export default {
  layout: 'empty',
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
  computed: {
    settings () {
      return this.$store.state.siteSettings.settings
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
