<template>
  <div>
    <h1>Blog</h1>

    <v-row>
      <v-col>
        <div v-if="posts.length">
          <div v-for="post of posts" :key="post.id">
            <v-card :to="url(post)">
              <v-img v-if="post.featuredUrl" :src="post.featuredUrl" />

              <v-card-title>
                {{ post.name }}
              </v-card-title>
              <v-card-subtitle>
                Created {{ getCreatedDate(post) }}
              </v-card-subtitle>

              <v-card-text>
                {{ post.excerpt }}
              </v-card-text>
            </v-card>
          </div>
        </div>
        <div v-else>
          <v-card outlined class="text-center">
            <v-card-subtitle>This is awkward.</v-card-subtitle>

            <v-card-text>There are currently no blog posts to display.</v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      valid: false,
      posts: []
    }
  },
  mounted () {
    this.$axios.get('/api/posts')
      .then((res) => {
        this.posts = res.data
      })
      .catch((err) => {
        if (err) {
          alert(JSON.stringify(err))
        }
      })
  },
  methods: {
    url (post) {
      return `/blog/${post.slug}`
    },
    getCreatedDate (post) {
      return moment(post.created).fromNow()
    }
  }
}
</script>
