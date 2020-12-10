import auth from './auth'

export default app => {
  app.directive('auth', auth)
}
