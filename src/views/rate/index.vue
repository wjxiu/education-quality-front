<template>
    <div class="centered-container">
        <el-container>
            <el-aside width="210px ">
                <el-card>教师|课程列表</el-card>
                <el-menu>
                    <el-menu-item v-for="teacher in teachers" :key="teacher.teacherId"
                        @click="handlechangeteacher(teacher.teacherId)">
                        <span slot="title">{{ teacher.teacherName }} | {{ teacher.stuClassName }}</span>
                    </el-menu-item>
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
                    <el-table :data="evaluationItems" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
                        <el-table-column prop="item.evalItem" label="评价项"></el-table-column>
                        <el-table-column label="评分">
                            <template slot-scope="scope">
                                <el-rate v-model="scope.row.score" show-text></el-rate>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
              <hr>
              <el-footer class="review" height="auto">
                <span >请输入对{{selectedTeacher.teacherName}}老师的评价（可选，最多一千字）</span>
                <hr>
                <el-input  maxlength="1000"
                           show-word-limit
                  type="textarea"
                  rows="4"
                  placeholder="请输入内容"
                  v-model="comment">
                </el-input>
                <hr>
                <el-button type="primary" @click="submitEvaluation">提交评分与评价</el-button>
              </el-footer>
            </el-container>
          <el-empty description="请选择老师进行评价" v-else
                style="display: flex; justify-content: center; align-items: center;"></el-empty>
        </el-container>
    </div>
</template>

<script>
import { getAlleval, submitEval } from '@/api/rate.js'
import { getAllTeacher } from '@/api/student'
export default {
    data() {
        return {
            //学生的老师
            teachers: [
            ],
            //选中的老师
            selectedTeacher: {},
            //初始的评价
            evaluationItems: [],
            comment:'',
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

        };
    },
    watch: {
        evaluationItems: {
            handler(newQuestions) {
                this.evaluationChangeItems = newQuestions.map(question => ({ question, score: question.rate !== null ? question.rate : 0 }));
            },
            immediate: true,
        },
    },
    mounted() {
        this.handlegetAllTeacher();
    },
    methods: {
        selectTeacher(index) {
            getAlleval(index)
        },
        submitEvaluation() {
            let temp = { ...this.selectedTeacher }; // 使用对象解构语法进行浅拷贝
            let list = [];
            for (const key in this.evaluationChangeItems) {
                let item = this.evaluationChangeItems[key];
                let newitem = {
                    id: item.question.item.id,
                    rate: item.question.score,
                    evalItemId: item.question.item.evalId
                };
                list.push(newitem)
            }
            temp.teacherId = this.selectedTeacher.teacherId;
            temp.list = list;
            temp.comment=this.comment;
            submitEval(temp).then(res => {
                this.$message.success("保存成功")
            })
        },
        handlechangeteacher(teacherid) {
            this.selectedTeacher = this.teachers.find((teacher) => teacher.teacherId === teacherid);
            getAlleval(teacherid,this.selectedTeacher.stuClassId).then(res => {
                this.evaluationItems = res.data.list.map(item => ({ item, score: item.rate !== null ? item.rate : 0 }));
                this.comment=res.data.comment
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

body>.el-container {
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
