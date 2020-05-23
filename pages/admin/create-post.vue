<template>
  <div>
    <v-card-title class="display-1">
      Create new post
    </v-card-title>
    <v-card-subtitle class="d-none d-md-block">
      Good blog posts have a post title, excerpt, featured image and a nicely formatted body.  You can fill out the form below to create your post.  A preview of what users will see is displayed on the right and will update as you type.
    </v-card-subtitle>
    <v-card-subtitle class="d-block d-md-none">
      Good blog posts have a post title, excerpt, featured image, and nicely formatted body.  Use the form below to create your post.  Scroll further down to see a preview of what your users will see.
    </v-card-subtitle>
    <v-card>
      <v-card-text>
        <v-textarea
          v-model="post.name"
          class="display-1 transparent"
          dense
          solo
          flat
          label="Post name"
          rows="1"
          auto-grow
        />

        <v-textarea
          v-model="post.excerpt"
          rows="1"
          auto-grow
          dense
          solo
          flat
          label="Post excerpt"
          class="body-2"
        />

        <wtf-markdown-editor v-model="post.body" />
      </v-card-text>
    </v-card>

    <v-btn
      fab
      fixed
      bottom
      right
      color="primary"
      @click="submitPost"
    >
      <v-icon>mdi-send</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      valid: false,
      error: false,
      errorMessage: '',
      post: {
        name: '',
        body: '',
        excerpt: '',
        category: '',
        tags: ''
      }
    }
  },
  computed: {
    tagList () {
      const splitTags = this.post.tags.split(',')
      for (let i = 0; i < splitTags.length; i++) {
        splitTags[i] = splitTags[i].trim()
      }
      return splitTags
    }
  },
  methods: {
    submitPost () {
      const publish = {
        name: this.post.name,
        excerpt: this.post.excerpt,
        body: this.post.body,
        category: this.post.category,
        tags: this.tagList
      }

      this.$axios.post('/api/posts', publish)
        .then((res) => {
          this.$router.push('/admin/posts')
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
