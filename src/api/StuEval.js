import request from '@/utils/request'

// 查询学生
export function getStudentRate(param) {
    return request({
        url: '/stuEval/list',
        method: 'get',
        params: param
    })
}
export function getStudentRateById(id) {
    return request({
        url: '/stuEval/' + id,
        method: 'get'
    })
}
export function updateStuEval(param) {
  return request({
    url: '/stuEval/',
    method: 'put',
    data:param
  })
}
