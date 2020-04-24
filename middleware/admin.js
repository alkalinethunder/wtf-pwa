export default function (context) {
  if (context.app.$auth.loggedIn) {
    const isAdmin = (context.app.$auth.user.owner || context.app.$auth.user.admin)
    if (!isAdmin) {
      context.error({
        statusCode: 403,
        message: 'You are not permitted to access the administration panel.'
      })
    }
  } else {
    context.redirect('/auth/login')
  }
}
