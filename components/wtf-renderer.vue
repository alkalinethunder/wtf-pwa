<template>
  <div>
    <!-- eslint-disable vue/no-v-html -->
    <div class="md" v-html="rendered" />
  </div>
</template>

<script>
import { Renderer } from 'vuetify-markdown-editor'

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    rendered () {
      return Renderer(this.value)
    }
  }
}
</script>

<style>
.md img {
  max-width: 100% !important;
  height: auto;
}

.md ul, ol {
  padding-top: 0.5rem;
}

.md blockquote {
  background-color: rgba(128, 128, 128, 33%);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-left: 0.5rem solid #1baaf7;
}

.md hr {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(128, 128, 128, 0.5)
}

.md table {
  width: 100%;
}
</style>
