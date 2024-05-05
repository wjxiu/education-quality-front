import request from '@/utils/request'

export function getAllTeacher(stuId) {
  if (stuId === undefined || stuId === null) {
    return request({
      url: '/student/getStuTeacher/',
      method: 'get'
    })
  } else {
    return request({
      url: '/student/getStuTeacher/' + stuId,
      method: 'get'
    })
  }
}
// 查询学生列表
export function listStudent(query) {
  return request({
    url: '/student/list',
    method: 'get',
    params: query
  })
}

// 查询学生详细
export function getStudent(id) {
  return request({
    url: '/student/' + id,
    method: 'get'
  })
}

// 新增学生
export function addStudent(data) {
  return request({
    url: '/student',
    method: 'post',
    data: data
  })
}

// 修改学生
export function updateStudent(data) {
  return request({
    url: '/student',
    method: 'put',
    data: data
  })
}

// 删除学生
export function delStudent(id) {
  return request({
    url: '/student/' + id,
    method: 'delete'
  })
}
export function getStudentRate(form) {
  return request({
    url: '/stuEval/getOneStudentRate' ,
    method: 'get',
    params:form
  })
}


