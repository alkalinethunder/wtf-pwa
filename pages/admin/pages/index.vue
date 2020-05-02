<template>
  <div>
    <v-card-title class="display-1">
      Pages
    </v-card-title>

    <v-card-subtitle>
      Pages allow you to add custom static content to your site without needing to edit the front-end Vue.js code.  Pages can be either top-level pages or children of other pages.
    </v-card-subtitle>>

    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-subheader>
            PAGES
          </v-subheader>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-for="page of topLevelPages" :key="page._id">
        <v-list-item-icon>
          <v-icon>mdi-book-open-page-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ page.name }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="page.slug !== '<index>'">
            /{{ page.slug }}
          </v-list-item-subtitle>
          <v-list-item-subtitle v-else>
            /
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-btn icon :to="`/admin/pages/${page._id}`">
          <v-icon>mdi-lead-pencil</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      topLevelPages: [],
      childPages: {}
    }
  },
  mounted () {
    this.$axios.get('/api/pages')
      .then((res) => {
        this.topLevelPages = res.data
        for (const page of this.topLevelPages) {
          this.$axios.get(`/api/pages/${page.slug}`)
            .then((res) => {
              this.childPages[page.slug] = res.data
            })
        }
      })
  }
}
</script>
