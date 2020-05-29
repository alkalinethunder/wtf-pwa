<template>
  <div>
    <v-menu v-if="$auth.loggedIn" offset-y>
      <template v-slot:activator="{ on }">
        <v-list-item nav class="transparent d-flex justify-start align-center flex-row" v-on="on">
          <v-avatar color="primary" size="32" />
          <v-flex class="d-flex flex-column ml-3 mr-3">
            <span class="subtitle-2">
              {{ $auth.user.displayName || $auth.user.username }}
            </span>
            <span class="caption">
              {{ rank }}
            </span>
          </v-flex>
          <v-icon>
            mdi-chevron-down
          </v-icon>
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
    <div v-else>
      <wtf-login>
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            Log in
          </v-btn>
        </template>
      </wtf-login>
      <wtf-create-account>
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            Create account
          </v-btn>
        </template>
      </wtf-create-account>
    </div>
  </div>
</template>

<script>
export default {
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
