<template>
  <div>
    <v-card-title class="display-1">
      Site settings
    </v-card-title>
    <v-card-subtitle>
      These settings affect the entire website and its layout and behaviour.
    </v-card-subtitle>

    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-form @submit="updateName">
          <v-card-title>Site name and description</v-card-title>

          <v-card-text>
            <v-text-field v-model="settings.name" label="Site name" />
            <v-text-field v-model="settings.description" label="Site description" />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn text type="submit">
              Update
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-form @submit="updateSocials">
          <v-card-title>Header social links</v-card-title>
          <v-card-subtitle>
            Display icon links to various social media profiles in the header bar. Fields that are left empty will not show in the header bar.
          </v-card-subtitle>

          <v-card-text>
            <v-text-field v-model="settings.twitterProfile" label="Twitter" :rules="rules.twitter">
              <template slot="prepend-inner">
                <v-icon>mdi-twitter</v-icon>
              </template>
            </v-text-field>

            <v-text-field v-model="settings.githubUsername" label="GitHub" :rules="rules.github">
              <template slot="prepend-inner">
                <v-icon>mdi-github</v-icon>
              </template>
            </v-text-field>

            <v-text-field v-model="settings.subreddit" label="Subreddit" :rules="rules.reddit">
              <template slot="prepend-inner">
                <v-icon>mdi-reddit</v-icon>
              </template>
            </v-text-field>

            <v-text-field v-model="settings.youtubeChannel" label="YouTube" :rules="rules.youtube">
              <template slot="prepend-inner">
                <v-icon>mdi-youtube</v-icon>
              </template>
            </v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn text type="submit">
              Update
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-form>
          <v-card-title>Security</v-card-title>
          <v-card-subtitle>
            These settings can affect the security of your website.
          </v-card-subtitle>
          <v-list>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Request email verification at sign-up</v-list-item-title>
                <v-list-item-subtitle>If enabled, users will be sent an email on sign-up and required to click the link in the email to activate their account prior to logging in. This can help reduce the amount of spam accounts and bots.</v-list-item-subtitle>
              </v-list-item-content>
              <v-switch v-model="settings.requireEmailVerification" />
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer />
            <v-btn text type="submit">
              Update
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-form @submit="misc">
          <v-card-title>Miscellaneous settings</v-card-title>

          <v-list>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Developed by Alkaline Thunder</v-list-item-title>
                <v-list-item-subtitle>Add some text to the footer crediting the developer of this CMS.</v-list-item-subtitle>
              </v-list-item-content>
              <v-switch v-model="settings.showDeveloperCredit" />
            </v-list-item>
            <v-list-item two-line :disabled="!settings.showDeveloperCredit">
              <v-list-item-content>
                <v-list-item-title>Link to GitHub repository</v-list-item-title>
                <v-list-item-subtitle>When the developer credit text is enabled, turn this on to add a link to the CMS's GitHub repository.</v-list-item-subtitle>
              </v-list-item-content>
              <v-switch v-model="settings.developerGitHubLinkInCredit" />
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Enable error cats</v-list-item-title>
                <v-list-item-subtitle>
                  Add cat pictures courtesy of
                  <a href="https://http.cat">http.cat</a>
                  to all error pages on your website.
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-switch v-model="settings.httpStatusCodeCats" />
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer />
            <v-btn text type="submit">
              Update
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      settings: {},
      rules: {
        twitter: [
          v => v && v.length > 15 ? 'Twitter usernames cannot be greater than 15 characters.' : true,
          v => v && !v.match(/^[A-z0-9_]+$/i) ? 'That username contains invalid characters.' : true
        ],
        youtube: [
          v => v && !v.match(/^youtube\.com\/(user|channel)\/([A-z0-9\-_]+$)/) ? "That's not a valid YouTube channel URL." : true
        ],
        github: [
          v => v && !v.match(/^[A-z0-9\-_]+$/i) ? 'Username contains invalid characters.' : true
        ],
        reddit: [
          v => v && !v.match(/^[A-z0-9\-_]+$/i) ? 'Username contains invalid characters.' : true
        ]
      }
    }
  },
  mounted () {
    this.settings = Object.assign({}, this.$store.state.siteSettings.settings)
  },
  methods: {
    misc (evt) {
      evt.preventDefault()
      this.$axios.post('/api/setup/configure/misc', {
        devCredit: this.settings.showDeveloperCredit,
        devLink: this.settings.developerGitHubLinkInCredit,
        errorCats: this.settings.httpStatusCodeCats
      }).then((res) => {
        this.$store.commit('siteSettings/updateSiteSettings', res.data)
      }).catch((err) => {
        if (err) {
          alert(err)
        }
      })
    },
    updateName (evt) {
      evt.preventDefault()

      const changes = {
        name: this.settings.name,
        description: this.settings.description
      }

      this.$axios.post('/api/setup/configure/sitename', changes)
        .then((res) => {
          this.$store.commit('siteSettings/updateSiteSettings', res.data)
        })
    },
    updateSocials (evt) {
      evt.preventDefault()

      const changes = {
        twitter: this.settings.twitterHandle,
        reddit: this.settings.subreddit,
        github: this.settings.githubProfile,
        youtube: this.settings.youtubeChannel
      }

      this.$axios.post('/api/setup/configure/socials', changes)
        .then((res) => {
          this.$store.commit('siteSettings/updateSiteSettings', res.data)
        })
    }
  }
}
</script>
