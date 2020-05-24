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

      <v-card v-for="post in posts" :key="post._id" :to="`/blog/${post.category.slug}/${post.slug}`">
        <v-list-item three-line dense>
          <v-list-item-content>
            <v-list-item-title class="overline">
              {{ post.category.slug }}
            </v-list-item-title>
            <v-list-item-subtitle class="title">
              {{ post.name }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Created {{ created(post) }}.
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-card-text v-if="post.excerpt">
          {{ post.excerpt }}
        </v-card-text>
      </v-card>
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
