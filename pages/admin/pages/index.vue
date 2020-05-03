<template>
  <div>
    <v-card-title class="display-1">
      Pages
    </v-card-title>

    <v-card-subtitle>
      Pages allow you to add custom static content to your site without needing to edit the front-end Vue.js code.  Pages can be either top-level pages or children of other pages.
    </v-card-subtitle>

    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-subheader>
            PAGES
          </v-subheader>
        </v-list-item-content>
      </v-list-item>

      <wtf-recursive-pages-list v-model="pages" @delete="deletePage" />
    </v-list>

    <v-dialog v-model="deleteOpen">
      <v-container v-if="page">
        <v-card>
          <v-card-title class="title">
            Delete "{{ page.name }}"
          </v-card-title>
          <v-divider />
          <v-card-text>
            <p>Are you sure you want to delete the page "{{ page.name }}"?</p>

            <v-select v-model="moveChildrenTo" :items="homes" label="Move direct children to..." :disabled="recursive" />
          </v-card-text>

          <v-card-actions>
            <v-switch v-model="recursive" />
            <span>Delete all children</span>
            <v-spacer />
            <v-btn text @click="deleteOpen = false">
              No
            </v-btn>
            <v-btn text color="danger" @click="confirmDelete">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-dialog>

    <v-btn
      fab
      fixed
      bottom
      right
      color="primary"
      to="/admin/pages/create"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pages: [],
      deleteOpen: false,
      page: null,
      recursive: false,
      moveChildrenTo: null
    }
  },
  computed: {
    homes () {
      const possibleHomes = [
        {
          value: null,
          text: 'No parent'
        }
      ]

      for (const possiblePage of this.pages.filter(x => x.slug !== '<index>' && x._id !== this.page._id && !this.hasParent(x, this.page))) {
        possibleHomes.push({
          value: possiblePage._id,
          text: possiblePage.name
        })
      }

      return possibleHomes
    }
  },
  mounted () {
    this.$axios.get('/api/pages')
      .then((res) => {
        this.pages = res.data
      })
  },
  methods: {
    deletePage (page) {
      this.deleteOpen = page
      this.page = page
    },
    collectAllChilren (p) {
      const collected = []
      const directChildren = this.pages.filter(x => x.parent === p._id)
      for (const child of directChildren) {
        collected.push(child)
        for (const c of this.collectAllChilren(child)) {
          collected.push(c)
        }
      }
      return collected
    },
    hasParent (page, parent) {
      const childrenOfParent = this.collectAllChilren(parent)
      return !!childrenOfParent.filter(x => x._id === page._id).length
    },
    confirmDelete () {
      this.$axios.post('/api/pages/delete/' + this.page._id, {
        recursive: this.recursive,
        moveChildrenTo: this.moveChildrenTo
      }).then((res) => {
        return this.$axios.get('/api/pages')
      }).then((res) => {
        this.pages = res.data
        this.deleteOpen = false
        this.page = null
        this.recursive = false
        this.moveChildrenTo = null
      })
    }
  }
}
</script>
