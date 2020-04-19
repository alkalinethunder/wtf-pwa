export const state = () => {
  return {
    dark: false
  }
}

export const mutations = {
  toggleDarkMode (state) {
    state.dark = !state.dark
  }
}
