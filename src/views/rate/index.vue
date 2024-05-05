<template>
  <div class="centered-container">
    <el-container>
      <el-aside width="250px">
        <el-card>教师|课程列表|问卷</el-card>
        <el-menu>
          <el-menu-item v-for="teacher in teachers"
                        @click="handlechangeteacher(teacher)">
            <span slot="title">{{ teacher.teacherName }} | {{
                teacher.stuClassName
              }}|{{ teacher.questionnaireName }}</span>
          </el-menu-item>
          <el-collapse/>
        </el-menu>
      </el-aside>
      <el-container v-if="Object.keys(selectedTeacher).length > 0">
        <el-main>
          <span>学生：{{ selectedTeacher.studentName }}</span>
          <hr>
          <span>教师: {{ selectedTeacher.teacherName }}</span>
          <hr>
          <span>班级：{{ selectedTeacher.stuClassName }}</span>
          <hr>
          <span>课程：{{ selectedTeacher.courseName }}</span>
          <hr>
          <span>问卷：{{ selectedTeacher.questionnaireName }}</span>
          <hr>
          <el-table :data="evaluationItems" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
            <el-table-column prop="evalItem" label="评价项"></el-table-column>
            <el-table-column label="评分">
              <template slot-scope="scope">
                <el-rate v-model="scope.row.rate" show-text></el-rate>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <hr>
        <el-footer class="review" height="auto">
          <span>请输入对{{ selectedTeacher.teacherName }}老师的评价（可选，最多一千字）</span>
          <hr>
          <el-input maxlength="1000"
                    show-word-limit
                    type="textarea"
                    rows="4"
                    placeholder="请输入内容"
                    v-model="comment">
          </el-input>
          <hr>
          <el-button type="primary" :disabled="buttonDisabled" @click="submitEvaluation">提交评分与评价</el-button>
        </el-footer>
      </el-container>
      <el-empty description="请选择老师进行评价" v-else
                style="display: flex; justify-content: center; align-items: center;"></el-empty>
    </el-container>
  </div>
</template>

<script>
import {getAlleval, submitEval, rateList} from '@/api/rate.js'
import {getAllTeacher} from '@/api/student'

export default {
  data() {
    return {
      //学生的老师
      teachers: [],
      //选中的老师
      selectedTeacher: {},
      //初始的评价
      evaluationItems: [],
      comment: '',
      //监听之后的变化
      evaluationChangeItems: {},
      evaluationSubmitData: {
        "id": 0,
        "stuId": 0,
        "evalItemId": 0,
        "teacherId": 0,
        "stuClassId": 0,
        'list': [{
          "evalItemId": 0,
          "rate": 0
        }],
      },
      buttonDisabled: false,
      choooseItem: {},
    };
  },
  watch: {
    evaluationItems: {
      handler(newQuestions) {
        this.evaluationChangeItems = newQuestions.map(question => ({
          question,
          score: question.rate !== null ? question.rate : 0
        }));
      },
      immediate: true,
    },
  },
  mounted() {
    // this.handlegetAllTeacher();
    this.handlerateList();
  },
  methods: {
    handlerateList() {
      rateList().then(res => {
        this.teachers = res.data
      })
    },

    selectTeacher(index) {
      getAlleval(index)
    },
    submitEvaluation() {
      let temp = {...this.selectedTeacher}; // 使用对象解构语法进行浅拷贝
      let list = [];
      for (const key in this.evaluationChangeItems) {
        let item = this.evaluationChangeItems[key];
        let newitem = {
          id: item.question.id,
          rate: item.question.rate,
          evalItemId: item.question.evalId
        };
        list.push(newitem)
      }
      temp.teacherId = this.selectedTeacher.teacherId;
      temp.list = list;
      temp.comment = this.comment;
      temp.studentId=this.$store.state.user.id
      // 禁用按钮
      // this.buttonDisabled = true;
      submitEval(temp).then(res => {
        this.$message.success("保存成功")
        getAlleval(this.selectedTeacher.teacherId, this.selectedTeacher.stuClassId, this.selectedTeacher.questionnaireId).then(res => {
          this.evaluationItems = res.data.list;
          this.comment = res.data.comment
        })
      })
      // 设置一秒钟后重新启用按钮

      // setTimeout(() => {
      //   this.buttonDisabled = false;
      // }, 1000);
    },
    handlechangeteacher(teacher) {
      console.log(teacher);
      this.selectedTeacher = teacher
      getAlleval(teacher.teacherId, teacher.stuClassId, teacher.questionnaireId).then(res => {
        // this.evaluationItems = res.data.list.map(item => ({ item, score: item.rate !== null ? item.rate : 0 }));
        this.evaluationItems = res.data.list
        console.log(this.evaluationItems);
        this.comment = res.data.comment
      })
    },
    beforeMount: function () {

    },
    handlegetAllTeacher() {
      getAllTeacher().then(res => {
        this.teachers = res.data
      })
    }
  },

};

</script>
<style>
.el-container {
  height: 100% !important;
}

body > .el-container {
  margin-bottom: 0px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-card {
  text-align: center;
}

.el-menu {
  text-align: center;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

aside {
  overflow-y: hidden !important
}

.review {
  display: block; /* 设置为块级元素 */
}

</style>
