<template>
  <div>
    <wtf-page-viewer>
      <template slot="title">
        <h1 class="display-1">
          All posts in "{{ category.name }}"
        </h1>
      </template>

      <template slot="before-content">
        <p class="body-1">
          This is a list of all blog posts in the category "{{ category.name }}".
        </p>
      </template>

      <wtf-post-card v-for="post of posts" :key="post._id" :post="post" />
    </wtf-page-viewer>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      posts: [],
      category: {},
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
    this.$axios.get(`/api/category/${this.$route.params.category}`)
      .then((res) => {
        this.category = res.data.category
        this.posts = res.data.posts

        this.page.name = `All posts in "${this.category.name}"`
        this.page.slug = this.category.slug

        this.breadcrumbs.push({
          text: this.category.name,
          slug: `/blog/${this.category.slug}`,
          exact: true
        })
      }).catch((err) => {
        this.$nuxt.error(err)
      })
  },
  methods: {
    created (post) {
      return moment(post.created).fromNow()
    }
  }
}
</script>
