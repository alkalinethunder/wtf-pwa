<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      width="100%"
      dark
      app
      :color="themeBackground"
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
      app
      dark
      flat
      class="d-xs-block d-sm-none"
      :color="themeBackground"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <div class="d-flex flex-column ml-3">
        <v-toolbar-title>{{ settings.name }}</v-toolbar-title>
        <span class="caption">
          {{ settings.description }}
        </span>
      </div>

      <v-spacer />

      <wtf-dark-mode-toggle />
      <wtf-user-menu />

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <div v-if="$menu('footer-1')">
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
            <v-divider />
          </div>
          <div v-if="$menu('footer-2')">
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
            <v-divider />
          </div>
          <div v-if="$menu('footer-3')">
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
            <v-divider />
          </div>
          <v-list-item
            v-if="settings.showDeveloperCredit && settings.developerGitHubLinkInCredit"
            href="https://github.com/alkalinethunder/wtf-pwa"
          >
            <v-list-item-content>
              <v-list-item-title>
                Source code
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="$auth.loggedIn && ($auth.user.owner || $auth.user.admin)"
            to="/admin"
          >
            <v-list-item-content>
              <v-list-item-title>
                Administrate
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content app :class="themeBackground">
      <v-container>
        <v-app-bar
          flat
          color="transparent"
          extended
          prominent
          dark
          class="d-none d-sm-block"
        >
          <v-toolbar-title>
            <v-flex class="d-flex flex-column mb-6">
              <h1 class="display-3">
                {{ settings.name }}
              </h1>
              <h2 class="headline">
                {{ settings.description }}
              </h2>
            </v-flex>
          </v-toolbar-title>

          <v-spacer />

          <wtf-socials />

          <template slot="extension">
            <wtf-navigation />
            <v-spacer />
            <wtf-dark-mode-toggle />
            <wtf-user-menu />
          </template>
        </v-app-bar>
        <v-sheet>
          <nuxt />

          <v-container class="d-none d-sm-block">
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

            <v-divider />

            <v-flex class="d-flex flex-column justify-center text-center mt-3">
              <p v-if="settings.showDeveloperCredit" class="caption">
                wtf-pwa | Developed by Michael VanOverbeek.
              </p>
              <v-flex class="d-flex flex-row align-center ml-auto mr-auto">
                <v-btn
                  v-if="settings.showDeveloperCredit && settings.developerGitHubLinkInCredit"
                  small
                  text
                  href="https://github.com/alkalinethunder/wtf-pwa"
                  class="caption"
                >
                  Source code
                </v-btn>
                <v-btn
                  v-if="$auth.loggedIn && ($auth.user.owner || $auth.user.admin)"
                  small
                  text
                  to="/admin"
                >
                  Administration
                </v-btn>
              </v-flex>
            </v-flex>
          </v-container>
        </v-sheet>
      </v-container>
    </v-content>
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
