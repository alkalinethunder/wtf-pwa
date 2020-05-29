<template>
  <v-dialog
    v-model="loginActive"
    persistent
    width="840"
  >
    <template v-slot:activator="{ on }">
      <slot name="activator" :on="on" />
    </template>

    <v-card>
      <v-form
        @submit="login"
      >
        <v-card-title>Create new account</v-card-title>

        <v-divider />

        <v-card v-if="error" color="error">
          <v-card-text>
            <v-icon>mdi-alert</v-icon>
            {{ error }}
          </v-card-text>
        </v-card>

        <v-card-text>
          <v-text-field
            v-model="user.username"
            label="Username"
            :error-messages="errors.username"
          />

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="user.email"
                type="email"
                :error-messages="errors.email"
                label="Email address"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="user.confirmEmail"
                type="email"
                :error-messages="errors.confirmEmail"
                label="Confirm email address"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="user.password"
                type="password"
                label="Password"
                :error-messages="errors.password"
              />
              <span class="caption">
                Password strength: {{ passwordStrengthText }}
              </span>
            </v-col>

            <v-col cols="6">
              <v-text-field
                v-model="user.confirmPassword"
                type="password"
                label="Confirm password"
                :error-messages="errors.confirmPassword"
              />
            </v-col>
          </v-row>
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
            Create account
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import passwordStrength from 'check-password-strength'

export default {
  props: {
    permanent: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      user: {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        confirmEmail: ''
      },
      errors: {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        confirmEmail: ''
      },
      loginActive: false,
      error: ''
    }
  },
  computed: {
    passwordStrengthText () {
      if (this.user.password) {
        return passwordStrength(this.user.password).value
      } else {
        return 'Weak'
      }
    },
    passwordStrengthValue () {
      if (this.user.password) {
        return passwordStrength(this.user.password).id
      } else {
        return 0
      }
    }
  },
  mounted () {
    if (this.permanent) {
      this.loginActive = true
    }
  },
  methods: {
    async login (evt) {
      evt.preventDefault()

      this.error = ''

      this.errors = {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        confirmEmail: ''
      }

      if (!this.user.username) {
        this.errors.username = 'Username is required.'
      } else if (!this.user.email) {
        this.errors.email = 'Email address is required.'
      } else if (!this.user.confirmEmail) {
        this.errors.confirmEmail = 'Field is required.'
      } else if (!this.user.password) {
        this.errors.password = 'Password is required.'
      } else if (!this.user.confirmPassword) {
        this.errors.confirmPassword = 'Field is required.'
      } else {
        if (this.user.email !== this.user.confirmEmail) {
          this.errors.confirmEmail = 'Emails do not match.'
          return
        }

        if (this.user.password !== this.user.confirmPassword) {
          this.errors.confirmPassword = 'Passwords do not match.'
          return
        }

        if (this.passwordStrengthValue < 2) {
          this.errors.password = 'Password is too weak.'
          return
        }

        try {
          await this.$axios.post('/api/users/', this.user)
          await this.$auth.loginWith('local', {
            data: {
              email: this.user.email,
              password: this.user.password
            }
          })

          if (this.permanent) {
            this.$emit('success')
          } else {
            this.loginActive = false
          }
        } catch (err) {
          const statusCodeError = 'Request failed with status code '
          if (err.message.startsWith(statusCodeError)) {
            const statusCode = err.message.substring(statusCodeError.length)
            if (statusCode === '403') {
              this.error = 'Username or email address is already taken.'
              return
            }
          }

          this.error = `${err.message} - this is most likely our fault and not yours.`
        }
      }
    },
    cancelLogin () {
      this.error = ''

      this.user = {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        confirmEmail: ''
      }

      this.errors = {
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        confirmEmail: ''
      }

      if (this.permanent) {
        this.$emit('cancelled')
      } else {
        this.loginActive = false
      }
    }
  }
}
</script>
