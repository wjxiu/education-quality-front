<script>
import {getReviewByLoginTeacher} from '@/api/studentReviews'
import XLSX from 'xlsx';
import {getTeacherClasses,getTeacherCourse} from '@/api/teacher'
export default {
  data() {
    return {
      ViewList: [],
      stuClassList:[],
      courseList:[],
      selectedClass:'',
      selectedCourse:'',

    }
  },
  created() {
    getReviewByLoginTeacher().then(res => {
      this.ViewList = res.data.list
    })
    getTeacherClasses(this.$store.state.user.id).then(res=>{
      this.stuClassList=res.data
    })
    getTeacherCourse(this.$store.state.user.id).then(res=>{
      this.courseList=res.data
    })
  },
  methods: {
    // 表格数据写入excel，并导出为Excel文件
    /** 导出按钮操作 */
    exportToExcel() {
       var flattenedData=[]
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
        flatItem.stuClassName = item.relation.stuClassName;
        flatItem.teacherName = item.relation.teacherName;
        flatItem.comment = item.relation.comment;
        flatItem.commentTime = item.relation.commentTime;

        // 将新对象添加到扁平化数据数组中
        flattenedData.push(flatItem);
      });
      console.log(flattenedData);

      let tableData = flattenedData;

      // 创建一个新的Workbook
      let workbook = XLSX.utils.book_new();
      // 将数据转换为worksheet
      let worksheet = XLSX.utils.json_to_sheet(tableData);

      // 设置worksheet的列宽
      worksheet['!cols'] = [
        { wpx: 150 }, // 学生姓名列宽度
        { wpx: 150 }, // 课程名称列宽度
        { wpx: 150 }, // 班级名称列宽度
        { wpx: 150 }, // 老师姓名列宽度
        { wpx: 300 }, // 评价列宽度
        { wpx: 150 }, // 评论时间列宽度
      ];

      // 将worksheet添加到workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // 将workbook转换为Excel文件的二进制数据
      let excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      // 保存文件
      this.saveExcelFile(excelBuffer, '评价.xlsx');
    },
    // 保存Excel文件
    saveExcelFile(buffer, fileName) {
      const data = new Blob([buffer], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(data);
      link.download = fileName;
      link.click();
    },
    search(){
      getReviewByLoginTeacher(this.selectedClass,this.selectedCourse).then(res => {
        this.ViewList = res.data.list
      })
    },
    reset(){
      this.selectedClass=''
      this.selectedCourse=''
    }
  }
}

</script>

<template>
  <div class="app-container">
    <el-button type="primary" @click="exportToExcel">导出Excel</el-button>
    选择班级<el-select v-model="selectedClass" clearable placeholder="请选择班级">
      <el-option v-for="stuClass in stuClassList" :key="stuClass.id" :label="stuClass.name"  :value="stuClass.id"></el-option>
    </el-select>
    选择课程<el-select v-model="selectedCourse" clearable placeholder="请选择课程">
      <el-option v-for="course in courseList"  :key="course.id" :label="course.courseName" :value="course.courseId"></el-option>
    </el-select>
    <el-button type="primary" @click="search()">查询</el-button>
    <el-button type="primary"@click="reset()">重置</el-button>
    <el-table :data="ViewList" id="out-table">
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
      <el-table-column label="班级名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.relation.stuClassName }}
        </template>
      </el-table-column>
      <el-table-column label="老师姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.relation.teacherName }}
        </template>
      </el-table-column>
      <el-table-column label="评价" align="center" show-overflow-tooltip>
        <template slot-scope="scope" >
          {{ scope.row.relation.comment }}
        </template>
      </el-table-column>
      <el-table-column label="评论时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.relation.commentTime }}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<style scoped lang="scss">

</style>
