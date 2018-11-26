import extension from '@/utils/axiosX'
import { checkStatus, checkCode } from '@/utils/checkRes'
import { getToken, getRefreshToken, setToken, removeToken, removeRefreshToken } from '@/utils/auth'
import { refreshAccessToken } from '@/api/qiniu'
import qs from 'qs'
const service = extension(401101, 401100, '/oauth2/refresh_token', refreshAccessToken, getToken, getRefreshToken, setToken, removeToken, removeRefreshToken )
export default {
  post(url, data) {
    return service({
      method: 'post',
      url,
      data: qs.stringify(data),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(response => checkStatus(response)).then(response => checkCode(response))
  },
  put(url, data) {
    return service({
      method: 'put',
      url,
      data: qs.stringify(data),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(response => checkStatus(response)).then(response => checkCode(response))
  },
  get(url, params) {
    return service({
      method: 'get',
      url,
      params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(response => checkStatus(response)).then(response => checkCode(response))
  },
  delete(url, params) {
    return service({
      method: 'delete',
      url,
      params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(response => checkStatus(response)).then(response => checkCode(response))
  },
  upload(url, dic) {
    return service({
      method: 'post',
      url,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'multipart/form-data; charset=UTF-8'
      },
      data: (function() {
        const formData = new FormData()
        const arr = Object.keys(dic)
        // ele 数组元素；self 数组本身；dic对象；arr是由dic的keys组成
        arr.forEach((ele, index, self) => {
          formData.append(ele, dic[ele])
        })
        return formData
      }())
    }).then(response => checkStatus(response)).then(response => checkCode(response))
  },
  download(url, data) {
    return service({
      method: 'post',
      url,
      data: qs.stringify(data),
      responseType: 'blob',
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(response => checkStatus(response))
  }
}
