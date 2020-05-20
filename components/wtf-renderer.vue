<template>
  <div>
    <markdown-renderer v-model="value" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
code {
  background-color: transparent !important;
}
</style>
