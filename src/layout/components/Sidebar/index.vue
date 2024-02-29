<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import {id} from "html-webpack-plugin/lib/chunksorter";
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      // roles是角色认证
      'sidebar','roles'
    ]),
    routes() {
      const map={
        'student':['首页','教师评价'],
        'teacher':['首页']
      }
      const userrole=this.roles;
      // 遍历路由数组
      // const resu = this.$router.options.routes.filter(route => {
      //
      //   if (route.children && route.children.length > 0) {
      //     // 过滤出符合当前用户角色的子路由
      //     const filteredChildren = route.children.filter(childRoute => {
      //       // 检查当前用户角色是否在子路由的角色列表中
      //       return childRoute.meta.roles !== undefined && childRoute.meta.roles.includes(userrole);
      //     });
      //     // 如果存在符合当前用户角色的子路由，则保留父路由并添加过滤后的子路由
      //     if (filteredChildren.length > 0) {
      //       // 更新父路由的子路由为符合条件的子路由
      //       route.children = filteredChildren;
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   } else {
      //     return true;
      //   }
      // });

      // console.log(resu);
      // //判断this,roles在route.meta.roles是否存在
      // const { meta, path } = this.$route
      // console.log(meta.roles);
      return this.$router.options.routes
    },
    activeMenu() {
      const { meta, path } = this.$route
      // if set path, the sidebar will highlight the path you set
      // if (map.student.includes(meta.title))
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
