<template>
  <v-form v-if="value" @submit="savePage">
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card-text v-if="!quick">
          <v-text-field v-model="value.name" label="Page title" />
        </v-card-text>

        <Editor v-model="value.body" mode="editor" />

        <v-card-text>
          <v-select
            v-model="value.parent"
            :items="parents"
            label="Parent"
          />
        </v-card-text>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card raised>
          <v-card-subtitle>PREVIEW</v-card-subtitle>
          <v-card-title class="display-1">
            {{ value.name || 'Untitled Page' }}
          </v-card-title>
          <v-card-text v-if="value.body">
            <wtf-renderer v-model="value.body" />
          </v-card-text>
          <v-card-text v-else>
            Start typing to see a live preview of the page.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

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
    <v-card-actions v-else>
      <v-spacer />
      <v-btn
        text
        type="submit"
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
          parent: null
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
    saveUrl () {
      if (this.creator) {
        return '/api/pages'
      } else {
        return `/api/pages/${this.value._id}`
      }
    }
  },
  mounted () {
    this.$axios.get('/api/pages')
      .then((res) => {
        this.buildPageTree(res.data, null, 0)
      })
  },
  methods: {
    buildPageTree (pages, parent, indent) {
      for (const page of pages) {
        if (page.parent === parent) {
          this.parents.push({
            value: page._id,
            text: `${'--'.repeat(indent)} ${page.name}`
          })

          if (pages.filter(x => x.parent === page._id).length) {
            this.buildPageTree(pages, page._id, indent + 1)
          }
        }
      }
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
