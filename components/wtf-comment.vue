<template>
  <v-card>
    <v-list-item>
      <v-list-item-avatar color="primary" />
      <v-list-item-content>
        <v-list-item-title>
          {{ displayname }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ comment.body }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <small>{{ timeAgo }}</small>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    comment: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    displayname () {
      return this.comment.author.displayName || this.comment.author.username
    },
    timeAgo () {
      return moment(this.comment.posted).fromNow()
    }
  }
}
</script>
