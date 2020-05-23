<template>
  <div>
    <h1 class="display-1">
      {{ value.name }}
    </h1>

    <p class="body-2">
      <wtf-renderer
        v-if="value.body"
        v-model="value.body"
      />
    </p>

    <v-divider v-if="value.created && value.edited" />
    <v-card-actions v-if="value.created && value.edited">
      <v-breadcrumbs :items="breadcrumbs" />
      <v-spacer />
      <span class="overline">
        Created {{ created }} - Last edited {{ lastEdited }}
      </span>
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
      this.quickEdit = false
      this.$emit('input', newPage)
    }
  }
}
</script>
