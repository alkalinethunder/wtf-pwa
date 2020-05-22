export default (context, inject) => {
  inject('menu', (slot) => {
    const items = context.store.state.menu.menus[slot]
    if (items && items.length) {
      return items
    } else {
      return false
    }
  })
}
