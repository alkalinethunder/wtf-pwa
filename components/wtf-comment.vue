<template>
  <v-flex class="d-flex flex-row mb-2 mt-2">
    <v-avatar color="primary" />
    <v-flex class="d-flex flex-column ml-3">
      <v-flex class="d-flex flex-row align-center">
        <h4 class="subtitle-2">
          {{ displayname }}
        </h4>
        <small class="caption ml-1">
          {{ timeAgo }}
        </small>
      </v-flex>

      <p class="body-1">
        {{ text }}
        <br />
        <a v-if="less !== comment.body" @click="showMore = !showMore">
          {{ showMoreText }}
        </a>
      </p>

      <v-flex class="d-flex flex-row align-center">
        <slot name="comment-actions" />
      </v-flex>

      <slot />
    </v-flex>
  </v-flex>
</template>

<script>
import moment from 'moment'
import truncate from 'truncate'

export default {
  data () {
    return {
      showMore: false
    }
  },
  props: {
    comment: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    showMoreText () {
      return this.showMore ? 'Show less' : 'Show more'
    },
    less () {
      return truncate(this.comment.body, 120)
    },
    text () {
      return this.showMore ? this.comment.body : this.less
    },
    displayname () {
      return this.comment.author.displayName || this.comment.author.username
    },
    timeAgo () {
      return moment(this.comment.posted).fromNow()
    }
  }
}
</script>
