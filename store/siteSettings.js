export const state = () => {
  return {
    dark: false,
    settings: {}
  }
}

export const mutations = {
  updateSiteSettings (state, settings) {
    state.settings = settings
  },
  toggleDarkMode (state) {
    state.dark = !state.dark
  }
}
