<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-textarea
        dense
        solo
        flat
        class="monospace-editor"
        rows="1"
        auto-grow
        :label="label"
        :value="value"
        @input="$emit('input', $event)"
      />
    </v-col>
    <v-col cols="12" md="6">
      <h6 class="overline">
        Preview
      </h6>
      <v-divider />
      <markdown-renderer
        v-if="value"
        v-model="value"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default () {
        return this.markdown
      }
    },
    label: {
      type: String,
      default: () => 'Enter Markdown text here'
    }
  },
  data () {
    return {
      markdown: ''
    }
  }
}
</script>

<style scoped>
.monospace-editor {
  font-family: monospace !important;
}
</style>
