<template>
  <div>
    <v-dialog
      v-if="$auth.loggedIn && $auth.user.owner"
      v-model="quickEdit"
      persistent
      width="1200"
    >
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          Quick Edit
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="title">
          Edit {{ value.name }}
        </v-card-title>

        <v-divider />

        <wtf-page-editor
          quick
          :value="value"
          @saved="reload"
          @canceled="quickEdit = false"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default () {
        return {
          _id: null,
          name: 'Page',
          body: '',
          slug: '',
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
      quickEdit: false
    }
  },
  methods: {
    reload (page) {
      this.quickEdit = false
      this.$emit('input', page)
    }
  }
}
</script>
