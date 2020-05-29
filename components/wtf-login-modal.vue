<template>
  <v-dialog
    v-model="loginActive"
    persistent
    width="600"
  >
    <template v-slot:activator="{ on }">
      <slot name="activator" :on="on" />
    </template>

    <v-card>
      <v-form
        @submit="login"
      >
        <v-card-title>Log in</v-card-title>

        <v-divider />

        <v-card v-if="error" color="error">
          <v-card-text>
            <v-icon>mdi-alert</v-icon>
            {{ error }}
          </v-card-text>
        </v-card>

        <v-card-text>
          <v-text-field
            v-model="username"
            label="Username or email"
            type="email"
            :error-messages="usernameError"
          />

          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            :error-messages="passwordError"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn
            text
          >
            Create account
          </v-btn>
          <v-spacer />
          <v-btn
            text
            @click="cancelLogin"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            type="submit"
            color="primary"
          >
            Log in
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    permanent: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      username: '',
      password: '',
      loginActive: false,
      error: '',
      usernameError: '',
      passwordError: ''
    }
  },
  mounted () {
    if (this.permanent) {
      this.loginActive = true
    }
  },
  methods: {
    login (evt) {
      evt.preventDefault()

      this.usernameError = ''
      this.passwordError = ''
      this.error = ''

      if (!this.username) {
        this.usernameError = 'Username is required.'
      } else if (!this.password) {
        this.passwordError = 'Password is required.'
      } else {
        this.$auth.loginWith('local', {
          data: {
            email: this.username,
            password: this.password
          }
        }).then(() => {
          this.username = ''
          this.password = ''

          if (this.permanent) {
            this.$emit('success')
          } else {
            this.loginActive = false
          }
        }).catch((err) => {
          const statusCodeError = 'Request failed with status code '
          if (err.message.startsWith(statusCodeError)) {
            const statusCode = err.message.substring(statusCodeError.length)
            this.error = (statusCode === '401') ? 'Username or password is incorrect.  Please try again.' : `${err.message} - this is most likely our fault and not yours.`
          } else {
            this.error = `${err.message} - this is most likely our fault and not yours.`
          }
        })
      }
    },
    cancelLogin () {
      this.username = ''
      this.password = ''
      this.error = ''
      this.usernameError = ''
      this.passwordError = ''
      if (this.permanent) {
        this.$emit('cancelled')
      } else {
        this.loginActive = false
      }
    }
  }
}
</script>
