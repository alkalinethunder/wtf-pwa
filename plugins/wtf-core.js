import Vue from 'vue'

Vue.component('wtf-navigation', () => (import('~/components/wtf-navigation.vue')))
Vue.component('wtf-drawer-navigation', () => (import('~/components/wtf-drawer-navigation.vue')))
Vue.component('wtf-drawer-user-menu', () => (import('~/components/wtf-drawer-user-menu.vue')))
Vue.component('wtf-user-menu', () => (import('~/components/wtf-user-menu.vue')))
Vue.component('wtf-socials', () => (import('~/components/wtf-socials.vue')))

Vue.component('wtf-comment', () => import('~/components/wtf-comment.vue'))
Vue.component('wtf-comments', () => import('~/components/wtf-comments.vue'))

Vue.component('wtf-admin-navigation', () => import('~/components/wtf-admin-navigation.vue'))

Vue.component('wtf-dark-mode-toggle', () => import('~/components/wtf-dark-mode-toggle.vue'))

Vue.component('wtf-page-editor', () => import('~/components/wtf-page-editor.vue'))
Vue.component('wtf-page-viewer', () => import('~/components/wtf-page-viewer.vue'))
