<template>
  <div v-if="post">
    <v-card>
      <v-img v-if="post.featuredUrl" :src="post.featuredUrl">
        <v-card-title>{{ post.name }}</v-card-title>
      </v-img>
      <v-card-title v-else>
        {{ post.name }}
      </v-card-title>
      <v-card-subtitle>Created {{ getCreatedAt(post) }} - <strong>{{ categoryOf(post) }}</strong></v-card-subtitle>

      <!-- eslint-disable vue/no-v-html -->
      <v-card-text v-html="$md.render(post.body)" />
    </v-card>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      post: {
        name: '',
        body: '',
        created: new Date(),
        featuredUrl: '',
        tags: [],
        category: null,
        views: 0,
        comments: []
      }
    }
  },
  mounted () {
    this.$axios.get(`/api/posts/${this.$route.params.slug}`)
      .then((res) => {
        this.post = res.data
      })
      .catch((err) => {
        if (err) {
          alert(JSON.stringify(err))
          return this.$nuxt.error({
            statusCode: 404,
            message: 'Post not found.'
          })
        }
      })
  },
  methods: {
    getCreatedAt (post) {
      return moment(post.created).fromNow()
    },
    categoryOf (post) {
      return (post.category) ? post.category : 'Uncategorized'
    }
  }
}
</script>
