<script>
import {getReviewByLoginTeacher} from '@/api/studentReviews'
import XLSX from 'xlsx';
import {getTeacherClasses, getTeacherCourse, getTeacherYear} from '@/api/teacher'
import {getStuClassByCourseID} from '@/api/stuClass'

export default {
  data() {
    return {
      ViewList: [],
      stuClassList: [],
      courseList: [],
      startYearList: [],
      TermList: ['上学期', '下学期', '全年'],
      searchParam: {
        stuClassId: '',
        courseId: '',
        term: '',
        startYear: '',
        teacherId:'',
      },
      pageNum:1,
      pageSize:10,
      total:0,
    }
  },
  watch:{
    'searchParam.courseId':
      {
        handler(newValue, oldValue) {
          if (newValue){
            getStuClassByCourseID(newValue).then(res => {
              this.stuClassList = res.data
            })
          }
        }
      }
  },
  created() {
    getReviewByLoginTeacher(this.searchParam,this.pageNum,this.pageSize).then(res => {
      this.ViewList = res.data.list
      this.total=res.data.total
    })
    getTeacherClasses(this.$store.state.user.id).then(res => {
      this.stuClassList = res.data
    })
    getTeacherCourse(this.$store.state.user.id).then(res => {
      this.courseList = res.data
    })
    getTeacherYear(this.$store.state.user.id).then(res => {
      this.startYearList = res.data
    })
  },
  methods: {
    // 表格数据写入excel，并导出为Excel文件
    /** 导出按钮操作 */
    exportToExcel() {
      var flattenedData = []
      if (this.ViewList.length === 0) {
        this.$message.error("数据为空");
        return; // 如果数据为空，不执行导出操作
      }

      this.ViewList.forEach(item => {
        // 创建一个新对象，用于存放扁平化后的数据
        let flatItem = {};

        // 将嵌套对象的属性提取出来，放入新对象中
        flatItem.studentName = item.relation.studentName;
        flatItem.courseName = item.relation.courseName;
        flatItem.startYear = item.stuClass.startYear;
        flatItem.term = item.stuClass.term;
        flatItem.stuClassName = item.relation.stuClassName;
        flatItem.teacherName = item.relation.teacherName;
        flatItem.comment = item.relation.comment;
        flatItem.commentTime = item.relation.commentTime;

        // 将新对象添加到扁平化数据数组中
        flattenedData.push(flatItem);
      });

      let tableData = flattenedData;

      // 创建一个新的Workbook
      let workbook = XLSX.utils.book_new();
      // 将数据转换为worksheet
      let worksheet = XLSX.utils.json_to_sheet(tableData);

      // 设置worksheet的列宽
      worksheet['!cols'] = [
        {wpx: 150}, // 学生姓名列宽度
        {wpx: 150}, // 课程名称列宽度
        {wpx: 150}, // 班级名称列宽度
        {wpx: 150}, // 老师姓名列宽度
        {wpx: 300}, // 评价列宽度
        {wpx: 150}, // 评论时间列宽度
      ];

      // 将worksheet添加到workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // 将workbook转换为Excel文件的二进制数据
      let excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
      // 保存文件
      this.saveExcelFile(excelBuffer, this.$store.state.user.name + '的评价.xlsx');
    },
    // 保存Excel文件
    saveExcelFile(buffer, fileName) {
      const data = new Blob([buffer], {type: 'application/octet-stream'});
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(data);
      link.download = fileName;
      link.click();
    },
    search() {
      getReviewByLoginTeacher(this.searchParam, this.pageNum, this.pageSize).then(res => {
        this.ViewList = res.data.list
        this.total = res.data.total
      })
    },
    reset() {
      this.searchParam = {
        stuClassId: '',
        courseId: '',
        term: '',
        startYear: '',
        teacherId:null,
      }
      this.search()
    }
  }
}

</script>

<template>
  <div class="app-container">

    输入教师id
    <el-input v-model="searchParam.teacherId" clearable placeholder="输入教师id" style="width: auto">
    </el-input>
    选择班级
    <el-select v-model="searchParam.stuClassId" clearable placeholder="请选择班级">
      <el-option v-for="stuClass in stuClassList" :key="stuClass.id" :label="stuClass.name"
                 :value="stuClass.id"></el-option>
    </el-select>
    选择课程
    <el-select v-model="searchParam.courseId" clearable placeholder="请选择课程">
      <el-option v-for="course in courseList" :key="course.id" :label="course.courseName"
                 :value="course.courseId"></el-option>
    </el-select>
    选择年份
    <el-select v-model="searchParam.startYear" clearable placeholder="请选择年份">
      <el-option v-for="startYear in startYearList" :key="startYear" :label="startYear" :value="startYear"></el-option>
    </el-select>

    选择学期
    <el-select v-model="searchParam.term" clearable placeholder="请选择学期">
      <el-option v-for="course in TermList" :key="course" :label="course" :value="course"></el-option>
    </el-select>
    <hr>
    <el-button type="primary" @click="search()">查询</el-button>
    <el-button type="primary" @click="reset()">重置</el-button>
    <el-button type="primary" @click="exportToExcel">导出Excel</el-button>
    <hr>
    <el-table :data="ViewList" id="out-table">
      <el-table-column label="学生id" align="center">
        <template slot-scope="scope">
          {{ scope.row.relation.studentId }}
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.relation.studentName }}
        </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.relation.courseName }}
        </template>
      </el-table-column>
      <el-table-column label="年份" align="center">
        <template slot-scope="scope">
          {{ scope.row.stuClass.startYear }}
        </template>
      </el-table-column>
      <el-table-column label="学期" align="center">
        <template slot-scope="scope">
          {{ scope.row.stuClass.term }}
        </template>
      </el-table-column>
      <el-table-column label="班级名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.relation.stuClassName }}
        </template>
      </el-table-column>
      <el-table-column label="老师id" align="center">
        <template slot-scope="scope">
          {{ scope.row.relation.teacherId }}
        </template>
      </el-table-column>
      <el-table-column label="老师姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.relation.teacherName }}
        </template>
      </el-table-column>
      <el-table-column label="评价" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- 使用条件语句判断评论是否为空 -->
          {{ scope.row.relation.comment || '未评价' }}
        </template>
      </el-table-column>
      <el-table-column label="评论时间" align="center">
        <template slot-scope="scope">
          <!-- 使用条件语句判断评论时间是否为空 -->
          {{ scope.row.relation.commentTime || '暂无评论时间' }}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      @pagination="search"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
