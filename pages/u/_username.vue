<template>
  <div>
    <wtf-page-viewer>
      <template slot="prepend">
        <v-responsive :aspect-ratio="48/9" class="primary">
          <v-img class="wtf-cover" />

          <v-flex class="d-flex flex-row justify-end mt-2 mr-2 align-center">
            <v-menu left offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="canEdit"
                  icon
                  v-on="on"
                >
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="showEditDialog">
                  <v-list-item-content>
                    <v-list-item-title>
                      Edit profile
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="showAvatarDialog">
                  <v-list-item-content>
                    <v-list-item-title>
                      Edit avatar
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-flex>
        </v-responsive>
      </template>

      <template slot="title">
        <v-flex class="d-flex flex-row align-center">
          <v-avatar
            color="primary"
          >
            <v-icon>mdi-account</v-icon>
          </v-avatar>

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

      <v-dialog
        v-model="editAvatar"
        persistent
        width="400"
      >
        <v-card>
          <v-card-title class="title">
            Edit user avatar
          </v-card-title>
          <v-divider />

          <v-card-text>
            <v-flex class="d-flex flex-column align-center">
              <v-avatar
                size="256"
              >
                <v-img :src="avatarUrl" />
              </v-avatar>

              <v-file-input
                style="width: 100%;"
                accept="image/*"
                label="Select avatar image"
                @change="setAvatarToUpload"
              />
            </v-flex>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="cancelAvatar"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="saveAvatar"
            >
              Save
            </v-btn>
          </v-card-actions>
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
      editProfile: false,
      avatarUrl: '',
      avatarToUpload: null,
      editAvatar: false
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
    },
    showAvatarDialog () {
      this.editAvatar = true
      this.avatarUrl = this.profile.avatar
    },
    setAvatarToUpload (file) {
      const url = URL.createObjectURL(file)
      this.avatarUrl = url.toString()
      this.avatarToUpload = file
    },
    cancelAvatar () {
      this.avatarUrl = this.profile.avatar
      this.avatarToUpload = null
      this.editAvatar = false
    },
    saveAvatar () {
      if (this.avatarToUpload) {
        const formData = new FormData()
        formData.set('file', this.avatarToUpload)

        this.$axios.post(`/api/users/avatar/${this.profile._id}`, formData)
          .then((res) => {
            this.profile.avatar = res.data.url
            this.cancelAvatar()
          }).catch((err) => {
            alert(err)
          })
      } else {
        this.cancelAvatar()
      }
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
