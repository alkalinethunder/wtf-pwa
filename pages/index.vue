<template>
  <div>
    <v-card-title class="display-1">{{ page.name }}</v-card-title>

    <v-card-subtitle>Created {{ created }} - Last edited {{ lastEdited }}</v-card-subtitle>

    <v-card-text>
      <wtf-renderer v-model="page.body" />
    </v-card-text>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      page: {
        name: '',
        body: '',
        created: null,
        edited: null
      }
    }
  },
  computed: {
    created () {
      return moment(this.page.created).fromNow()
    },
    lastEdited () {
      return moment(this.page.edited).fromNow()
    }
  },
  mounted () {
    this.$axios.get('/api/pages/index')
      .then((res) => {
        this.page = res.data
      })
  }
}
</script>
