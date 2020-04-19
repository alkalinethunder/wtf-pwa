<template>
  <v-app dark>
    <v-system-bar app color="primary" dark>
      <v-btn icon href="https://twitter.com/Desire2Leave" target="_blank" small>
        <v-icon>mdi-twitter</v-icon>
      </v-btn>
      <v-btn icon href="https://github.com/alkalinethunder" target="_blank" small>
        <v-icon>mdi-github</v-icon>
      </v-btn>

      <v-spacer />

      <v-btn small icon @click="toggleDarkMode">
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>
    </v-system-bar>
    <v-app-bar
      extended
      app
      dark
      color="primary"
      shrink-on-scroll
      prominent
    >
      <v-toolbar-title>Alkaline Thunder</v-toolbar-title>

      <v-spacer />

      <template slot="extension">
        <v-tabs dark color="white">
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

        <v-spacer />

        <div v-if="$auth.loggedIn">
          <v-btn to="/auth/logout">
            Log out
          </v-btn>
        </div>
        <div v-else>
          <v-btn to="/auth/login">
            Log in
          </v-btn>
          <v-btn to="/auth/register">
            Create account
          </v-btn>
        </div>
      </template>
    </v-app-bar>

    <v-content app>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  computed: {
    dark () {
      return this.$store.state.siteSettings.dark
    }
  },
  watch: {
    dark (newValue) {
      this.$vuetify.theme.dark = newValue
    }
  },
  mounted () {
    this.$vuetify.theme.dark = this.dark
  },
  methods: {
    toggleDarkMode () {
      this.$store.commit('siteSettings/toggleDarkMode')
    }
  }
}
</script>
