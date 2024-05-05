import request from '@/utils/request'

// 查询课程列表
export function listCourse(query) {
  return request({
    url: '/course/list',
    method: 'get',
    params: query
  })
}

// 查询课程详细
export function getCourse(id) {
  return request({
    url: '/course/' + id,
    method: 'get'
  })
}

// 新增课程
export function addCourse(data) {
  return request({
    url: '/course',
    method: 'post',
    data: data
  })
}

// 修改课程
export function updateCourse(data) {
  return request({
    url: '/course',
    method: 'put',
    data: data
  })
}

// 删除课程
export function delCourse(id) {
  return request({
    url: '/course/' + id,
    method: 'delete'
  })
}
export function allquestionnaire(courseId) {
  return request({
    url: '/course/allquestionnaire',
    method: 'get',
    params:{courseId}
  })
}
export function getAllCourseNameByMajorName(majorName) {
  var myurl='/course/allName/major/' + majorName;
  if (majorName === undefined||majorName===''){
    myurl='/course/allName'
  }
  return request({
    url: myurl,
    method: 'get'
  })
}
