<template>
  <div>
    <v-card-title class="display-1">
      Edit page
    </v-card-title>

    <v-card v-if="page">
      <wtf-page-editor v-model="page" fab @saved="goBack" />
    </v-card>
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
    this.$axios.get(`/api/pages/${this.$route.params.id}`)
      .then((res) => {
        this.page = res.data
      })
  },
  methods: {
    goBack (newPage) {
      this.$router.replace('/admin/pages')
    }
  }
}
</script>
