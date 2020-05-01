<template>
  <div>
    <h3 class="text-center">
      Log In
    </h3>
    <p class="text-center">
      Please enter your email and password to log in.
    </p>

    <v-form v-model="valid" @submit="login">
      <v-text-field v-model="email" label="Email" type="email" :rules="emailRules" />
      <small class="text-secondary">Don't have an account yet?</small>

      <v-text-field v-model="password" label="Password" type="password" :rules="passwordRules" />

      <v-btn full-width type="submit" color="primary">
        Log in
      </v-btn>
    </v-form>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  auth: 'guest',
  data () {
    return {
      valid: false,
      email: '',
      password: '',
      emailRules: [
        v => v && v.length > 0 ? true : 'Email is required.',
        v => v.match(/(.*)@(.*)\.(.*)/) ? true : "That's not a valid email address."
      ],
      passwordRules: [
        v => v && v.length > 0 ? true : 'Password is required.'
      ]
    }
  },
  methods: {
    async login (evt) {
      evt.preventDefault()
      const result = await this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      })

      if (result) {
        this.$router.push('/')
      }
    }
  }
}
</script>
