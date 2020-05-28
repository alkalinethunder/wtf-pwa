<template>
  <div>
    <slot name="prepend" />
    <v-container fluid>
      <v-flex class="d-flex flex-row justify-start align-center">
        <v-flex class="d-flex flex-column mr-auto">
          <h1 class="display-1">
            <slot name="title" />
          </h1>
          <h2 class="subtitle-1 text--secondary">
            <slot name="page-information" />
          </h2>
        </v-flex>
        <slot name="breadcrumbs">
          <v-breadcrumbs v-if="breadcrumbs && breadcrumbs.length" :items="breadcrumbs" />
        </slot>
        <slot name="page-actions" />
      </v-flex>

      <v-row>
        <v-col
          cols="12"
          md="8"
        >
          <slot name="before-content" />

          <slot />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <slot name="sidebar" />
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <slot name="after-content" />
        </v-col>
      </v-row>

      <slot name="page-footer">
        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </slot>
    </v-container>

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
