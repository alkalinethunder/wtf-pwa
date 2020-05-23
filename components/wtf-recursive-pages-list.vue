<template>
  <div>
    <div v-for="page of children" :key="page._id">
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-book-open-page-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ page.name }}
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip v-if="page.system" small v-on="on">
                  <v-icon small>mdi-lock</v-icon>
                  System page
                </v-chip>
              </template>
              <span>
                System pages cannot be moved, renamed, or deleted.
              </span>
            </v-tooltip>
          </v-list-item-title>
          <v-list-item-subtitle>
            Created
            {{ created(page) }},
            last edited
            {{ edited(page) }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            {{ urlOf(page) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-btn
          icon
          :to="urlOf(page)"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>
        <v-btn
          icon
          :to="editUrlOf(page)"
        >
          <v-icon>mdi-lead-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="!page.system"
          icon
          @click="deletePage(page)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-list-item>
      <v-list v-if="hasChildren(page)" class="ml-6" dense>
        <wtf-recursive-pages-list v-model="value" :parent="page._id" @delete="deletePage" />
      </v-list>
    </div>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    parent: {
      type: String,
      default: null
    }
  },
  computed: {
    children () {
      return this.value.filter(x => x.parent === this.parent)
    }
  },
  methods: {
    hasChildren (page) {
      return this.value.filter(x => x.parent === page._id).length > 0
    },
    created (page) {
      return moment(page.created).fromNow()
    },
    edited (page) {
      return moment(page.edited).fromNow()
    },
    editUrlOf (page) {
      return `/admin/pages/${page._id}`
    },
    parentOf (page) {
      if (page.parent) {
        return this.value.filter(x => x._id === page.parent)[0]
      } else {
        return null
      }
    },
    urlOf (page) {
      if (page.slug === '<index>') {
        return '/'
      } else {
        let url = `/${page.slug}`
        let pageParent = this.parentOf(page)

        while (pageParent !== null) {
          url = `/${pageParent.slug}${url}`
          pageParent = this.parentOf(pageParent)
        }

        return url
      }
    },
    deletePage (page) {
      this.$emit('delete', page)
    }
  }
}
</script>
