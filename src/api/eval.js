import request from '@/utils/request'

// 查询评分管理列表
export function listEval(query) {
    return request({
        url: '/eval/list',
        method: 'get',
        params: query
    })
}

// 查询评分管理详细
export function getEval(id) {
    return request({
        url: '/eval/' + id,
        method: 'get'
    })
}

// 新增评分管理
export function addEval(data) {
    return request({
        url: '/eval',
        method: 'post',
        data: data
    })
}

// 修改评分管理
export function updateEval(data) {
    return request({
        url: '/eval',
        method: 'put',
        data: data
    })
}
export function updateEvalBatch(data) {
  return request({
    url: '/eval/updateList',
    method: 'put',
    data: data
  })
}

// 删除评分管理
export function delEval(id) {
    return request({
        url: '/eval/' + id,
        method: 'delete'
    })
}
export function getquestionEval(questionId) {
  return request({
    url: '/eval/question' ,
    method: 'get',
    params:{questionId:questionId}
  })
}
export function notlink(questionId) {
  return request({
    url: '/eval/notlink' ,
    method: 'get',
    params:{questionId:questionId}
  })
}
