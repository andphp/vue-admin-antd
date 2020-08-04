import request from '@/utils/request'
// import qs from 'qs'

export function getSmsCaptcha (parameter) {
  return request({
    url: '/account/sms',
    method: 'post',
    data: parameter
  })
}

export function login(params) {
  return request({
    url: '/login',
    method: 'post',
    data: params
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getMenu() {
  return request({
    url: '/menu/nav',
    method: 'get'
  })
}
