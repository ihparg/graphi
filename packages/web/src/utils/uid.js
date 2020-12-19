let uid = Math.round(Date.now() / 60000)

export function getUid() {
  uid += 1
  return uid
}

export function nextUid() {
  return getUid().toString(36)
}
