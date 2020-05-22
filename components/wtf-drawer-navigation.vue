<template>
  <v-list v-if="$menu('primary')">
    <v-subheader>Navigation</v-subheader>

    <v-list-item
      v-for="item of $menu('primary')"
      :key="item._id"
      :href="item.type === 'external' ? item.href : null"
      :to="item.type !== 'external' ? item.href : null"
    >
      <v-list-item-content>
        <v-list-item-title>
          {{ item.name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
