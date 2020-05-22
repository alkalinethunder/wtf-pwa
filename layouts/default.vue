<template>
  <v-app color="primary">
    <v-navigation-drawer
      v-model="drawer"
      temporary
      :color="themeBackground"
      width="100%"
      dark
      app
      class="d-sm-none"
    >
      <v-list-item>
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <v-list-item-content>
          <v-list-item-title>
            {{ settings.name }}
          </v-list-item-title>
        </v-list-item-content>

        <wtf-socials small />
      </v-list-item>

      <v-divider />

      <wtf-drawer-navigation />

      <template slot="append">
        <wtf-drawer-user-menu />
      </template>
    </v-navigation-drawer>

    <v-app-bar
      fixed
      :color="themeBackground"
      dark
      flat
      class="d-xs-block d-sm-none"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>{{ settings.name }}</v-toolbar-title>
    </v-app-bar>

    <v-app-bar
      class="d-none d-md-block"
      app
      inverted-scroll
      :color="themeBackground"
      dark
    >
      <v-toolbar-title>{{ settings.name }}</v-toolbar-title>
      <wtf-navigation />
      <v-spacer />
      <wtf-socials />
      <wtf-user-menu />
    </v-app-bar>
    <v-content :class="themeBackground">
      <v-spacer class="mt-12 d-xs-block" />
      <v-container>
        <v-app-bar
          flat
          color="transparent"
          extended
          prominent
          dark
          class="d-none d-sm-block"
        >
          <v-toolbar-title class="display-3">
            {{ settings.name }}
          </v-toolbar-title>

          <v-spacer />

          <wtf-socials />

          <template slot="extension">
            <wtf-navigation />
            <v-spacer />
            <wtf-user-menu />
          </template>
        </v-app-bar>
        <v-sheet>
          <v-container>
            <nuxt />
          </v-container>

          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <v-list v-if="$menu('footer-1')">
                  <v-list-item
                    v-for="item of $menu('footer-1')"
                    :key="item._id"
                    :href="item.type === 'external' ? item.href : null"
                    :to="item.type !== 'external' ? item.href : null"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-list v-if="$menu('footer-2')">
                  <v-list-item
                    v-for="item of $menu('footer-2')"
                    :key="item._id"
                    :href="item.type === 'external' ? item.href : null"
                    :to="item.type !== 'external' ? item.href : null"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-list v-if="$menu('footer-3')">
                  <v-list-item
                    v-for="item of $menu('footer-3')"
                    :key="item._id"
                    :href="item.type === 'external' ? item.href : null"
                    :to="item.type !== 'external' ? item.href : null"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-container>
    </v-content>

    <v-footer app :dark="dark">
      <span v-if="settings.showDeveloperCredit">
        Developed by Michael VanOverbeek.
        <a v-if="settings.developerGitHubLinkInCredit" href="https://github.com/alkalinethunder/wtf-pwa">
          Source code
        </a>
      </span>
      <v-spacer />
      <v-btn
        v-if="$auth.loggedIn && ($auth.user.owner || $auth.user.admin)"
        small
        text
        to="/admin"
      >
        <v-icon>
          mdi-cog
        </v-icon>
        Administrate
      </v-btn>
      <wtf-dark-mode-toggle small />
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      drawer: false
    }
  },
  computed: {
    themeBackground () {
      return this.dark ? '' : 'primary'
    },
    settings () {
      return this.$store.state.siteSettings.settings
    },
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
  }
}
</script>
