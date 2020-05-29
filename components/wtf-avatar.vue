<template>
  <v-avatar>
    <v-img
      v-if="user && user.avatar"
      :src="user.avatar"
    />
    <v-icon v-else large>
      mdi-account
    </v-icon>
  </v-avatar>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          avatar: ''
        }
      }
    }
  }
}
</script>
