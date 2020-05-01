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
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-form v-model="valid" @submit="submitPost">
          <v-card-text>
            <v-text-field v-model="post.name" dense label="Post title" />
            <v-text-field v-model="post.excerpt" dense label="Excerpt" />
          </v-card-text>

          <Editor v-model="post.body" mode="editor" />

          <v-btn
            fab
            fixed
            bottom
            right
            type="submit"
            color="primary"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-form>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card
          raised
          outline
        >
          <v-card-subtitle>PREVIEW</v-card-subtitle>
          <v-card-title class="display-1">
            {{ post.name || 'Untitled post' }}
          </v-card-title>

          <v-card-text v-if="post.excerpt">
            {{ post.excerpt }}
          </v-card-text>

          <v-card-text>
            <wtf-renderer v-model="post.body" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
    submitPost (evt) {
      evt.preventDefault()

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
