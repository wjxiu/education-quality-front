import request from '@/utils/request'

// 查询班级列表
export function listStuClass(query) {
    return request({
        url: '/stuClass/list',
        method: 'get',
        params: query
    })
}

// 查询班级详细
export function getStuClass(id) {
    return request({
        url: '/stuClass/' + id,
        method: 'get'
    })
}

// 新增班级
export function addStuClass(data) {
    return request({
        url: '/stuClass',
        method: 'post',
        data: data
    })
}

// 修改班级
export function updateStuClass(data) {
    return request({
        url: '/stuClass',
        method: 'put',
        data: data
    })
}

// 删除班级
export function delStuClass(id) {
    return request({
        url: '/stuClass/' + id,
        method: 'delete'
    })
}
