export default (context, inject) => {
  inject('menu', (slot) => {
    return context.store.state.menu.menus[slot] || []
  })
}
