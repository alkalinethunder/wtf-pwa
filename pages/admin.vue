<template>
  <div>
    <nuxt-child />
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'auth'
}
</script>
