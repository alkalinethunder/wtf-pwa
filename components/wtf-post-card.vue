<template>
  <v-card v-if="post" :to="`/blog/${post.category.slug}/${post.slug}`">
    <v-list-item three-line dense>
      <v-list-item-content>
        <v-list-item-title class="overline">
          {{ post.category.slug }}
        </v-list-item-title>
        <v-list-item-subtitle class="title">
          {{ post.name }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          Posted {{ created }} by {{ author }}.
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-card-text v-if="post.excerpt">
      {{ post.excerpt }}
    </v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    post: {
      type: Object,
      default () {
        return {
          _id: '',
          name: '',
          slug: '',
          category: {
            name: '',
            slug: ''
          },
          tags: [],
          created: new Date(),
          author: {
            _id: '',
            owner: false,
            admin: false,
            editor: false,
            moderator: false,
            banned: false,
            displayName: '',
            username: ''
          },
          excerpt: '',
          body: ''
        }
      }
    }
  },
  computed: {
    created () {
      return moment(this.post.created).fromNow()
    },
    author () {
      return this.post.author.displayName || this.post.author.username
    }
  }
}
</script>
