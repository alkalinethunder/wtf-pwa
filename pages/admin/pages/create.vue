<template>
  <div>
    <v-card-title class="display-1">
      Create page
    </v-card-title>

    <v-card>
      <wtf-page-editor v-model="page" fab creator @saved="created" />
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      page: {
        name: '',
        body: '',
        parent: null,
        created: '',
        edited: ''
      }
    }
  },
  methods: {
    created (res) {
      this.$router.replace('/admin/pages')
    }
  }
}
</script>
