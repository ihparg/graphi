let snackbar
let show

export default {
  install(app) {
    show = (msg, type) => {
      if (!snackbar) return
      snackbar().createSnackbar({
        message: msg,
        duration: 4000,
        type,
      })
    }

    app.config.globalProperties.$message = {
      show,
      error(msg) {
        show(msg, 'error')
      },
      bind(ref) {
        snackbar = ref
      },
    }
  },

  get show() {
    return show
  },
}
