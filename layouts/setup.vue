<template>
  <v-app>
    <span class="bg" />

    <v-content app>
      <v-container>
        <v-sheet>
          <v-container fluid>
            <nuxt />
          </v-container>
        </v-sheet>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  mounted () {
    this.$vuetify.theme.dark = true
  }
}
</script>

<style scoped>
.bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: url('/img/auth-backdrop.png') no-repeat center center;
  background-size: cover;
}
</style>
