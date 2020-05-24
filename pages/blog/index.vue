<template>
  <div>
    <wtf-page-viewer :breadcrumbs="breadcrumbs">
      <template slot="title">
        {{ page.name }}
      </template>

      <template slot="before-content">
        <wtf-renderer v-model="page.body" />
      </template>

      <div v-if="posts.length">
        <wtf-post-card v-for="post of posts" :post="post" :key="post._id" />
      </div>
      <div v-else>
        <v-card outlined class="text-center">
          <v-card-subtitle>This is awkward.</v-card-subtitle>

          <v-card-text>There are currently no blog posts to display.</v-card-text>
        </v-card>
      </div>

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
      valid: false,
      posts: [],
      page: {
        _id: null,
        name: 'Blog',
        body: '',
        slug: 'blog',
        parent: null,
        created: null,
        edited: null
      },
      breadcrumbs: [
        {
          text: '/',
          to: '/',
          exact: true
        },
        {
          text: 'Blog',
          to: '/blog',
          exact: true
        }
      ]
    }
  },
  mounted () {
    this.$axios.get('/api/posts')
      .then((res) => {
        this.posts = res.data
        this.$axios.get('/api/page/blog')
          .then((res) => {
            this.page = res.data.page
          })
      })
      .catch((err) => {
        if (err) {
          alert(JSON.stringify(err))
        }
      })
  },
  methods: {
    url (post) {
      return `/blog/${post.category.slug}/${post.slug}`
    },
    getCreatedDate (post) {
      return moment(post.created).fromNow()
    }
  }
}
</script>
