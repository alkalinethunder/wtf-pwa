<template>
  <div>
    <v-menu v-if="$auth.loggedIn" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn icon class="ml-2" v-on="on">
          <wtf-avatar :user="$auth.user" list-item />
        </v-btn>
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
          <v-btn icon v-on="on">
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </template>
      </wtf-login>
      <wtf-create-account>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-account-plus</v-icon>
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
