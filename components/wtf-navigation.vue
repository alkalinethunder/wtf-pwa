<template>
  <div>
    <v-tabs v-if="$menu('primary')" dark color="white" background-color="transparent">
      <v-tab
        v-for="item of $menu('primary')"
        :key="item._id"
        :href="item.type === 'external' ? item.href : null"
        :to="item.type !== 'external' ? item.href : null"
      >
        {{ item.name }}
      </v-tab>
    </v-tabs>
  </div>
</template>

<script>
export default {
  computed: {
    dark () {
      return this.$store.state.siteSettings.dark
    }
  }
}
</script>
