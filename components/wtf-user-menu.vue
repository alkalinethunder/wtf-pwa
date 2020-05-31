<template>
  <div>
    <v-menu v-if="$auth.loggedIn" offset-y left>
      <template v-if="mobile" v-slot:activator="{ on }">
        <v-btn icon small v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <template v-else v-slot:activator="{ on }">
        <v-list-item dense nav class="transparent" v-on="on">
          <v-list-item-avatar v-if="$auth.user.avatar" size="32">
            <v-img :src="$auth.user.avatar" />
          </v-list-item-avatar>
          <v-list-item-icon v-else>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ $auth.user.displayName || $auth.user.username }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ rank }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon>
            <v-icon>mdi-chevron-down</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </template>

      <v-list subheader>
        <v-subheader>
          Account
        </v-subheader>
        <v-list-item :to="`/u/${$auth.user.username}`">
          <v-list-item-content>
            <v-list-item-title>My profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-subheader>
          Actions
        </v-subheader>
        <v-list-item to="/auth/logout">
          <v-list-item-content>
            <v-list-item-title>Log out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <div v-else class="d-flex flex-row align-center">
      <wtf-login>
        <template v-slot:activator="{ on }">
          <v-btn small icon class="ml-1 mr-1" v-on="on">
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </template>
      </wtf-login>
      <wtf-create-account>
        <template v-slot:activator="{ on }">
          <v-btn small icon class="mr-1" v-on="on">
            <v-icon>mdi-account-plus</v-icon>
          </v-btn>
        </template>
      </wtf-create-account>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mobile: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    rank () {
      const { owner, admin, moderator, editor } = this.$auth.user
      if (owner) {
        return 'Owner'
      } else if (admin) {
        return 'Administrator'
      } else if (editor) {
        return 'Editor'
      } else if (moderator) {
        return 'Moderator'
      } else {
        return 'Logged in'
      }
    }
  }
}
</script>
