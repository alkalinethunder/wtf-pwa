export const state = () => {
  return {
    menus: {}
  }
}

export const mutations = {
  update (state, { manifest, menuSystem }) {
    alert(manifest)
    alert(menuSystem)

    state.menus = {}

    for (const menu of manifest.menus) {
      if (!(menu.slot in state.menus)) {
        state.menus[menu.slot] = []
        for (const menuitem of menuSystem) {
          if (menuitem.slot === menu.slot) {
            state.menus[menu.slot].push(menuitem)
          }
        }
      }
    }

    for (const menuItem of menuSystem) {
      if (!(menuItem.slot in state.menus)) {
        state.menus.primary.push(menuItem)
      }
    }
  }
}
