import request from '@/utils/request'

export function getAlleval(teacherid) {
  return request({
    url: '/eval/stu/' + teacherid,
    method: 'get',
  })
}
export function getAllTeacher() {
  return request({
    url: '/eval/stu/',
    method: 'get',
  })
}
// POST http://localhost:8081/eval/submit
export function submitEval(data) {
  return request({
    url: '/eval/submit/',
    method: 'post',
    data
  })
}