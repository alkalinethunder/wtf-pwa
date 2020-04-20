export default function (context) {
  if (context.app.$auth.loggedIn) {
    const isAdmin = (context.app.$auth.user.owner || context.app.$auth.user.admin)
    if (!isAdmin) {
      context.redirect('/')
    }
  } else {
    context.redirect('/auth/login')
  }
}
