<template>
  <div>
    <v-btn v-if="$auth.loggedIn" text to="/auth/logout">
      Log out
    </v-btn>
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
