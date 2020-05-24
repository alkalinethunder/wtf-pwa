<template>
  <v-app dark>
    <v-content>
      <v-container fill-height fluid>
        <v-row align="center" justify="center">
          <nuxt />
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  mounted () {
    this.$vuetify.theme.dark = true
  }
}
</script>
