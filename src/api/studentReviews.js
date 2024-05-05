import request from '@/utils/request'

// 查询评分管理列表
export function listReview(query) {
  return request({
    url: '/studentReviews/list',
    method: 'get',
    params: query
  })
}

// 查询评分管理详细
export function getReview(id) {
  return request({
    url: '/studentReviews/' + id,
    method: 'get'
  })
}
export function getReviewByLoginTeacher(param,pageNum,pageSize) {
  return request({
    url: '/studentReviews/commentOfTeacher',
    method: 'post',
    data:param,
    params: {
      pageNum: pageNum,
      pageSize: pageSize
    },
  })
}

// 新增评分管理
export function addReview(data) {
  return request({
    url: '/studentReviews',
    method: 'post',
    data: data
  })
}

// 修改评分管理
export function updateReview(data) {
  return request({
    url: '/studentReviews',
    method: 'put',
    data: data
  })
}

// 删除评分管理
export function delReview(id) {
  return request({
    url: '/studentReviews/' + id,
    method: 'delete'
  })
}
