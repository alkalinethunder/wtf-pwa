<template>
  <span v-if="user._id">
    <v-chip :to="`/u/${user.username}`" small>
      @{{ user.displayName || user.username }}
    </v-chip>
  </span>
  <span v-else>
    @{{ value }}
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      user: {}
    }
  },
  mounted () {
    this.$axios.get(`/api/users/username/${this.value}`)
      .then((res) => {
        this.user = res.data
      }).catch(() => {
        this.user = {}
      })
  }
}
</script>
