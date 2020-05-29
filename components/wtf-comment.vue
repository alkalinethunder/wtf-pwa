<template>
  <v-flex class="d-flex flex-row mb-2 mt-2">
    <wtf-avatar :user="comment.author" />
    <v-flex class="d-flex flex-column ml-3">
      <v-flex class="d-flex flex-row align-center">
        <nuxt-link
          class="subtitle-2 text--primary wtf-link"
          :to="`/u/${comment.author.username}`"
        >
          {{ displayname }}
        </nuxt-link>
        <small class="caption ml-1">
          {{ timeAgo }}
        </small>
      </v-flex>

      <p class="body-1">
        {{ text }}
        <br>
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
  props: {
    comment: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showMore: false
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
