<template>
  <div>
    <span class="bg" />
    <v-app src="/img/auth-backdrop.png">
      <v-system-bar dark color="primary">
        <v-spacer />

        <v-btn icon small @click="toggleDarkMode">
          <v-icon>mdi-invert-colors</v-icon>
        </v-btn>
      </v-system-bar>

      <v-content app>
        <v-container>
          <h1 class="white--text text-center display-1 text-uppercase login-top-pad">
            Alkaline Thunder
          </h1>
          <v-sheet>
            <v-container fluid>
              <nuxt />
            </v-container>
          </v-sheet>
        </v-container>
      </v-content>
    </v-app>
  </div>
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

<style scoped>
.bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url('/img/auth-backdrop.png') no-repeat center center;
  background-size: cover;
  overflow: hidden;
}

.login-top-pad {
  margin-top: 30dp;
  margin-bottom: 5dp;
}

@media (min-width: 768px) {
  .login-top-pad {
    margin-top: 15%;
    margin-bottom: 5dp;
  }

  .login-center {
    margin-left: 45%;
    margin-right: 45%;
  }
}
</style>
