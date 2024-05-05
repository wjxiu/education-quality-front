import request from '@/utils/request'

// 查询问卷列表
export function listQuestionnaire(query) {
  return request({
    url: '/questionnaire/list',
    method: 'get',
    params: query
  })
}
export function listQuestionnaireWithCourse(query) {
  return request({
    url: '/questionnaire/listWithCourse',
    method: 'get',
    params:  {
      ...query}
  })
}

// 查询问卷详细
export function getQuestionnaire(id) {
  return request({
    url: '/questionnaire/' + id,
    method: 'get'
  })
}

// 新增问卷
export function addQuestionnaire(data) {
  return request({
    url: '/questionnaire',
    method: 'post',
    data: data
  })
}
export function addQuestionnaireWithItem(data) {
  return request({
    url: '/questionnaire/addAll',
    method: 'post',
    data:data
  })
}

// 修改问卷
export function updateQuestionnaire(data) {
  return request({
    url: '/questionnaire',
    method: 'put',
    data: data
  })
}

// 删除问卷
export function delQuestionnaire(id) {
  return request({
    url: '/questionnaire/' + id,
    method: 'delete'
  })
}
export function deleteQuestionItem(ids) {
  return request({
    url: '/questionnaire/deleteQuestionItem/' + ids,
    method: 'delete'
  })
}
// GET http://localhost:8081/questionnaire/unlinkQuestions
export function unlinkQuestions(data) {
  return request({
    url: '/questionnaire/unlinkQuestions',
    method: 'post',
    data:data
  })
}
// export function unlinkQuestions() {
//   return request({
//     url: '/questionnaire/unlinkQuestions',
//     method: 'get'
//   })
// }
export function link(data) {
  return request({
    url: '/questionnaire/link',
    method: 'post',
    data:data
  })
}
// POST http://localhost:8081/questionnaire/assign
export function assign(data) {
  return request({
    url: '/questionnaire/assign',
    method: 'post',
    data:data
  })
}
