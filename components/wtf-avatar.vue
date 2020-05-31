<template>
  <v-list-item-avatar v-if="listItem" small>
    <v-img
      v-if="user && user.avatar"
      :src="user.avatar"
    />
    <v-icon v-else large>
      mdi-account
    </v-icon>
  </v-list-item-avatar>
  <v-avatar v-else>
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
    listItem: {
      type: Boolean,
      default: () => false
    },
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
