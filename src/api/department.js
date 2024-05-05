import request from '@/utils/request'

// 查询部门列表
export function listDepartment(query) {
    return request({
        url: '/department/list',
        method: 'get',
        params: query
    })
}
// 查询专业详细
export function getAllDepartmentName(majorName) {
    if (majorName === undefined || majorName === null || majorName === '') majorName = ''
    return request({
        url: '/department/allName/' + majorName,
        method: 'get'
    })
}
// 查询部门详细
export function getDepartment(id) {
    return request({
        url: '/department/' + id,
        method: 'get'
    })
}

// 新增部门
export function addDepartment(data) {
    return request({
        url: '/department',
        method: 'post',
        data: data
    })
}

// 修改部门
export function updateDepartment(data) {
    return request({
        url: '/department',
        method: 'put',
        data: data
    })
}

// 删除部门
export function delDepartment(id) {
    return request({
        url: '/department/' + id,
        method: 'delete'
    })
}
export function getDepartmentByMajorName(majorName) {
  return request({
    url: '/department/getDepartmentByMajorName',
    method: 'get',
    params: {
      majorName: majorName
    }
  })
}
