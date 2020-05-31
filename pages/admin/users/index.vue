<template>
  <div>
    <h1 class="headline">
      User accounts
    </h1>

    <v-simple-table>
      <thead>
        <tr>
          <td>User</td>
          <td>Role</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user of users" :key="user._id">
          <td>
            <div class="d-flex flex-row align-center">
              <wtf-avatar :user="user" />
              <div class="d-flex flex-column ml-3">
                <span class="subtitle-2">
                  {{ user.displayName || user.username }}
                </span>
                <span class="caption text--secondary">
                  Joined {{ joined(user) }}.
                </span>
              </div>
            </div>
          </td>
          <td>
            {{ role(user) }}
          </td>
          <td>
            <div class="d-flex flex-row align-center">
              <v-spacer />
              <v-btn text :to="`/u/${user.username}`">
                View profile
              </v-btn>
              <v-btn icon>
                <v-icon>
                  mdi-lead-pencil
                </v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>
                  mdi-dots-vertical
                </v-icon>
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      users: []
    }
  },
  mounted () {
    this.$axios.get('/api/users')
      .then((res) => {
        this.users = res.data
      }).catch((err) => {
        this.$nuxt.error(err)
      })
  },
  methods: {
    joined (user) {
      return moment(user.joined).fromNow()
    },
    role (user) {
      if (user.owner) {
        return 'Site owner'
      } else if (user.admin) {
        return 'Administrator'
      } else if (user.editor) {
        return 'Editor'
      } else if (user.moderator) {
        return 'Moderator'
      } else if (user.banned) {
        return 'Banned'
      } else {
        return 'Member'
      }
    }
  }
}
</script>
