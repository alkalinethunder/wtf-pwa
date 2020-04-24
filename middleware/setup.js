export default async function (context) {
  if (context.route.path !== '/installation-error') {
    try {
      const setupStatus = await context.app.$axios.get('/api/setup/configure')

      context.store.commit('siteSettings/updateSiteSettings', setupStatus.data.settings)

      if (setupStatus.data.done) {
        if (context.route.path.startsWith('/setup') && context.route.path !== '/setup/done') {
          context.redirect('/setup/done')
        }
      } else if (!context.route.path.startsWith('/setup') || context.route.path === '/setup/done') {
        context.redirect('/setup')
      }
    } catch (err) {
      context.redirect('/installation-error')
    }
  }
}
