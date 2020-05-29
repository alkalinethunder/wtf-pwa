<template>
  <wtf-login permanent @cancelled="goHome" @success="goHome" />
</template>

<script>
export default {
  methods: {
    goHome () {
      this.$router.replace('/')
    }
  }
}
</script>
