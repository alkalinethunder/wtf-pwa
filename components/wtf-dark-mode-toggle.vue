<template>
  <v-btn icon :small="small" @click="toggleDarkMode">
    <v-icon>mdi-invert-colors</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    small: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleDarkMode (evt) {
      this.$store.commit('siteSettings/toggleDarkMode')
    }
  }
}
</script>
