<template>
  <div>
    <wtf-page-viewer v-model="page" :breadcrumbs="breadcrumbs" />
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
      },
      breadcrumbs: [
        {
          text: '/',
          exact: true,
          to: '/'
        }
      ]
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
    this.$axios.get(`/api/page/${this.$route.path}`)
      .then((res) => {
        this.page = res.data.page
        for (const breadcrumb of res.data.breadcrumbs) {
          this.breadcrumbs.push({
            to: breadcrumb.url,
            exact: true,
            text: breadcrumb.name
          })
        }
      }).catch((err) => {
        this.$nuxt.error(err)
      })
  }
}
</script>
