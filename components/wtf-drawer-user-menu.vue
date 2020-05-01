<template>
  <div>
    <v-list-item v-if="$auth.loggedIn" two-line>
      <v-list-item-content>
        <v-list-item-title>{{ displayname }}</v-list-item-title>
        <v-list-item-subtitle>Logged in.</v-list-item-subtitle>
      </v-list-item-content>

      <v-btn icon to="/auth/logout">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-list-item>
    <v-list-item v-else>
      <v-list-item-content>
        <v-list-item-title>Not logged in.</v-list-item-title>
      </v-list-item-content>

      <v-btn icon to="/auth/login">
        <v-icon>mdi-login</v-icon>
      </v-btn>
      <v-btn icon to="/auth/register">
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </v-list-item>
  </div>
</template>

<script>
export default {
  computed: {
    displayname () {
      return this.$auth.user.displayName || this.$auth.user.username
    }
  }
}
</script>
