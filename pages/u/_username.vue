<template>
  <div>
    <wtf-page-viewer>
      <template slot="prepend">
        <v-responsive :aspect-ratio="48/9" class="primary">
          <v-img class="wtf-cover" />

          <v-flex class="d-flex flex-row justify-end mt-2 mr-2 align-center">
            <v-btn
              v-if="canEdit"
              icon
              @click="showEditDialog"
            >
              <v-icon>mdi-lead-pencil</v-icon>
            </v-btn>
          </v-flex>
        </v-responsive>
      </template>

      <template slot="title">
        <v-flex class="d-flex flex-row align-center">
          <v-btn
            fab
            color="primary"
          >
            <v-icon>mdi-account</v-icon>
          </v-btn>

          <v-flex class="d-flex flex-column ml-3">
            <span class="title">
              {{ displayname }}
            </span>
            <span class="caption text--secondary">
              @{{ profile.username }}
            </span>
          </v-flex>
        </v-flex>
      </template>

      <wtf-renderer
        v-if="profile.content"
        v-model="profile.content"
      />
      <p
        v-else
        class="body-2"
      >
        This user has no profile content.
      </p>

      <template slot="sidebar">
        <h4 class="overline">
          About
        </h4>

        <p v-if="profile.about" class="body-1">
          {{ profile.about }}
        </p>
        <p v-else class="text--secondary">
          Nothing to display here... the user hasn't written anything about themselves yet!
        </p>
      </template>

      <v-dialog
        v-if="canEdit"
        v-model="editProfile"
        persistent
        width="960"
      >
        <v-card>
          <v-card-title class="title">
            Edit profile
          </v-card-title>

          <v-divider />

          <v-form @submit="saveChanges">
            <v-card-text>
              <v-text-field
                v-model="edit.displayName"
                label="Display name"
              />

              <v-textarea
                v-model="edit.about"
                label="About me"
                rows="1"
                auto-grow
              />

              <wtf-markdown-editor v-model="edit.content" mode="editor" />
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer />

              <v-btn
                text
                @click="cancel"
              >
                Cancel
              </v-btn>

              <v-btn
                text
                type="submit"
                color="primary"
              >
                Save changes
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </wtf-page-viewer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      profile: {},
      edit: {},
      editProfile: false
    }
  },
  computed: {
    canEdit () {
      if (this.$auth.loggedIn) {
        return this.$auth.user._id === this.profile._id || this.$auth.user.owner || this.$auth.user.admin
      } else {
        return false
      }
    },
    displayname () {
      return this.profile.displayName || this.profile.username
    }
  },
  mounted () {
    this.$axios.get(`/api/users/username/${this.$route.params.username}`)
      .then((res) => {
        this.profile = res.data
      }).catch((err) => {
        this.$nuxt.error(err)
      })
  },
  methods: {
    async saveChanges (evt) {
      evt.preventDefault()

      try {
        const newUser = await this.$axios.post(`/api/users/profile/${this.profile._id}`, this.edit)

        if (newUser) {
          this.profile = newUser.data
          this.edit = {}
          this.editProfile = false

          this.$auth.setUser(newUser.data)
        }
      } catch (err) {
        // idk
      }
    },
    cancel () {
      this.edit = {}
      this.editProfile = false
    },
    showEditDialog () {
      this.edit = Object.assign(this.profile)
      this.editProfile = true
    }
  }
}
</script>

<style scoped>
.wtf-cover {
  position: relative;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
