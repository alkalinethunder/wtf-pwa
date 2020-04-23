<template>
  <div>
    <h1>Welcome!</h1>
    <p>If you're seeing this page, then this codebase is somehow functioning correctly. But there's still one more thing you need to do.</p>
    <p>To take full advantage of this app's features, you will need to create your first user account.  This user account will have full administrator privileges and will be used to control the entire site.</p>

    <v-divider />

    <h4>Administrator account</h4>

    <v-form v-model="valid" @submit="createAdminAccount">
      <v-text-field v-model="admin.username" label="Admin username" :rules="admin.usernameRules" />

      <v-row>
        <v-col>
          <v-text-field v-model="admin.email" label="Admin email" type="email" :rules="admin.emailRules" :error-messages="admin.emailErrors" />
        </v-col>
        <v-col>
          <v-text-field v-model="admin.confirmEmail" label="Confirm" type="email" :rules="admin.emailRules" :error-messages="admin.emailErrors" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field v-model="admin.password" label="Password" :rules="admin.passwordRules" type="password" :error-messages="admin.passwordErrors" />
        </v-col>
        <v-col>
          <v-text-field v-model="admin.confirmPassword" label="Confirm" :rules="admin.passwordRules" type="password" :error-messages="admin.passwordErrors" />
        </v-col>
      </v-row>

      <v-btn type="submit">
        Create account
      </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      valid: false,
      admin: {
        username: '',
        usernameRules: [
          v => !!v || 'Username is required.'
        ],
        password: '',
        confirmPassword: '',
        email: '',
        confirmEmail: '',
        emailRules: [
          v => !!v || 'Email is required.',
          v => v.match(/(.*)@(.*)\.(.*)/) ? true : 'Must be a valid email address.'
        ],
        passwordErrors: [],
        emailErrors: []
      }
    }
  },
  methods: {
    async createAdminAccount (evt) {
      evt.preventDefault()

      this.admin.emailErrors = []
      this.admin.passwordErrors = []

      if (this.admin.email !== this.admin.confirmEmail) {
        this.admin.emailErrors.push('Emails do not match.')
      } else if (this.admin.password !== this.admin.confirmPassword) {
        this.admin.passwordErrors.push('Passwords do not match.')
      } else {
        try {
          const result = await this.$axios.post('/api/setup/configure', {
            admin: {
              email: this.admin.email,
              emailConfirm: this.admin.confirmEmail,
              password: this.admin.password,
              passwordConfirm: this.admin.confirmPassword,
              username: this.admin.username
            }
          })

          if (result) {
            const loginResult = await this.$auth.loginWith('local', {
              data: {
                email: this.admin.email,
                password: this.admin.password
              }
            })

            if (loginResult) {
              this.$router.go('/setup/done')
            }
          }
        } catch (err) {
          alert(err)
        }
      }
    }
  }
}
</script>
