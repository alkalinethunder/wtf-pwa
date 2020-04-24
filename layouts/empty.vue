<template>
  <v-app dark>
    <v-app-content>
      <v-container fill-height fluid>
        <v-row align="center" justify="center">
          <nuxt />
        </v-row>
      </v-container>
    </v-app-content>
  </v-app>
</template>

<script>
export default {
  mounted () {
    this.$vuetify.theme.dark = true
  }
}
</script>
