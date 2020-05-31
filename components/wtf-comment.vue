<template>
  <div class="d-flex flex-row mt-2">
    <wtf-avatar :user="comment.author" />
    <div class="d-flex flex-column ml-3">
      <span class="subtitle-2">
        <nuxt-link
          class="text--primary wtf-link"
          :to="`/u/${comment.author.username}`"
        >
          {{ displayname }}
        </nuxt-link>
        <small class="caption text--secondary">
          {{ timeAgo }}
        </small>
      </span>

      <span class="body-2">
        {{ text }}
        <br>
        <a v-if="less !== comment.body" @click="showMore = !showMore">
          {{ showMoreText }}
        </a>
      </span>

      <div class="d-flex flex-row align-center mb-2">
        <slot name="comment-actions" />
      </div>

      <slot />
    </div>
  </div>
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
      return truncate(this.comment.body, 288)
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
