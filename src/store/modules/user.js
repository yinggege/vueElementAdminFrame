import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    refreshToken: getRefreshToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFRESHTOKEN: (state, token) => {
      state.refreshToken = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    LoginByUsername({ commit }, loginData) {
      return new Promise((resolve, reject) => {
        loginByUsername(loginData).then(response => {
          if (response.data.success) {
            const data = JSON.parse(response.data.data)
            commit('SET_TOKEN', data.access_token)
            setToken(data.access_token)
            commit('SET_REFRESHTOKEN', data.refresh_token)
            setRefreshToken(data.refresh_token)
            resolve()
          } else {
            reject()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // // 刷新access_token
    // RefreshAccessToken({ commit }) {
    //   return new Promise((resolve, reject) => {
    //     refreshAccessToken().then(response => {
    //       const data = JSON.parse(response.data.data)
    //       commit('SET_TOKEN', data.access_token)
    //       setToken(data.access_token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          const data = response.data.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            var roles = []
            for (var i in data.roles) {
              roles.push(data.roles[i].name)
            }
            commit('SET_ROLES', roles)
            commit('SET_NAME', data.user.username)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 用户 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_REFRESHTOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeRefreshToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    // FedLogOut({ commit }) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', '')
    //     removeToken()
    //     commit('SET_REFRESHTOKEN', '')
    //     removeRefreshToken()
    //     resolve()
    //   })
    // },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
