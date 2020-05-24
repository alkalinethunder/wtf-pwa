import Vue from 'vue'
import mdRenderer from 'vue-markdown-renderer'
import { component as VueCodeHighlight } from 'vue-code-highlight'

import 'prismjs/themes/prism-twilight.css'
import '~/assets/wtf-global.css'

Vue.component('wtf-youtube', () => (import('~/components/wtf-youtube')))
Vue.component('wtf-markdown-editor', async () => (await import('~/components/wtf-markdown-editor.vue')))
Vue.component('Editor', async () => (await import('vuetify-markdown-editor')).Editor)
Vue.component('wtf-renderer', async () => (await import('~/components/wtf-renderer.vue')))

function getHeadingClass (depth) {
  switch (depth) {
    case 1:
      return 'headline'
    case 2:
      return 'title'
    case 3:
      return 'subtitle-1'
    case 4:
      return 'subtitle-2'
    case 5:
      return 'caption'
    case 6:
      return 'overline'
  }
}

Vue.use(mdRenderer, {
  marked: {
    gfm: true,
    breaks: true
  },
  elements: {
    image: 'v-img',
    routerLink: 'nuxt-link',
    table: 'v-simple-table'
  },
  mappings: {
    link: ({ token, createElement, config, processTokens }) => {
      if (token.href.startsWith('>')) {
        return createElement(config.elements.routerLink, {
          props: {
            to: token.href.splice(0, 1)
          }
        }, processTokens(token.tokens, createElement, config))
      } else {
        const url = new URL(token.href)
        let id
        if (url.hostname === 'youtu.be') {
          id = url.pathname.substring(1)
        } else if ((url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') && url.pathname === '/watch') {
          id = url.searchParams.get('v')
        } else {
          return createElement(config.elements.link, {
            attrs: {
              href: token.href
            }
          }, processTokens(token.tokens, createElement, config))
        }

        return createElement('wtf-youtube', {
          props: {
            id
          }
        })
      }
    },
    code: ({ token, createElement }) => createElement(
      VueCodeHighlight,
      token.text
    ),
    hr: ({ createElement }) => createElement('v-divider'),
    blockquote: ({ token, createElement, config, processTokens }) => createElement('blockquote', {
      attrs: {
        class: 'blockquote'
      }
    }, processTokens(token.tokens, createElement, config)),
    heading: ({ token, createElement, config, processTokens }) => createElement(config.elements.headingPrefix + token.depth, {
      attrs: {
        class: getHeadingClass(token.depth)
      }
    }, processTokens(token.tokens, createElement, config)),
    paragraph: ({ token, createElement, config, processTokens }) => createElement('p', {
      attrs: {
        class: 'body-1'
      }
    }, processTokens(token.tokens, createElement, config))
  }
})
