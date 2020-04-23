<template>
  <div>
    <h1 class="headline text-center">
      Create account
    </h1>
    <p class="text-center">
      Create an account to post comments, rate projects, and more.
    </p>

    <v-card>
      <v-form v-model="valid" @submit="register">
        <v-card-text>
          <v-text-field v-model="user.username" :error-messages="usernameErrors" label="Username" :rules="usernameRules" />

          <v-row>
            <v-col>
              <v-text-field v-model="user.email" label="Email address" :rules="emailRules" />
            </v-col>
            <v-col>
              <v-text-field v-model="user.emailConfirm" :error-messages="emailErrors" label="Confirm email" :rules="emailRules" />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field v-model="user.password" label="Password" :rules="passwordRules" type="password" />
            </v-col>
            <v-col>
              <v-text-field v-model="user.passwordConfirm" :error-messages="passwordErrors" label="Confirm password" :rules="passwordRules" type="password" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn text type="submit">
            Create account
          </v-btn>
          <span class="grey--text">
            Have an account already?
            <nuxt-link to="/auth/login">
              Log in
            </nuxt-link>
          </span>
        </v-card-actions>
      </v-form>
    </v-card>

    <v-dialog v-if="error">
      <v-card>
        <v-card-title class="headline" primary-title>
          An error has occurred.
        </v-card-title>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="error = false">
            Dismiss
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
      valid: false,
      user: {
        email: '',
        emailConfirm: '',
        username: '',
        password: '',
        passwordConfirm: ''
      },
      error: false,
      errorMessage: '',
      usernameErrors: [],
      emailErrors: [],
      passwordErrors: [],
      emailRules: [
        v => v ? true : 'Email is required.',
        v => v.match(/(.*)@(.*)\.(.*)/) ? true : "That's not a valid email address."
      ],
      passwordRules: [
        v => v ? true : 'Password is required.'
      ],
      usernameRules: [
        v => v ? true : 'Username is required.'
      ]
    }
  },
  methods: {
    register (evt) {
      evt.preventDefault()
      if (!this.user.username) {
        this.valid = false
        this.usernameErrors = ['Username is required.']
      } else if (this.user.email !== this.user.emailConfirm) {
        this.valid = false
        this.emailErrors = ['Emails do not match.']
      } else if (this.user.password !== this.user.passwordConfirm) {
        this.valid = false
        this.passwordErrors = ['Passwords do not match.']
      } else {
        this.$axios.post('/api/users', this.user)
          .then(async (res) => {
            await this.$auth.loginWith('local', {
              data: {
                email: this.user.email,
                password: this.user.password
              }
            })

            this.$router.push('/')
          })
          .catch((err) => {
            if (err) {
              this.error = true
              this.errorMessage = err.message
            }
          })
      }
    }
  }
}
</script>
