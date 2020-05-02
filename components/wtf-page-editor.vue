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
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card raised>
          <v-card-subtitle>PREVIEW</v-card-subtitle>
          <v-card-title class="display-1">
            {{ value.name }}
          </v-card-title>
          <v-card-text>
            <wtf-renderer v-model="value.body" />
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
          edited: new Date()
        }
      }
    }
  },
  methods: {
    savePage (evt) {
      evt.preventDefault()
      this.$axios.post(`/api/pages/id/${this.value._id}`, this.value)
        .then((res) => {
          this.$emit('saved', res.data)
        })
    }
  }
}
</script>
