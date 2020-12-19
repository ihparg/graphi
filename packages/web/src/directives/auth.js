import store from '@/store'

export default (el, binding) => {
  const role = Array.isArray(binding.value) ? binding.value : [binding.value]
  if (!role.includes(store.state.user.currentUser.role)) {
    if (binding.arg === 'page') binding.instance.$router.push('/noauth')
    else if (binding.arg === 'comp') el.style.display = 'none'
  }
}
