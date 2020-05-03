<template>
  <div>
    <v-card-title class="display-1">
      {{ value.name }}
    </v-card-title>

    <v-breadcrumbs :items="breadcrumbs" />

    <v-card-text>
      <wtf-renderer v-model="value.body" />
    </v-card-text>

    <v-divider />
    <v-card-actions>
      <v-card-subtitle>
        Created {{ created }} - Last edited {{ lastEdited }}
      </v-card-subtitle>
      <v-spacer />
      <v-btn
        v-if="$auth.loggedIn && $auth.user.owner"
        text
        @click="activateQuickEdit"
      >
        Quick edit
      </v-btn>
    </v-card-actions>

    <v-dialog
      v-if="$auth.loggedIn && $auth.user.owner"
      v-model="quickEdit"
    >
      <v-container>
        <v-card>
          <v-card-title class="title">
            Edit {{ editPage.name }}
          </v-card-title>

          <v-divider />

          <wtf-page-editor v-model="editPage" quick @saved="reload" />
        </v-card>
      </v-container>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    value: {
      type: Object,
      default () {
        return {
          _id: '',
          name: '',
          slug: '',
          parent: '',
          body: '',
          created: new Date(),
          edited: new Date()
        }
      }
    },
    breadcrumbs: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      quickEdit: false,
      editPage: {}
    }
  },
  computed: {
    created () {
      return moment(this.value.created).fromNow()
    },
    lastEdited () {
      return moment(this.value.edited).fromNow()
    }
  },
  methods: {
    activateQuickEdit () {
      if (this.$auth.loggedIn && this.$auth.user.owner) {
        this.quickEdit = true
        this.editPage = Object.assign(this.value)
      }
    },
    reload (newPage) {
      this.editPage = newPage
      this.value = newPage
      this.quickEdit = false
    }
  }
}
</script>
