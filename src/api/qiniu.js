import request from '@/utils/request'
export var refreshAccessToken = () => request.post('/oauth2/refresh_token')// 刷新access_token接口
