<template>
  <div>
    <v-toolbar
      color="primary"
      extended
    >
      <template slot="extension">
        <v-btn
          fab
          absolute
          bottom
          left
          color="primary"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>

        <v-spacer />

        <v-btn
          v-if="$auth.loggedIn && ($auth.user.owner || $auth.user.admin)"
          text
          :to="`/admin/users/${profile.username}`"
        >
          Administrate
        </v-btn>

        <v-btn
          v-if="$auth.loggedIn && ($auth.user._id === profile._id || $auth.user.owner || $auth.user.admin)"
          icon
          @click="showEditDialog"
        >
          <v-icon>mdi-lead-pencil</v-icon>
        </v-btn>
      </template>
    </v-toolbar>

    <v-container class="mt-4">
      <h1 class="headline">
        {{ displayname }}
      </h1>
      <h2 class="subtitle-2 text--secondary">
        @{{ profile.username }}
      </h2>

      <v-row>
        <v-col
          cols="12"
          md="8"
        >
          <h4 class="overline">
            About
          </h4>

          <div v-if="profile.about" class="body-1">
            <wtf-renderer v-model="profile.about" />
          </div>
          <p v-else class="text--secondary">
            Nothing to display here... the user hasn't written anything about themselves yet!
          </p>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog
      v-if="$auth.loggedIn && ($auth.user._id === profile._id || $auth.user.owner || $auth.user.admin)"
      v-model="editProfile"
    >
      <v-container>
        <v-card>
          <v-card-title class="title">
            Edit profile
          </v-card-title>

          <v-divider />

          <v-form @submit="saveChanges">
            <v-card-text>
              <v-text-field
                v-model="edit.displayName"
                label="display name"
              />
            </v-card-text>

            <Editor v-model="edit.about" mode="editor" />

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
              >
                Save changes
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-container>
    </v-dialog>

  </div>
</template>

<script>
export default {
  layout: 'no-container',
  data () {
    return {
      profile: {},
      edit: {},
      editProfile: false
    }
  },
  computed: {
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
    saveChanges (evt) {
      evt.preventDefault()
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
