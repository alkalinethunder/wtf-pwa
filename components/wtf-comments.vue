<template>
  <div>
    <div v-if="postId">
      <v-form v-if="$auth.loggedIn" @submit="postComment">
        <v-card-text>
          <v-text-field v-model="newComment" label="Post a new comment" multi-line dense />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text type="submit" :disabled="!commentValid">
            Post
          </v-btn>
        </v-card-actions>
      </v-form>
    </div>
    <div v-if="value && value.length">
      <div v-for="comment of value" :key="comment._id">
        <wtf-comment :comment="comment" />
      </div>
    </div>
    <v-card-text v-else>
      <p>There are no comments to display yet.</p>
    </v-card-text>
  </div>
</template>

<script>
export default {
  props: {
    postId: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      newComment: ''
    }
  },
  computed: {
    commentValid () {
      return this.newComment && this.newComment.trim().length
    }
  },
  methods: {
    postComment (evt) {
      evt.preventDefault()

      if (this.commentValid) {
        this.$axios.post(`/api/posts/${this.postId}/comments`, { comment: this.newComment.trim() })
          .then((res) => {
            const postedComment = res.data.comment
            postedComment.author = res.data.author
            this.value.unshift(postedComment)
            this.newComment = ''
          })
      }
    }
  }
}
</script>
