<template>
  <div>
    <v-card-title class="display-1">
      Edit page
    </v-card-title>

    <wtf-page-editor v-model="page" fab />
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
    this.$axios.get(`/api/pages/id/${this.$route.params.id}`)
      .then((res) => {
        this.page = res.data
      })
  }
}
</script>
