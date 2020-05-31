<template>
  <div>
    <div v-if="postId">
      <v-form v-if="$auth.loggedIn" @submit="postComment">
        <v-flex class="d-flex flex-row mb-4 mt-4">
          <wtf-avatar :user="$auth.user" />
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

            <v-btn v-if="canModerate || userOwns(comment)" icon small @click="startEdit(comment)">
              <v-icon small>
                mdi-lead-pencil
              </v-icon>
            </v-btn>

            <v-btn v-if="canModerate || userOwns(comment)" icon small @click="startDelete(comment)">
              <v-icon small>
                mdi-delete
              </v-icon>
            </v-btn>

            <v-btn v-if="canModerate" icon small>
              <v-icon small>
                mdi-dots-horizontal
              </v-icon>
            </v-btn>
          </template>

          <v-form
            v-if="replying === comment._id && $auth.loggedIn"
            @submit="postComment"
          >
            <v-flex class="d-flex flex-row mb-6 mt-4">
              <wtf-avatar :user="$auth.user" />
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

          <wtf-comment v-for="reply of replies(comment._id)" :key="reply._id" :comment="reply">
            <template slot="comment-actions">
              <v-btn v-if="canModerate || userOwns(reply)" icon small @click="startEdit(reply)">
                <v-icon small>
                  mdi-lead-pencil
                </v-icon>
              </v-btn>

              <v-btn v-if="canModerate || userOwns(reply)" icon small @click="startDelete(reply)">
                <v-icon small>
                  mdi-delete
                </v-icon>
              </v-btn>

              <v-btn v-if="canModerate" icon small>
                <v-icon small>
                  mdi-dots-horizontal
                </v-icon>
              </v-btn>
            </template>
          </wtf-comment>
        </wtf-comment>
      </div>
    </div>
    <p v-else class="caption">
      There are no comments to display yet.
    </p>

    <v-dialog
      v-model="deletingComment"
      persistent
      width="400"
    >
      <v-card>
        <v-card-title class="title">
          Delete comment
        </v-card-title>

        <v-divider />

        <v-card-text v-if="deleteComment && deleteComment.author">
          Are you sure you want to delete the following comment?

          <wtf-comment :comment="deleteComment" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            @click="cancelDelete"
          >
            Nope
          </v-btn>
          <v-btn
            text
            color="error"
            @click="confirmDelete"
          >
            Nukey McNukeface
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="editingComment"
      persistent
      width="630"
    >
      <v-card>
        <v-card-title class="title">
          Edit comment
        </v-card-title>
        <v-divider />

        <v-form @submit="saveEdit">
          <v-card-text v-if="edit">
            <div class="d-flex flex-row">
              <wtf-avatar :user="edit.author" />

              <v-flex class="d-flex flex-column ml-3 justify-start">
                <span class="subtitle-2">
                  {{ edit.author.displayName || edit.author.username }}
                </span>

                <v-textarea
                  v-model="edit.body"
                  rows="1"
                  dense
                  auto-grow
                  hint="Comment text"
                  :error-messages="error"
                />
              </v-flex>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="cancelEdit"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              type="submit"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
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
      replying: '',
      editingComment: false,
      deletingComment: false,
      deleteComment: {},
      edit: {
        id: '',
        body: '',
        author: {}
      },
      error: ''
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
    },
    canModerate () {
      return this.$auth.loggedIn && (this.$auth.user.owner || this.$auth.user.admin || this.$auth.user.editor || this.$auth.user.moderator)
    }
  },
  methods: {
    beginReply (id) {
      this.newComment = ''
      this.replying = id
    },
    cancelDelete () {
      this.deleteComment = {}
      this.deletingComment = false
    },
    async confirmDelete () {
      try {
        const res = await this.$axios.post(`/api/comment/${this.deleteComment._id}/delete`)

        if (res.data.commentType === 'post') {
          delete this.value.replies[res.data._id]
          this.value.comments = this.value.comments.filter(x => x._id !== res.data._id)
        } else {
          this.value.replies[res.data.belongsTo] = this.value.replies[res.data.belongsTo].filter(x => x._id !== res.data._id)
        }

        this.cancelDelete()
      } catch {
        // TODO
      }
    },
    cancelReply () {
      if (this.replying) {
        this.replying = ''
        this.newComment = ''
        this.newReply = ''
      }
    },
    startDelete (comment) {
      this.deleteComment = comment
      this.deletingComment = true
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
    userOwns (comment) {
      return this.$auth.loggedIn && this.$auth.user._id === comment.author._id
    },
    startEdit (comment) {
      this.editingComment = true
      this.edit.id = comment._id
      this.edit.author = comment.author
      this.edit.body = comment.body
    },
    cancelEdit () {
      this.editingComment = false
      this.edit = null
    },
    async saveEdit (evt) {
      evt.preventDefault()

      if (this.edit.body && this.edit.body.trim()) {
        try {
          const res = await this.$axios.post(`/api/comment/${this.edit.id}`, this.edit)

          if (res.data.commentType === 'post') {
            for (const postComment of this.value.comments) {
              if (postComment._id === res.data._id) {
                postComment.body = res.data.body
                return this.cancelEdit()
              }
            }
          } else {
            for (const reply of this.value.replies[res.data.belongsTo]) {
              if (reply._id === res.data._id) {
                reply.body = res.data.body
                this.cancelEdit()
                return
              }
            }
          }
        } catch (err) {
          this.error = err.message
        }
      } else {
        this.error = 'Comments cannot be blank.'
      }
    },
    replies (commentId) {
      return this.value.replies[commentId] || []
    }
  }
}
</script>
