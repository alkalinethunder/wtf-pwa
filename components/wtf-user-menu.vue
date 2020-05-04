<template>
  <div>
    <v-menu v-if="$auth.loggedIn" offset-y>
      <template v-slot:activator="{ on }">
        <v-list nav>
          <v-list-item nav color="transparent" v-on="on">
            <v-list-item-avatar color="primary">
              <v-icon>mdi-account</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ $auth.user.displayName || $auth.user.username }}</v-list-item-title>
              <v-list-item-subtitle>Logged in</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-chevron-down</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
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
      <v-btn text to="/auth/login">
        Log in
      </v-btn>
      <v-btn text to="/auth/register">
        Create account
      </v-btn>
    </div>
  </div>
</template>
