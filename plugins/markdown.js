import Vue from 'vue'
import 'vuetify-markdown-editor/dist/vuetify-markdown-editor.css'

Vue.component('Editor', async () => (await import('vuetify-markdown-editor')).Editor)
Vue.component('wtf-renderer', async () => (await import('~/components/wtf-renderer.vue')))
