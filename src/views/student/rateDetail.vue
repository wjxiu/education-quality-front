<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学生id" prop="studentId">
        <el-input v-model="queryParams.studentId" placeholder="请输入学生id" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="学生名" prop="studentName">
        <el-input v-model="queryParams.studentName" placeholder="请输入学生名" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="课程id" prop="courseId">
        <el-input v-model="queryParams.courseId" placeholder="请输入课程id" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="教师工号" prop="teacherId">
        <el-input v-model="queryParams.teacherId" placeholder="请输入教师工号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="学院id" prop="departmentId">
        <el-input v-model="queryParams.departmentId" placeholder="请输入学院id" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="班级id" prop="StuClassId">
        <el-input v-model="queryParams.StuClassId" placeholder="请输入班级id" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="班级名" prop="StuClassName">
        <el-input v-model="queryParams.name" placeholder="请输入班级名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="课程名" prop="courseName">
        <el-input v-model="queryParams.courseName" placeholder="请输入课程名" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="教师名" prop="teacherName">
        <el-input v-model="queryParams.teacherName" placeholder="请输入教师名" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="学院名" prop="departmentName">
        <el-select v-model="queryParams.departmentName" size="small" placeholder="请选择学院名"
                   @change="handleDepartmentQueryChange" clearable>
          <el-option v-for="type in departmentNames" :key="type" :label="type" :value="type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业名" prop="majorName">
        <el-select v-model="queryParams.majorName" size="small" placeholder="请选择专业名" clearable>
          <el-option v-for="type in majorNames" :key="type" :label="type" :value="type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分数" prop="rate">
        <el-select v-model="queryParams.rate" size="small" placeholder="请选择分数"
                   @change="handleDepartmentQueryChange" clearable>
          <el-option v-for="type in 5" :key="type" :label="type" :value="type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评分项" prop="evalId">
        <el-select v-model="queryParams.evalId" size="small" placeholder="请选择评分项" clearable>
          <el-option v-for="item in evalItems" :key="item.id" :label="item.evalItem" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single"
                   @click="handleUpdate">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                   @click="handleDelete">删除
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-col>
    </el-row>

    <el-table ref="mainTable" v-loading="loading" :data="studentRateList">
      <el-table-column label="学生id" align="center" prop="studentId"/>
      <el-table-column label="学生" align="center" prop="studentName"/>
      <el-table-column label="班级" align="center" prop="stuClassName"/>
      <el-table-column label="课程" align="center" prop="courseName"/>
      <el-table-column label="教师" align="center" prop="teacherName"/>
      <el-table-column label="评分项" align="center" prop="evalItem"/>
      <el-table-column label="评分" align="center" prop="rate"/>
      <el-table-column label="评分时间" align="center" prop="updateTime"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--          fixme:changeRatevisible控制不了隐藏-->
          <el-popover
            placement="top"
            width="160"
            :model="changeRatevisible">
            <p>选择新评分</p>
            <el-rate
              v-model="changeRateItem"
              :colors="colors">
            </el-rate>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="changeRatevisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="updateStuEvalScore(scope.row.id)">确定</el-button>
            </div>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handlechangeRate(scope.row.rate)" slot="reference">修改评分</el-button>
          </el-popover>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>

    <!-- 添加或修改班级对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      {{form}}
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生id" prop="studentId">
          <template slot-scope="scope">
            <span>{{ form.studentId }}</span>
          </template>
        </el-form-item>
        <el-form-item label="学生名" prop="studentName">
          <span>  {{ form.studentName }}</span>
        </el-form-item>
        <el-form-item label="教师名" prop="teacherName">
          <span>  {{ form.teacherName }}</span>
        </el-form-item>
        <el-form-item label="评分项" prop="evalId">
          <span>  {{ form.evalItem }}</span>
        </el-form-item>
        <el-form-item label="评分" prop="rate">
          <el-select v-model="form.rate" size="small" placeholder="请选择评分">
            <el-option v-for="type in 5" :key="type" :label="type" :value="type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名" prop="courseName">
          <span>  {{ form.courseName }}</span>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {delStuClass, addStuClass, updateStuClass} from "@/api/stuClass";
import {getAllDepartmentName} from '@/api/department'
import {getAllMajorName} from '@/api/major'
import {getStudentRate, getStudentRateById, updateStuEval} from "@/api/StuEval";
import {listEval} from '@/api/eval'
import {getAllTeacher} from '@/api/student'

export default {
  name: "StuClass",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 班级表格数据
      stuClassList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        courseId: null,
        teacherId: null,
        studentId: null,
        studentName: null,
        name: null,
        departmentId: null,
        departmentName: null,
        teacherName: null,
        majorName: null,
        rate: null,
        evalId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      majorNames: [],
      departmentNames: [],
      studentRateList: [],
      evalItems: [],
      teacherCourses: [],
      changeRatevisible:false,
      changeRateItem:-1,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']  // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }

    };
  },
  created() {
    getAllDepartmentName().then(res => {
      this.departmentNames = res.data
      this.form.departmentName = res.data
    })
    getAllMajorName().then(res => {
      this.majorNames = res.data
      this.form.majorName = ''
    })
    this.handleAllEvalItem();
    this.getList();
  },
  methods: {
    /** 查询班级列表 */
    getList() {
      this.loading = true;
      getStudentRate(this.queryParams).then(res => {
        this.studentRateList = res.data.list
        this.total = res.data.total
      })
      this.loading = false
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        courseId: null,
        teacherId: null,
        studentId: null,
        name: null,
        departmentId: null,
        departmentName: null,
        teacherName: null,
        majorName: null,
        rate: null,
        evalItem: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryParams");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加班级";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.title = "修改评分";
      getStudentRateById(row.id).then(res => {
        this.form = res.data
      })
      this.open = true;
      // const id = row.studentId
      // getAllTeacher(id).then(response => {
      //     this.teacherCourses = response.data;
      //     this.open = true;
      //
      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStuEval(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStuClass(this.form).then(response => {
              this.$message.success("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除学生评分项编号为"' + ids + '"的数据项？').then(function () {
        return delStuClass(ids);
      }).then(() => {
        this.getList();
        this.$message.success("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/stuClass/export', {
        ...this.queryParams
      }, `stuClass_${new Date().getTime()}.xlsx`)
    },
    resetForm(formname) {
      const targetForm = this.$data[formname];
      console.log(targetForm);
      const defaultForm = {pageNum: 1, pageSize: 10};
      // 如果找到了表单对象，则重置其属性对应的值为默认值
      if (targetForm) {
        Object.keys(targetForm).forEach(key => {
          this.$set(targetForm, key, defaultForm[key]);
        });
      }
    },
    handleDepartmentChange(selectedValue) {
      getAllMajorName(selectedValue).then(res => {
        this.majorNames = res.data
        this.form.majorName = ''
      })
    },
    handleMajorChange(selectedValue) {
      getAllDepartmentName(selectedValue).then(res => {
        this.form.departmentName = res.data[0]
      })
    },
    handleDepartmentClear() {
      getAllDepartmentName().then(res => {
        this.departmentNames = res.data
        this.form.departmentName = res.data
      })
      getAllMajorName().then(res => {
        this.majorNames = res.data
        this.form.majorName = ''
      })
    },
    handleDepartmentQueryChange(selectedValue) {
      getAllMajorName(selectedValue).then(res => {
        this.queryParams.majorName = ''
        this.majorNames = res.data
      })
    },
    handleAllEvalItem() {
      listEval().then(res => {
        this.evalItems = res.data.list
        console.log(this.evalItems);

      })
    },
    handlechangeRate(oldrate){
      this.changeRatevisible=true
      this.changeRateItem=oldrate
    },
    updateStuEvalScore(id){
      let param={
        id:id,
        rate:this.changeRateItem
      }
      updateStuEval(param).then(res=>{
        this.$message.success("修改评分成功")
        this.getList()
      })
      this.changeRatevisible=true
      console.log(this.changeRatevisible);
    },
  }
};
</script>
