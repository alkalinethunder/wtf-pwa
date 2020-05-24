<template>
  <div>
    <v-card>
      <v-card-text>
        <v-textarea
          v-model="post.name"
          dense
          solo
          flat
          rows="1"
          auto-grow
          class="display-1"
          label="Post title"
        />

        <v-textarea
          v-model="post.excerpt"
          dense
          flat
          solo
          rows="1"
          auto-grow
          class="body-1"
          label="Post excerpt"
        />

        <wtf-markdown-editor v-model="post.body" label="Start writing your post here. GitHub-flavoured Markdown is supported." />
      </v-card-text>
    </v-card>

    <v-btn
      color="primary"
      fab
      fixed
      bottom
      right
      @click="savePost"
    >
      <v-icon>mdi-send</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      post: {
        _id: '',
        slug: '',
        body: '',
        name: '',
        excerpt: '',
        created: new Date()
      }
    }
  },
  mounted () {
    this.$axios.get(`/api/posts/${this.$route.params.id}`)
      .then((res) => {
        this.post = res.data
      }).catch((err) => {
        this.$nuxt.error(err)
      })
  },
  methods: {
    savePost () {
      this.$axios.post(`/api/posts/${this.post.slug}`, this.post)
        .then((res) => {
          this.$router.replace('/admin/posts')
        }).catch((err) => {
          this.$nuxt.error(err)
        })
    }
  }
}
</script>
