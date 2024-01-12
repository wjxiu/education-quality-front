import request from '@/utils/request'

export function getAllTeacher() {
  return request({
    url: '/student/getallteacher',
    method: 'get'
    
  })
}
