<template>
  <v-responsive :aspect-ratio="16/9">
    <iframe
      frameborder="0"
      :src="src"
    />
  </v-responsive>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    src () {
      return `https://youtube.com/embed/${this.id}`
    }
  }
}
</script>

<style>
iframe {
  width: 100% !important;
  height: 100% !important;
}
</style>
