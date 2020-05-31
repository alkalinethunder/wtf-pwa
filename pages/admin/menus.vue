<template>
  <div>
    <v-card-title class="display-1">
      Menus
    </v-card-title>

    <v-card-subtitle>
      Menus are different places on the page for you to place navigation links to
      <nuxt-link to="/admin/pages">
        Pages
      </nuxt-link>
      and external websites. Themes will provide different locations, called menu slots, for items to be placed. Your current theme ({{ theme.name }}) has {{ themeSlots }} available.
    </v-card-subtitle>
    <v-card-subtitle>
      This page allows you to create, edit, and remove menu items.  If no menu items are in a slot, the theme will not show the slot on the page.
    </v-card-subtitle>

    <v-divider />

    <v-row>
      <v-col v-for="slot of theme.menus" :key="slot.slot" cols="12" md="6">
        <v-card raised>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="overline">
                {{ slot.slot }} ({{ theme.name }} Menu Slot)
              </v-list-item-title>
              <v-list-item-subtitle class="title">
                {{ slot.name }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ slot.description }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list v-if="$menu(slot.slot)">
            <v-list-item v-for="item of $menu(slot.slot)" :key="item._id">
              <v-list-item-icon>
                <v-icon>mdi-menu</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <code>{{ item.type }}</code>
                  &bull;
                  <v-icon small>
                    mdi-link
                  </v-icon>
                  <code>{{ item.href }}</code>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-btn v-if="$auth.user.owner" icon @click="showDelete(item._id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
          <v-card-text v-else>
            This slot has no menu items in it.  The slot will not display on the page until at least one
            item is added.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-if="$auth.user.owner" v-model="deleteIsOpen" persistent width="600">
      <v-card>
        <v-card-title class="title">
          Delete menu item
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete this menu item?
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn text @click="deleteIsOpen = ''">
            Nope
          </v-btn>
          <v-btn text color="primary" @click="deleteItem">
            Yeah, sure, whatever.
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-if="$auth.user.owner" v-model="creating" persistent width="750">
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          fab
          fixed
          bottom
          right
          v-on="on"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="title">
          Create menu item
        </v-card-title>

        <v-card-text>
          <v-text-field v-model="menuitem.name" label="Name" :error-messages="nameError" />

          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="menuitem.slot"
                :items="theme.menus"
                item-text="name"
                item-value="slot"
                label="Menu slot"
                :error-messages="slotError"
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-select
                v-model="menuitem.type"
                :items="menuitemtypes"
                item-text="name"
                item-value="value"
                label="Item type"
                :error-messages="typeError"
              />
            </v-col>
          </v-row>

          <div v-if="menuitem.type === 'page'">
            <v-select
              v-model="menuitem.page"
              :items="pages"
              item-text="name"
              item-value="_id"
              label="Page"
              :disabled="pages.length < 2"
              :error-messages="linkError"
            />

            <p v-if="pages.length < 2">
              Your website doesn't have any Pages yet, so you cannot use this menu item type.
            </p>
          </div>
          <div v-if="menuitem.type === 'post'">
            <v-select
              v-model="menuitem.post"
              :items="posts"
              item-text="name"
              item-value="_id"
              label="Blog post"
              :disabled="posts.length < 2"
              :error-messages="linkError"
            />

            <p v-if="posts.length < 2">
              Your website doesn't have any blog posts yet, so you cannot use this menu item type.
            </p>
          </div>
          <div v-if="menuitem.type === 'external'">
            <v-text-field v-model="menuitem.href" label="External link" :error-messages="linkError" />
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="creating = false">
            Cancel
          </v-btn>
          <v-btn text color="primary" @click="submitMenuItem">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      deleteIsOpen: false,
      deleteId: '',
      nameError: '',
      linkError: '',
      typeError: '',
      slotError: '',
      creating: false,
      menuitem: {
        name: '',
        slot: '',
        page: '',
        post: '',
        href: '',
        type: 'page'
      },
      pages: [],
      posts: [],
      menuitemtypes: [
        {
          name: 'Page',
          value: 'page'
        },
        {
          name: 'Post',
          value: 'post'
        },
        {
          name: 'External link',
          value: 'external'
        }
      ]
    }
  },
  computed: {
    theme () {
      return this.$store.state.menu.theme
    },
    themeSlots () {
      if (this.theme.menus.length > 1) {
        return `${this.theme.menus.length} menu slots`
      } else if (this.theme.menu.length === 1) {
        return 'a single menu slot'
      } else {
        return 'no menu slots'
      }
    }
  },
  mounted () {
    this.$axios.get('/api/posts')
      .then((res) => {
        this.posts = res.data
        this.posts.unshift({
          _id: '',
          name: 'Choose blog post'
        })

        return this.$axios.get('/api/pages')
      }).then((res) => {
        this.pages = res.data
        this.pages.unshift({
          _id: '',
          name: 'Choose page'
        })
      }).catch((err) => {
        this.$nuxt.error(err)
      })
  },
  methods: {
    showDelete (id) {
      this.deleteIsOpen = true
      this.deleteId = id
    },
    deleteItem () {
      this.$axios.post(`/api/menu/${this.deleteId}/delete`, {})
        .then((res) => {
          this.$store.commit('menu/deleteItem', this.deleteId)
          this.deleteId = ''
          this.deleteIsOpen = false
          this.$router.replace('/admin/menus')
        }).catch((err) => {
          alert(err)
        })
    },
    createMenuItem () {
      this.creating = true
    },
    validateMenuItem () {
      this.linkError = ''
      this.nameError = ''
      this.slotError = ''
      this.typeError = ''

      if (this.menuitem.name.trim()) {
        if (this.menuitem.slot) {
          switch (this.menuitem.type) {
            case 'page':
              if (!this.menuitem.page) {
                this.linkError = 'Please select a page.'
                return false
              }
              return true
            case 'post':
              if (!this.menuitem.post) {
                this.linkError = 'Please select a blog post.'
                return false
              }
              return true
            case 'external':
              if (!this.menuitem.href.trim()) {
                this.linkError = 'Please enter a valid external link.'
                return false
              }
              return true
            default:
              this.typeError = 'Unknown menu item type.'
              return false
          }
        } else {
          this.slotError = 'Please select a menu slot.'
          return false
        }
      } else {
        this.nameError = 'Menu item must have a non-empty name.'
        return false
      }
    },
    submitMenuItem () {
      if (this.validateMenuItem()) {
        this.$axios.post('/api/menu', this.menuitem)
          .then((res) => {
            this.$store.commit('menu/addItem', res.data)
            this.creating = false
          }).catch((err) => {
            this.$nuxt.error(err)
          })
      }
    }
  }
}
</script>

<style>
code {
  background: transparent !important;
}
</style>
