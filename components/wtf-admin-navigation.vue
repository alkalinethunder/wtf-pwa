<template>
  <v-list>
    <v-list-item v-for="section in sections" :key="section.name" :to="section.to" :exact="section.exact">
      <v-list-item-icon>
        <v-icon>mdi-{{ section.icon }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>
          {{ section.name }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  data () {
    return {
      sections: [
        {
          exact: true,
          name: 'Overview',
          to: '/admin',
          icon: 'home'
        },
        {
          exact: false,
          name: 'Posts',
          to: '/admin/posts',
          icon: 'book'
        },
        {
          exact: false,
          name: 'Pages',
          to: '/admin/pages',
          icon: 'book-open-page-variant'
        },
        {
          exact: false,
          name: 'Menus',
          to: '/admin/menus',
          icon: 'menu'
        },
        {
          exact: false,
          name: 'User accounts',
          to: '/admin/users',
          icon: 'account'
        },
        {
          exact: false,
          name: 'Site settings',
          to: '/admin/sitesettings',
          icon: 'cog'
        }
      ]
    }
  }
}
</script>
