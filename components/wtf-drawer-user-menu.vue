<template>
  <div>
    <v-list-item v-if="$auth.loggedIn" two-line>
      <wtf-avatar :user="$auth.user" />
      <v-list-item-content class="ml-3">
        <v-list-item-title>{{ displayname }}</v-list-item-title>
        <v-list-item-subtitle v-if="admin">
          Administrating
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
          Logged in
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-btn v-if="admin" icon to="/" exact>
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
      <v-btn v-else icon to="/auth/logout">
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
      <wtf-dark-mode-toggle />
    </v-list-item>
    <v-list-item v-else>
      <v-list-item-content>
        <v-list-item-title>Not logged in.</v-list-item-title>
      </v-list-item-content>

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
      <wtf-dark-mode-toggle />
    </v-list-item>
  </div>
</template>

<script>
export default {
  props: {
    admin: {
      type: Boolean,
      value: false
    }
  },
  computed: {
    displayname () {
      return this.$auth.user.displayName || this.$auth.user.username
    }
  }
}
</script>
