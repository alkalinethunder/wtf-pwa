<template>
  <div>
    <v-card-title class="display-1">
      {{ page.name }}
    </v-card-title>
  </div>
</template>

<script>
export default {
  data () {
    return {
      page: {}
    }
  },
  mounted () {
    if (this.$route.params.page === 'index') {
      this.$router.replace('/')
    } else {
      this.$axios.get(`/api/pages/${this.$route.params.page}`)
        .then((res) => {
          this.page = res.data
        }).catch((err) => {
          this.$nuxt.error(err)
        })
    }
  }
}
</script>
