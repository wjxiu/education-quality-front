import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
export function changepasswd(passwordForm) {
  return request({
    url: '/user/changepasswd',
    method: 'post',
    data:passwordForm
  })
}
export function getFailOrUnCheck(query) {
  return request({
    url: '/user/getFailOrUnCheck',
    method: 'get',
    params:query
  })
}
export function approveforstudent(studentId,confirm) {
  return request({
    url: '/user/approveforstudent',
    method: 'post',
    params:{studentId,confirm}
  })
}
export function register(user) {
  return request({
    url: '/user/register',
    method: 'post',
    params:user
  })
}
