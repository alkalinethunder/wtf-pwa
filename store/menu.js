export const state = () => {
  return {
    menus: {},
    theme: {}
  }
}

export const mutations = {
  addItem (state, item) {
    if (!(item.slot in state.menus)) {
      state.menus[item.slot] = []
    }
    state.menus[item.slot].push(item)
  },
  update (state, { manifest, menuSystem }) {
    state.menus = {}
    state.theme = manifest

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
