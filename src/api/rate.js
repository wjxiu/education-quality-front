import request from '@/utils/request'

export function getAlleval(teacherid,stuClassId,questionnaireId) {
  return request({
    url: '/eval/stu/' + teacherid+"/"+stuClassId+"/"+questionnaireId,
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
// GET http://localhost:8081/stuEval/rateList
export function rateList() {
  return request({
    url: '/stuEval/rateList' ,
    method: 'get'
  })
}
