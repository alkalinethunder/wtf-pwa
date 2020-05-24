<template>
  <v-form v-if="value" @submit="savePage">
    <v-card-text>
      <v-textarea
        v-if="!quick"
        v-model="value.name"
        class="display-1"
        dense
        solo
        flat
        rows="1"
        auto-grow
        label="Page title"
        :readonly="value.system"
      />

      <v-select
        v-if="!quick"
        v-model="value.parent"
        :items="parents"
        label="Parent"
        dense
        solo
        flat
        :disabled="value.system"
      />

      <wtf-markdown-editor v-model="value.body" />
    </v-card-text>

    <v-btn
      v-if="fab"
      type="submit"
      fab
      fixed
      bottom
      right
      color="primary"
    >
      <v-icon>mdi-send</v-icon>
    </v-btn>
    <v-divider v-if="!fab" />
    <v-card-actions v-if="!fab">
      <v-btn
        v-if="$auth.loggedIn && $auth.user.owner && quick"
        text
        :to="`/admin/pages/${value._id}`"
      >
        Full Editor
      </v-btn>
      <v-spacer />
      <v-btn
        v-if="quick"
        text
        @click="$emit('canceled')"
      >
        Cancel
      </v-btn>
      <v-btn
        text
        type="submit"
        color="primary"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-form>
</templatE>

<script>
export default {
  props: {
    fab: {
      type: Boolean,
      default: false
    },
    creator: {
      type: Boolean,
      default: false
    },
    quick: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default () {
        return {
          _id: '',
          name: '',
          slug: '',
          body: '',
          created: new Date(),
          edited: new Date(),
          parent: null,
          system: false
        }
      }
    }
  },
  data () {
    return {
      parents: [
        {
          value: null,
          text: 'No parent'
        }
      ]
    }
  },
  computed: {
    id () {
      return this.value._id
    },
    saveUrl () {
      if (this.creator) {
        return '/api/pages'
      } else {
        return `/api/pages/${this.value._id}`
      }
    }
  },
  watch: {
    id (newValue) {
      this.fetchParents()
    }
  },
  mounted () {
    this.fetchParents()
  },
  methods: {
    buildPageTree (pages, parent, indent) {
      for (const page of pages) {
        if (page._id === this.value._id) {
          continue
        }

        if (page.parent === parent) {
          if (!page.system) {
            this.parents.push({
              value: page._id,
              text: `${'--'.repeat(indent)} ${page.name}`
            })

            if (pages.filter(x => x.parent === page._id).length) {
              this.buildPageTree(pages, page._id, indent + 1)
            }
          }
        }
      }
    },
    fetchParents () {
      this.$axios.get('/api/pages')
        .then((res) => {
          this.parents = [
            {
              value: null,
              text: 'No parent'
            }
          ]
          this.buildPageTree(res.data, null, 0)
        })
    },
    savePage (evt) {
      evt.preventDefault()
      this.$axios.post(this.saveUrl, this.value)
        .then((res) => {
          this.$emit('saved', res.data)
        })
    }
  }
}
</script>
