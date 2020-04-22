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

          <v-dialog :value="more[post._id]">
            <v-card>
              <v-card-title class="headline grey lighter-2" primary-title>
                More info: {{ post.name }}
              </v-card-title>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="more[post._id] = false">
                  Done
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-list dense>
            <v-list-item @click="moreInfo(post)">
              <v-list-item-content>
                <v-list-item-title>More info</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item>
    </v-list>
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
      more: []
    }
  },
  mounted () {
    this.$axios.get('/api/posts')
      .then((res) => {
        this.posts = res.data
        for (const post of this.posts) {
          this.more[post._id] = false
        }
      }).catch((err) => {
        this.posts = []
        this.error = true
        this.errorMessage = err.message
      })
  },
  methods: {
    createdAgo (post) {
      return moment(post.created).fromNow()
    },
    postEdit (post) {
      return `/admin/posts/edit/${post.slug}`
    },
    moreInfo (post) {
      this.more[post._id] = true
    }
  }
}
</script>
