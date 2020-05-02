<template>
  <div>
    <wtf-page-viewer v-model="page" />
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
