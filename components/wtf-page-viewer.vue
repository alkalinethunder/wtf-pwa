<template>
  <div>
    <slot name="breadcrumbs">
      <v-breadcrumbs v-if="breadcrumbs && breadcrumbs.length" :items="breadcrumbs" />
    </slot>

    <slot name="before" />

    <h1 class="display-1">
      <slot name="title" />
    </h1>

    <slot name="before-content" />

    <slot />

    <slot name="after-content" />

    <slot name="page-footer">
      <v-card-actions>
        <slot name="page-information" />
        <v-spacer />
        <slot name="page-actions" />
      </v-card-actions>
    </slot>

    <slot name="append" />
  </div>
</template>

<script>
export default {
  props: {
    breadcrumbs: {
      type: Array,
      default: () => []
    }
  }
}
</script>
