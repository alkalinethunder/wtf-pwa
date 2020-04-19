<template>
  <div>
    <h3 class="text-center">
      Logging out
    </h3>
    <p class="text-center">
      Please wait while we log you out.
    </p>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  mounted () {
    this.$auth.logout()
      .then(() => {
        this.$router.push('/')
      }).catch(() => {
        this.$router.push('/')
      })
  }
}
</script>
