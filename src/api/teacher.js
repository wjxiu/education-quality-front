import request from '@/utils/request'

// 查询【请填写功能名称】列表
export function listTeacher(query) {
  return request({
    url: '/teacher/list',
    method: 'get',
    params: query
  })
}

// 查询【请填写功能名称】详细
export function getTeacher(id) {
  return request({
    url: '/teacher/' + id,
    method: 'get'
  })
}

// 新增【请填写功能名称】
export function addTeacher(data) {
  return request({
    url: '/teacher',
    method: 'post',
    data: data
  })
}

// 修改【请填写功能名称】
export function updateTeacher(data) {
  return request({
    url: '/teacher',
    method: 'put',
    data: data
  })
}

// 删除【请填写功能名称】
export function delTeacher(id) {
  return request({
    url: '/teacher/' + id,
    method: 'delete'
  })
}
