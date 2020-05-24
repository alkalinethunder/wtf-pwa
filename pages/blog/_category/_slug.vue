<template>
  <div>
    <wtf-page-viewer>
      <template slot="title">
        {{ post.name }}
      </template>
      <template slot="page-information">
        Posted {{ created }} by {{ author }}
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

      <template slot="sidebar">
        <v-flex class="d-flex flex-row mb-6">
          <v-avatar color="primary" />

          <v-flex class="d-flex flex-column ml-3">
            <span class="overline">
              About the author
            </span>
            <span class="subtitle-1 mb-4">
              {{ post.author.displayName || post.author.username }}
            </span>

            <wtf-renderer v-if="post.author.about" v-model="post.author.about" />
            <p v-else class="body-2">
              This user has nothing to say about themselves.
            </p>
          </v-flex>
        </v-flex>

        <v-flex class="d-flex flex-column mb-6">
          <span class="overline">
            Recent posts in {{ post.category.name }}
          </span>

          <v-list dense>
            <v-list-item v-for="recentPost of recent" :key="recentPost._id" :to="`/blog/${recentPost.category.slug}/${recentPost.slug}`">
              <v-list-item-content>
                <v-list-item-title>
                  {{ recentPost.name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-btn text :to="`/blog/${post.category.slug}`" class="transparent mr-auto">
            View all
          </v-btn>
        </v-flex>
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
        author: {
          displayName: '',
          username: ''
        },
        category: {
          slug: 'uncategorized',
          name: 'Uncategorized'
        },
        views: 0
      },
      recent: [],
      commentBody: '',
      comments: []
    }
  },
  computed: {
    created () {
      return moment(this.post.created).fromNow()
    },
    author () {
      return this.post.author.displayName || this.post.author.username
    }
  },
  mounted () {
    this.$axios.get(`/api/posts/${this.$route.params.slug}`)
      .then((res) => {
        this.post = res.data
        this.$axios.get(`/api/category/${this.post.category.slug}`)
          .then((res) => {
            const sortedByDate = res.data.posts.filter(p => p._id !== this.post._id).sort((a, b) => {
              const aDate = Date.parse(a.posted)
              const bDate = Date.parse(b.posted)
              return bDate - aDate
            })

            if (sortedByDate.length > 5) {
              this.recent = sortedByDate.slice(0, 5)
            } else {
              this.recent = sortedByDate
            }

            this.$axios.get(`/api/posts/${this.post.slug}/comments`)
              .then((res) => {
                this.comments = res.data.sort((a, b) => {
                  const aDate = Date.parse(a.posted)
                  const bDate = Date.parse(b.posted)
                  return bDate - aDate
                })
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
