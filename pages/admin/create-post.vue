<template>
  <div>
    <v-toolbar>
      <v-toolbar-title>Create post</v-toolbar-title>
    </v-toolbar>
    <v-row>
      <v-col>
        <v-form v-model="valid" @submit="submitPost">
          <v-text-field v-model="post.name" label="Post title" />
          <v-textarea v-model="post.excerpt" label="Excerpt" />
          <v-textarea v-model="post.body" label="Post content" />

          <v-text-field v-model="tags" label="Tags" />
          <p><small>Seperate tags with commas.</small></p>

          <v-btn type="submit" color="primary">
            Publish
          </v-btn>
        </v-form>
      </v-col>
      <v-col>
        <h2 class="headline">{{ post.name || 'Untitled post' }}</h2>
        <p>{{ post.excerpt || 'This is the excerpt for the post and will show on the blog and homepage.  If nothing is written here, no excerpt will be shown.' }}</p>

        <div v-html="$md.render(post.body)" />
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
