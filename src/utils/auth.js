import Cookies from 'js-cookie'

const AccessToken = 'Access-Token'
const RefreshToken = 'Refresh-Token'

export function getToken() {
  return Cookies.get(AccessToken)
}

export function setToken(token) {
  return Cookies.set(AccessToken, token)
}

export function removeToken() {
  return Cookies.remove(AccessToken)
}

export function getRefreshToken() {
  return Cookies.get(RefreshToken)
}

export function setRefreshToken(token) {
  return Cookies.set(RefreshToken, token)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshToken)
}
