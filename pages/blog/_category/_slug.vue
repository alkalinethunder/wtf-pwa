<template>
  <div>
    <wtf-page-viewer>
      <template slot="title">
        {{ post.name }}
      </template>
      <template slot="before-content">
        <h2 class="subtitle-2 text--secondary">
          Posted {{ getCreatedAt(post) }} &bull;
          <v-chip :to="`/blog/${post.category.slug}`" small>
            {{ post.category.name }}
          </v-chip>
        </h2>
      </template>

      <v-img v-if="post.featuredUrl" :src="post.featuredUrl" />

      <p v-if="post.excerpt" class="body-2">
        {{ post.excerpt }}
      </p>

      <wtf-renderer v-model="post.body" />

      <template slot="after-content">
        <h4 class="subtitle-1">
          Comments
        </h4>

        <wtf-comments v-model="comments" :post-id="post.slug" />
      </template>
    </wtf-page-viewer>
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
        category: {
          slug: 'uncategorized',
          name: 'Uncategorized'
        },
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
