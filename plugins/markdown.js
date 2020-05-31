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
    breaks: true,
    mangle: false,
    tokenizer: {
      inlineText (src, inRawBlock, smartypants) {
        // FUCK that's a long-ass regex I stole from marked's code.
        const cap = /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<![`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+/=?_`{|}~-](?=[a-zA-Z0-9.!#$%&'*+/=?_`{|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+/=?_`{|}~-]+@))/.exec(src)

        // So basically I'm stealing marked's regular inlineText tokenizer function and inserting my own code into it.
        if (cap) {
          let raw = cap[0]
          let text = ''

          // This is where my code starts.
          const mentionRegex = /@([\w-]+)/g
          const mentionCap = mentionRegex.exec(raw)

          // Basically this allows you to @mention people - in a really fucking hacky way.
          if (mentionCap) {
            const mentionStart = mentionRegex.lastIndex - mentionCap[0].length
            if (mentionStart > 0) {
              raw = raw.substring(0, mentionStart)
            } else {
              return {
                type: 'mention',
                raw: mentionCap[0],
                user: mentionCap[1]
              }
            }
          }

          if (inRawBlock) {
            text = this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(raw) : escape(raw)) : raw
          } else {
            text = escape(this.options.smartypants ? smartypants(raw) : raw)
          }

          return {
            type: 'text',
            raw,
            text
          }
        } else {
          return false
        }
      }
    }
  },
  elements: {
    image: 'v-img',
    routerLink: 'nuxt-link',
    table: 'v-simple-table'
  },
  mappings: {
    mention: ({ token, createElement }) => {
      return createElement('wtf-user-mention', {
        props: {
          value: token.user
        }
      })
    },
    link: ({ token, createElement, config, processTokens }) => {
      if (token.href.startsWith('>')) {
        return createElement(config.elements.routerLink, {
          props: {
            to: token.href.substring(1)
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
        class: 'body-2'
      }
    }, processTokens(token.tokens, createElement, config))
  }
})
