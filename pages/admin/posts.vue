<template>
  <div>
    <h1 class="display-2">Posts</h1>

    <v-list>
      <v-list-item v-for="post in posts" :key="post._id">
        <v-list-item-icon>
          <v-icon>mdi-book</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ post.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ createdAgo(post) }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-btn icon :to="postEdit(post)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item @click="moreInfo(post)">
              <v-list-item-content>
                <v-list-item-title>More info</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="showDeleteDialog(post)">
              <v-list-item-content>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
    </v-list>

    <v-dialog v-model="deleteOpen">
      <v-card v-if="more">
        <v-card-title
          class="headline grey lighter-2"
          primary-title
        >
          Delete "{{ more.name }}"
        </v-card-title>

        <v-card-text>
          Are you sure you want to permanently delete this blog post?
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deletePost(more)">
            Yes
          </v-btn>
          <v-btn text @click="deleteOpen = false">
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="moreOpen">
      <v-card v-if="more">
        <v-card-title
          class="headline grey lighter-2"
          primary-title
        >
          {{ more.name }} - More Info
        </v-card-title>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="moreOpen = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      posts: [],
      error: false,
      errorMessage: '',
      more: null,
      moreOpen: false,
      deleteOpen: false
    }
  },
  mounted () {
    this.getPosts()
  },
  methods: {
    getPosts () {
      this.$axios.get('/api/posts')
        .then((res) => {
          this.posts = res.data
        }).catch((err) => {
          this.posts = []
          this.error = true
          this.errorMessage = err.message
        })
    },
    createdAgo (post) {
      return moment(post.created).fromNow()
    },
    showDeleteDialog (post) {
      this.more = post
      this.moreOpen = false
      this.deleteOpen = true
    },
    postEdit (post) {
      return `/admin/posts/edit/${post.slug}`
    },
    moreInfo (post) {
      this.more = post
      this.deleteOpen = false
      this.moreOpen = true
    },
    deletePost (post) {
      this.$axios.post(`/api/posts/${post.slug}/delete`)
        .then((res) => {
          if (res.data.ok) {
            this.getPosts()
            this.more = null
            this.deleteOpen = false
          }
        }).catch((err) => {
          if (err) {
            this.error = true
            this.errorMessage = err.message
          }
        })
    }
  }
}
</script>
