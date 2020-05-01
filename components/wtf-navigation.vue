<template>
  <div>
    <v-tabs dark color="white" background-color="transparent">
      <v-tab to="/">
        Home
      </v-tab>
      <v-tab to="/blog">
        Blog
      </v-tab>
      <v-tab to="/projects">
        Projects
      </v-tab>
    </v-tabs>
  </div>
</template>

<script>
export default {
  computed: {
    dark () {
      return this.$store.state.siteSettings.dark
    }
  }
}
</script>
