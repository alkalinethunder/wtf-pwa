<template>
  <div v-if="post">
    <v-card>
      <v-img v-if="post.featuredUrl" :src="post.featuredUrl">
        <v-card-title primary-title class="headline">
          {{ post.name }}
        </v-card-title>
      </v-img>
      <v-card-title v-else primary-title class="headline">
        {{ post.name }}
      </v-card-title>
      <v-card-subtitle>Created {{ getCreatedAt(post) }} - <strong>{{ categoryOf(post) }}</strong></v-card-subtitle>

      <v-card-text>
        <p v-if="post.excerpt">{{ post.excerpt }}</p>

        <!-- eslint-disable vue/no-v-html -->
        <div v-html="$md.render(post.body)" />
      </v-card-text>

      <v-card-title>Comments</v-card-title>

      <v-form v-if="$auth.loggedIn" @submit="postComment">
        <v-card-text>
          <v-textarea v-model="commentBody" label="Post a comment" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text type="submit">
            Post
          </v-btn>
        </v-card-actions>
      </v-form>

      <v-list v-if="comments.length">
        <v-list-item v-for="comment of comments" :key="comment._id" two-line>
          <v-list-item-avatar color="primary">
            <v-img v-if="comment.author.avatar" :src="comment.author.avatar" />
            <span v-else class="display-1">{{ autoAvatar(comment.author) }}</span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ display(comment.author) }}
              <span class="grey--text">
                posted {{ ago(comment) }}
              </span>
            </v-list-item-title>
            <v-list-item-subtitle>{{ comment.body }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div v-else>
        <v-card-text v-if="$auth.loggedIn">
          This post has no comments. Be the first to say what you think!
        </v-card-text>
        <v-card-text v-else>
          This post has no comments yet.
          <nuxt-link to="/auth/login">
            Sign in
          </nuxt-link>
          or
          <nuxt-link to="/auth/register">
            create an account
          </nuxt-link>
          to be the first to say what you think.
        </v-card-text>
      </div>
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
            this.comments = res.data
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
