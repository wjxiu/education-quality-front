import request from '@/utils/request'

/**
 * 查看某个教师所属学生的评分情况
 * @param teacherIds
 * @returns {*}
 */
export function getStudentRateSituation(teacherIds) {
  return request({
    url: '/statistics/StudentRateSituation/'+teacherIds,
    method: 'get'
  })
}

/**
 * 查看学生未完成评价的班级
 * @param studentIds
 * @returns {*}
 */
export function getStudentRemainStuClassRate(studentIds) {
  return request({
    url: '/statistics/StudentRemainStuClassRate/'+studentIds,
    method: 'get'
  })
}

/**
 * 查看某个班级的评分条数
 * @param stuClassIds
 * @returns {*}
 */
export function getStuClassRateSituation(stuClassIds) {
  return request({
    url: '/statistics/StuClassRateSituation/'+stuClassIds,
    method: 'get'
  })
}
