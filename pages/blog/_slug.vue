<template>
  <div v-if="post">
    <h1 class="headline">
      {{ post.name }}
    </h1>
    <h2 class="subtitle-2 text--secondary">
      Posted {{ getCreatedAt(post) }}.
    </h2>

    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <v-img v-if="post.featuredUrl" :src="post.featuredUrl" />

        <p v-if="post.excerpt" class="body-2">
          {{ post.excerpt }}
        </p>

        <div class="body-2">
          <wtf-renderer v-model="post.body" />
        </div>

        <v-divider />

        <h4 class="subtitle-1">
          Comments
        </h4>

        <wtf-comments v-model="comments" :post-id="post.slug" />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card-title>Related posts</v-card-title>
        <v-card-text>
          This part of the page is under construction and not yet implemented.
        </v-card-text>
      </v-col>
    </v-row>
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
        views: 0
      },
      commentBody: '',
      comments: []
    }
  },
  mounted () {
    this.$axios.get(`/api/posts/${this.$route.params.slug}`)
      .then((res) => {
        this.post = res.data
        this.$axios.get(`/api/posts/${this.post.slug}/comments`)
          .then((res) => {
            this.comments = res.data.sort((a, b) => {
              const aDate = Date.parse(a.posted)
              const bDate = Date.parse(b.posted)
              return bDate - aDate
            })
          })
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
    ago (comment) {
      return moment(comment.posted).fromNow()
    },
    autoAvatar (author) {
      const displayName = this.display(author)
      return displayName.slice(0, 1).toUpperCase()
    },
    display (author) {
      return author.displayName || author.username
    },
    getCreatedAt (post) {
      return moment(post.created).fromNow()
    },
    categoryOf (post) {
      return (post.category) ? post.category : 'Uncategorized'
    },
    postComment (evt) {
      evt.preventDefault()
      const trimmed = this.commentBody && this.commentBody.trim()
      if (trimmed) {
        this.$axios.post(`/api/posts/${this.post.slug}/comments`, { comment: trimmed })
          .then((res) => {
            const postedComment = res.data.comment
            postedComment.author = res.data.author
            this.comments.unshift(postedComment)
            this.commentBody = ''
          })
      }
    }
  }
}
</script>
