<template>
  <div class="dashboard-container" >
    {{$store.getters.roles}}
    <div class="dashboard-text"> {{ name }},欢迎来到学生评价系统</div>
    <div class="dashboard-text">当前角色为: {{ roleText }}</div>
    <div class="dashboard-text">
      <div v-if="type === 0">
        <div v-if="StudentRemainStuClassRateList.length>0">
          未完成评价的班级：
          <ul>
            <li v-for=" item in StudentRemainStuClassRateList">{{ item }}</li>
          </ul>
        </div>
        <div v-else>已经全部完成评价</div>
      </div>
      <div v-else-if="type === 1">
        以下是评分情况
        <br>
        总体平均数：{{StudentRateSituation[0]['mean']}}<br>
        总体中位数：{{StudentRateSituation[0]["median"]}}<br>
        总体众数：<span v-for="item in StudentRateSituation[0].mode">{{item}}</span><br>
        以下是每一项评分的情况：
        <el-table :data="StudentRateSituation[0].list">
          <el-table-column label="评分项" prop="evalItem" ></el-table-column>
          <el-table-column label="平均数" prop="mean"></el-table-column>
          <el-table-column label="中位数" prop="median" ></el-table-column>
          <el-table-column label="众数" prop="mode" ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getStudentRateSituation, getStudentRemainStuClassRate, getStuClassRateSituation} from '@/api/satistics'

export default {
  name: 'Dashboard',
  data() {
    return {

      // 教师的学生的评价情况
      StudentRateSituation: [],
      // 学生未评价的
      StudentRemainStuClassRateList: [],
      ClassRateSituationRespList: [],
    }
  },
  created() {
    if (this.type === 0) {
      this.roleText = '学生'
      getStudentRemainStuClassRate(this.id).then(res => {
        this.StudentRemainStuClassRateList = res.data
      })
    } else if (this.type === 1) {
      this.roleText = '教师'
      getStudentRateSituation(this.id).then(res => {
        this.StudentRateSituation = res.data
      })
    } else if (this.type === 2) {
      this.roleText = '管理员'
    }
  },
  computed: {
    ...mapGetters([
      'name', 'id', 'type'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
