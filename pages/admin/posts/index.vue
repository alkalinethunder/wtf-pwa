<template>
  <div>
    <v-card-title class="display-1">
      Posts
    </v-card-title>
    <v-card-subtitle>
      Posts are part of the built-in blog system.  They are visible on the home page and the Blog page, and can contain both an excerpt and a full Markdown body.  Post pages display differently from static pages, allowing for user comments and the ability to show related posts.  Posts can also be shared to social media platforms by users.
    </v-card-subtitle>

    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-subheader>POST</v-subheader>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-for="post in posts" :key="post._id">
        <v-list-item-icon>
          <v-icon>mdi-book</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ post.name }}
            <v-chip small>
              {{ post.category.name }}
            </v-chip>
          </v-list-item-title>
          <v-list-item-subtitle>{{ createdAgo(post) }} by {{ postAuthor(post) }}</v-list-item-subtitle>
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

    <v-card-text v-if="!posts.length" class="text-center">
      <h1 class="headline">
        No posts here...
      </h1>
      <p>There are no posts to display on this page. Your blog is empty.</p>
      <v-btn color="primary" to="/admin/create-post">
        Create your first post!
      </v-btn>
    </v-card-text>

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

    <v-btn
      to="/admin/create-post"
      color="primary"
      fab
      fixed
      bottom
      right
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
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
      return `/admin/posts/${post.slug}`
    },
    postAuthor (post) {
      return post.author.displayName || post.author.username
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
