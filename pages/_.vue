<template>
  <div>
    <wtf-page-viewer :breadcrumbs="breadcrumbs">
      <template slot="title">
        {{ page.name }}
      </template>

      <wtf-renderer v-model="page.body" />

      <template slot="page-information">
        Created {{ created }}, last edited {{ lastEdited }}.
      </template>

      <template slot="page-actions">
        <wtf-quick-editor v-model="page" />
      </template>
    </wtf-page-viewer>
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
