<template>
  <div>
    <div v-if="postId">
      <v-form v-if="$auth.loggedIn" @submit="postComment">
        <v-flex class="d-flex flex-row mb-4 mt-4">
          <v-avatar color="primary" />
          <v-flex class="d-flex flex-column justify-start ml-3">
            <v-textarea
              v-model="newComment"
              label="Post a new comment"
              rows="1"
              auto-grow
              @focus="cancelReply"
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
    <div v-if="comments && comments.length">
      <div v-for="comment of comments" :key="comment._id">
        <wtf-comment :comment="comment">
          <template slot="comment-actions">
            <v-btn v-if="$auth.loggedIn" text small @click="beginReply(comment._id)">
              Reply
            </v-btn>
          </template>

          <v-form
            v-if="replying === comment._id && $auth.loggedIn"
            @submit="postComment"
          >
            <v-flex class="d-flex flex-row mb-6 mt-4">
              <v-avatar color="primary" />
              <v-flex class="d-flex flex-column justify-start ml-3">
                <v-textarea
                  v-model="newReply"
                  label="Post a new comment"
                  rows="1"
                  auto-grow
                />

                <v-flex class="d-flex flex-row align-center">
                  <v-btn color="primary" type="submit" :disabled="!commentValid">
                    Post
                  </v-btn>
                  <v-btn text @click="cancelReply">
                    Cancel
                  </v-btn>
                </v-flex>
              </v-flex>
            </v-flex>
          </v-form>

          <wtf-comment v-for="reply of replies(comment._id)" :key="reply._id" :comment="reply" />
        </wtf-comment>
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
      type: Object,
      default: () => []
    }
  },
  data () {
    return {
      newComment: '',
      newReply: '',
      replying: ''
    }
  },
  computed: {
    comments () {
      return this.value.comments || []
    },
    commentValid () {
      return this.replying
        ? this.newReply && this.newReply.trim().length
        : this.newComment && this.newComment.trim().length
    }
  },
  methods: {
    beginReply (id) {
      this.newComment = ''
      this.replying = id
    },
    cancelReply () {
      if (this.replying) {
        this.replying = ''
        this.newComment = ''
        this.newReply = ''
      }
    },
    postComment (evt) {
      evt.preventDefault()

      if (this.commentValid) {
        this.$axios.post('/api/comments', {
          type: this.replying ? 'reply' : 'post',
          commentFor: this.replying || this.postId,
          body: this.replying ? this.newReply : this.newComment
        })
          .then((res) => {
            const postedComment = res.data
            postedComment.author = this.$auth.user
            if (postedComment.commentType === 'post') {
              this.value.comments.unshift(postedComment)
            } else {
              this.value.replies[postedComment.belongsTo].push(postedComment)
            }
            this.replying = ''
            this.newReply = ''
            this.newComment = ''
          })
      }
    },
    replies (commentId) {
      return this.value.replies[commentId] || []
    }
  }
}
</script>
