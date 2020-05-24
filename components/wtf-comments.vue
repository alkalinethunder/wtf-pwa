<template>
  <div>
    <div v-if="postId">
      <v-form v-if="$auth.loggedIn" @submit="postComment">
        <v-flex class="d-flex flex-row mb-6 mt-4">
          <v-avatar color="primary" />
          <v-flex class="d-flex flex-column justify-start ml-3">
            <v-textarea
              v-model="newComment"
              label="Post a new comment"
              rows="1"
              auto-grow
            />

            <v-flex v-if="newComment.length" class="d-flex flex-row align-center">
              <v-btn color="primary" type="submit" :disabled="!commentValid">
                Post
              </v-btn>
              <v-btn text @click="newComment = ''">
                Cancel
              </v-btn>
            </v-flex>
          </v-flex>
        </v-flex>
      </v-form>
    </div>
    <div v-if="value && value.length">
      <div v-for="comment of value" :key="comment._id">
        <wtf-comment :comment="comment" />
      </div>
    </div>
    <p v-else class="caption">
      There are no comments to display yet.
    </p>
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
