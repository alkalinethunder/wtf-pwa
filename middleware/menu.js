export default async function (context) {
  try {
    const menuInfo = await context.app.$axios.get('/api/menu')
    const manifest = await context.app.$axios.get('/api/theme')

    context.store.commit('menu/update', { manifest: manifest.data, menuSystem: menuInfo.data })
  } catch (err) {
    context.error(err)
  }
}
