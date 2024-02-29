import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard',roles:['admin',"student",'teacher'] }
    }]
  },
  {
    path: '/rate',
    component: Layout,
    children: [{
      path: 'index',
      name: 'rate',
      component: () => import('@/views/rate/index'),
      meta: { title: '教师评价', icon: 'el-icon-star-off',roles:['student'] }
    }]
  },
  {
    path: '/department',
    component: Layout,
    children: [{
      path: 'index',
      name: 'department',
      component: () => import('@/views/department/index'),
      meta: { title: '学院管理', icon: 'dashboard' ,roles:['admin'] }
    }]
  },
  {
    path: '/major',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'major',
        component: () => import('@/views/major/index'),
        meta: { title: '专业管理', icon: 'form',roles:['admin'] }
      }
    ]
  },
  {
    path: '/course',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'course',
        component: () => import('@/views/course/index'),
        meta: { title: '课程管理', icon: 'form',roles:['admin'] }
      }
    ]
  },
  {
    path: '/eval',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'eval',
        component: () => import('@/views/eval/index'),
        meta: { title: '评价选项管理', icon: 'form',roles:['admin'] }
      }
    ]
  },

  {
    path: '/teacher',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'teacher',
        component: () => import('@/views/teacher/index'),
        meta: { title: '教师管理', icon: 'el-icon-platform-eleme',roles:['admin'] }
      },

    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: '/student/index',
    meta: { title: '学生管理', icon: 'el-icon-s-help',roles:['admin'] },
    children: [
      {
        path: 'index',
        name: 'student',
        component: () => import('@/views/student/index'),
        meta: { title: '学生基本信息', icon: 'el-icon-platform-eleme',roles:['admin'] }
      },
      {
        path: 'rateDetail',
        name: 'rateDetail',
        component: () => import('@/views/student/rateDetail'),
        meta: { title: '已评分的评价项', icon: 'el-icon-platform-eleme',roles:['admin'] }
      }
    ]
  },
  {
    path: '/stuClass',
    component: Layout,
    redirct:'/stuClass/index',
    meta: { title: '班级管理', icon: 'el-icon-platform-eleme' ,roles:['admin']},
    children: [
      {
        path: 'index',
        name: 'stuClass',
        component: () => import('@/views/stuClass/index'),
        meta: { title: '班级管理', icon: 'el-icon-platform-eleme' ,roles:['admin']}
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = [

]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
