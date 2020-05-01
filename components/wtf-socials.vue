<template>
  <div>
    <v-btn icon :small="small">
      <v-icon>mdi-youtube</v-icon>
    </v-btn>
    <v-btn icon :small="small">
      <v-icon>mdi-twitter</v-icon>
    </v-btn>
    <v-btn icon :small="small">
      <v-icon>mdi-github</v-icon>
    </v-btn>
    <v-btn icon :small="small">
      <v-icon>mdi-reddit</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    small: {
      type: Boolean,
      default: false
    }
  }
}
</script>
