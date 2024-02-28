<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班级id" prop="id">
        <el-input v-model="queryParams.id" placeholder="请输入班级id" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="课程id" prop="courseId">
        <el-input v-model="queryParams.courseId" placeholder="请输入课程id" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="教师工号" prop="teacherId">
        <el-input v-model="queryParams.teacherId" placeholder="请输入教师工号" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="班级名" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入班级名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="课程名" prop="name">
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
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
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="stuClassList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="班级id" align="center" prop="id"/>
      <el-table-column label="班级名" align="center" prop="name"/>
      <el-table-column label="课程id" align="center" prop="courseId"/>
      <el-table-column label="课程名" align="center" prop="courseName"/>
      <el-table-column label="教师工号" align="center" prop="teacherId"/>
      <el-table-column label="教师名" align="center" prop="teacherName"/>
      <el-table-column label="开始年份" align="center" prop="startYear"/>
      <el-table-column label="学期" align="center" prop="term"/>
      <el-table-column label="学院名" align="center" prop="departmentName"/>
      <el-table-column label="专业名" align="center" prop="majorName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleClassStudent(scope.row)">查看班级学生
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="ClassStudentFormName" :visible.sync="openChangeStudents" width="700px" append-to-body>
      <el-form :model="stuClassSearchForm" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="学生id" prop="studentId">
          <el-input v-model="stuClassSearchForm.studentId" placeholder="请输入学生id" clearable @keyup.enter.native="handleClassStudent()"/>
        </el-form-item>
        <el-form-item label="学生名" prop="teacherId">
          <el-input v-model="stuClassSearchForm.studentName" placeholder="请输入学生名" clearable @keyup.enter.native="handleClassStudent()"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleClassStudent()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetClassStudent">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-popover
            placement="top-start"
            title="为班级添加学生（按回车键确认）"
            width="280"
            v-model="AddStudenPopvisible"
            trigger="click">
            <div>
            <el-input v-model="addStudentId" @keyup.enter.native='handleAddStudentOfClass' placeholder="输入学生id"></el-input>
              <el-button @click="handleAddStudentOfClass">确认</el-button>
            </div>
            <el-button  slot="reference" >新增</el-button>
          </el-popover>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini"  :disabled="selelctStudentMultiple"
                     @click="handleclassStudentDelete">删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-col>
      </el-row>
        <el-table :data="students" style="width: 100%" @selection-change="handleSelectionDeleteStudentChange" >
          <el-table-column type="selection" width="55" align="center"/>
          <!-- 表格列的配置 -->
          <el-table-column prop="id" label="学生id" width="180"></el-table-column>
          <el-table-column prop="realName" label="学生名" width="180"></el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-delete"

                         @click="handleclassStudentDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级名" prop="name">
          <el-input v-model="form.name" placeholder="请输入班级名"/>
        </el-form-item>
        <el-form-item label="教师工号" prop="name">
          <el-input v-model="form.teacherId" placeholder="请输入教师工号"/>
        </el-form-item>
        <el-form-item label="课程名" prop="name">
          <el-input v-model="form.courseName" placeholder="请输入课程名"/>
        </el-form-item>
        <el-form-item label="学院名" prop="majorName">
          <el-select v-model="form.departmentName" size="small" placeholder="请选择学院名"
                     @change="handleDepartmentChange">
            <el-option v-for="type in departmentNames" :key="type" :label="type" :value="type"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业名" prop="majorName">
          <el-select v-model="form.majorName" size="small" placeholder="请选择专业名" clearable>
            <el-option v-for="type in majorNames" :key="type" :label="type" :value="type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年份" prop="startYear">
          <el-date-picker
            v-model="form.startYear"
            type="year"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学期" prop="term">
          <el-select v-model="form.term" size="small" placeholder="请选择学期">
            <el-option v-for="type in ['上学期','下学期','全年']" :key="type" :label="type" :value="type"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
<!--    &lt;!&ndash; 添加或修改学生班级对话框 &ndash;&gt;-->
<!--    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>-->
<!--      <el-form ref="form" :model="form" :rules="rules" label-width="80px">-->
<!--        <el-form-item label="班级名" prop="studentId">-->
<!--          <el-input v-model="form.name" placeholder="请输入学生id"/>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--        <el-button @click="cancel">取 消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import {listStuClass, getStuClass, delStuClass, addStuClass, updateStuClass,getStuClassStudent,deleteStuClassStudent,addStuClassStudent} from "@/api/stuClass";
import {getAllDepartmentName} from '@/api/department'
import {getAllMajorName} from '@/api/major'

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
      openChangeStudents: false,
      // 是否显示添加学生
      AddStudenPopvisible:false,
      selelctStudentMultiple:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        courseId: null,
        teacherId: null,
        name: null,
        teacherName: null,
        departmentName: null,
        majorName: null,
        startYear: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},

      majorNames: [],
      departmentNames: [],
      selectedStuClass:{},
      students:[],
      addStudentId:null,
      stuClassSearchForm:{studentId: null,studentName:null},
      ClassStudentFormName:'',
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
    this.getList();
  },
  methods: {
    /** 查询班级列表 */
    getList() {
      this.loading = true;
      listStuClass(this.queryParams).then(response => {
        this.stuClassList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
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
        name: null,
        departmentName: null,
        majorName: null,
        createName: null,
        delFlag: null
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
    handleSelectionDeleteStudentChange(selection) {
      this.ids = selection.map(item => item.id)
      this.selelctStudentMultiple = selection.length<=0
      console.log(this.selelctStudentMultiple)
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
      const id = row.id || this.ids
      getStuClass(id).then(response => {
        this.form = response.data;
        this.form.startYear = this.form.startYear.toString()
        this.open = true;
        this.title = "修改班级";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            if (Object.prototype.toString.call(this.form.startYear) === '[object Date]') {
              this.form.startYear = this.form.startYear.getFullYear();
            }
            updateStuClass(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            if (Object.prototype.toString.call(this.form.startYear) === '[object Date]') {
              this.form.startYear = this.form.startYear.getFullYear();
            }
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
      this.$confirm('是否确认删除班级编号为"' + ids + '"的数据项？').then(function () {
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
      console.log(targetForm)
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
    handleClassStudent(row) {
      if (row !== null&&row!==undefined){
        this.selectedStuClass=row
      }
      // this.ClassStudentFormName=
    var param=  {studentId:this.stuClassSearchForm.studentId,
        studentName:this.stuClassSearchForm.studentName}
      getStuClassStudent(this.selectedStuClass.id,param).then(res=>{
        this.students=res.data
      })
      //   查询班级学生
      this.openChangeStudents = true
    },
    resetClassStudent(){
      this.resetForm("stuClassSearchForm")
      getStuClassStudent(this.selectedStuClass.id, {}).then(res=>{
        this.students=res.data
      })
    },
    handleAddStudentOfClass(){
      // stuClassId,studentId
      addStuClassStudent(this.selectedStuClass.id,this.addStudentId).then(res=>{
        getStuClassStudent(this.selectedStuClass.id,{}).then(res=>{
          this.students=res.data
        })
        // 关闭弹窗
        this.AddStudenPopvisible = false
        this.$message.success("添加成功")
      })
    },
    handleclassStudentDelete(row) {
      console.log(row);
      console.log(this.ids);
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除班级编号为"' + ids + '"的数据项？').then(() => {
        return deleteStuClassStudent(this.selectedStuClass.id, ids);
      }).then(() => {
        this.handleClassStudent();
        this.$message.success("删除成功");
      }).catch(() => {
        // 处理错误
      });
    }

  }
};
</script>
