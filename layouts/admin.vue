<template>
  <v-app>
    <v-app-bar
      app
      dark
      :color="themeBackground"
    >
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />
      <v-toolbar-title>Administration</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      :value="drawer"
      mini
      app
      dark
      :color="themeBackground"
    >
      <wtf-admin-navigation />

      <template slot="append">
        <v-divider />
        <wtf-drawer-user-menu admin />
      </template>
    </v-navigation-drawer>

    <v-content class="fill-height">
      <v-container fluid class="fill-height">
        <v-card raised class="fill-height">
          <nuxt />
        </v-card>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: null
    }
  },
  computed: {
    themeBackground () {
      return this.dark ? '' : 'primary'
    },
    dark () {
      return this.$store.state.siteSettings.dark
    },
    sitesettings () {
      return this.$store.state.siteSettings.settings
    }
  },
  watch: {
    dark (newValue) {
      this.$vuetify.theme.dark = newValue
    }
  },
  mounted () {
    this.$vuetify.theme.dark = this.dark
  }
}
</script>
