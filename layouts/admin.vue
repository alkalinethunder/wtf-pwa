<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      color="primary"
      dark
    >
      <v-list dense nav class="py-0">
        <v-list-item two-item class="px-0">
          <v-list-item-content>
            <v-list-item-title>{{ sitesettings.name }}</v-list-item-title>
            <v-list-item-subtitle>Administration</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />

        <v-list-item v-for="page of pages" :key="page.name" :to="page.to">
          <v-list-item-icon>
            <v-icon>mdi-{{ page.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ page.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark dense>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-list v-if="!drawer" dense nav color="transparent">
        <v-list-item two-item>
          <v-list-item-content>
            <v-list-item-title>{{ sitesettings.name }}</v-list-item-title>
            <v-list-item-subtitle>Administration</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-spacer />

      <v-btn icon @click="toggleDarkMode()">
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>
      <v-btn icon to="/">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content app>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      pages: [
        {
          name: 'Overview',
          to: '/admin',
          icon: 'home'
        },
        {
          name: 'Posts',
          to: '/admin/posts',
          icon: 'book'
        },
        {
          name: 'Projects',
          to: '/admin/projects',
          icon: 'code'
        },
        {
          name: 'Users',
          to: '/admin/users',
          icon: 'account'
        }
      ],
      drawer: false
    }
  },
  computed: {
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
  },
  methods: {
    toggleDarkMode () {
      this.$store.commit('siteSettings/toggleDarkMode')
    }
  }
}
</script>
