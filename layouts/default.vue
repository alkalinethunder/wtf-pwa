<template>
  <v-app dark>
    <v-system-bar app color="primary" dark>
      <a href="https://twitter.com/Desire2Leave" target="_blank">
        <v-icon>mdi-twitter</v-icon>
      </a>
      <a href="https://github.com/alkalinethunder" target="_blank">
        <v-icon>mdi-github</v-icon>
      </a>

      <v-spacer />

      <nuxt-link v-if="$auth.loggedIn && ($auth.user.owner || $auth.user.admin)" small icon to="/admin">
        <v-icon>mdi-cog</v-icon>
      </nuxt-link>

      <v-icon @click="toggleDarkMode()">
        mdi-invert-colors
      </v-icon>
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

        <v-tabs
          v-if="$auth.loggedIn"
          dark
          color="white"
          right
          hide-slider
          icons-and-text
        >
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-tab v-on="on">
                User menu
              </v-tab>
            </template>
            <v-list dense class="py-0">
              <v-list-item :two-line="$auth.user.displayName">
                <v-list-item-avatar color="primary">
                  <v-img v-if="$auth.user.avatar" :src="$auth.user.avatar" />
                  <span v-else class="display-1">{{ userLetter }}</span>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ $auth.user.username }}</v-list-item-title>
                  <v-list-item-subtitle v-if="$auth.user.displayName">
                    {{ $auth.user.displayName }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-divider />
              <v-subheader>ACCOUNT</v-subheader>

              <v-list-item to="/auth/user">
                <v-list-item-icon>
                  <v-icon>mdi-cog</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Account Settings</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item :to="`/u/${$auth.user.username}`">
                <v-list-item-content>
                  <v-list-item-title>My Profile</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-subheader>ACTIONS</v-subheader>
              <v-list-item to="/auth/logout">
                <v-list-item-content>
                  <v-list-item-title>Log out</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-tabs>
        <v-tabs
          v-else
          dark
          color="white"
          right
          hide-slider
          icons-and-text
        >
          <v-tab to="/auth/login">
            Log in
          </v-tab>
          <v-tab to="/auth/register">
            Create account
          </v-tab>
        </v-tabs>
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
    },
    userLetter () {
      const username = this.$auth.user.username
      const letter = username.slice(0, 1)
      return letter.toUpperCase()
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
