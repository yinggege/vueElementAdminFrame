import axios from 'axios'
export default function(code1, code2, url, api, getToken, getRefreshToken, setToken, removeToken, removeRefreshToken ) {
  let isRefreshing = false
  let refreshSubscribers = []
  const service = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 10000
  })
  service.interceptors.request.use(config => {
    if (getToken() && getRefreshToken()) {
      if (config.url === url) {
        config.headers['refresh_token'] = getRefreshToken()
      }
      config.headers['access_token'] = getToken()
    }
    return config
  }, error => {
    return Promise.reject(error)
  })

  service.interceptors.response.use(response => {
    const { config, data: { code }} = response
    const originalRequest = config
    if (code === code1) {
      var subscribeTokenRefresh = function(cb) {
        refreshSubscribers.push(cb)
      }
      var onRrefreshen = function(token) {
        refreshSubscribers.map(cb => cb(token))
        refreshSubscribers = []
      }
      const retryOrigReq = new Promise((resolve, reject) => {
        subscribeTokenRefresh(token => {
          originalRequest.headers['access_token'] = token
          resolve(axios(originalRequest))
        })
      })
      if (!isRefreshing && (originalRequest.headers.access_token === getToken())) {
        isRefreshing = true
        api().then(response => {
          const data = JSON.parse(response.data.data)
          setToken(data.access_token)
          isRefreshing = false
          onRrefreshen(getToken())
        })
      } else if (!isRefreshing && (originalRequest.headers.access_token !== getToken())) {
        onRrefreshen(getToken())
      }
      return retryOrigReq
    } else if (code === code2) {
      removeToken()
      removeRefreshToken()
      location.reload()
    }
    return response
  }, error => Promise.resolve(error.response))
  return service
}
