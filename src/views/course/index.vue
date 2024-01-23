<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="学院名" prop="departmentName">
        <el-select v-model="queryParams.departmentName" size="small" placeholder="请选择学院名"
                   @change="handleDepartmentQueryChange" clearable>
          <el-option v-for="type in departmentNames" :key="type" :label="type" :value="type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业名" prop="majorName">
        <el-select v-model="queryParams.majorName" size="small" placeholder="请选择专业名"
                   @change="handleMajorChange"
                   clearable>
          <el-option v-for="type in majorNames" :key="type" :label="type" :value="type"></el-option>
        </el-select>
        <el-form-item label="课程名" prop="courseName">
          <el-select clearable v-model="queryParams.courseName">
            <el-option  v-for="type in courseNames" :key="type" :label="type" :value="type"></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="课程id" align="center" prop="id" />
      <el-table-column label="所属学院" align="center" prop="departmentName" />
      <el-table-column label="所属专业" align="center" prop="majorName" />
      <el-table-column label="课程名" align="center" prop="courseName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改课程对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程名" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名" />
        </el-form-item>
        <el-form-item label="所属学院" prop="departmentName">
          <el-select v-model="form.departmentName" size="small" placeholder="请选择学院名"
                     @change="handleDepartmentQueryChange" >
            <el-option v-for="type in departmentNames" :key="type" :label="type" :value="type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属专业" prop="majorName">
          <el-input v-model="form.majorName" placeholder="请输入专业"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listCourse, getCourse, delCourse, addCourse, updateCourse,getAllCourseNameByMajorName} from "@/api/course";
import {getAllMajorName} from "@/api/major";
import {getAllDepartmentName} from "@/api/department";

export default {
  name: "Course",
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
      // 课程表格数据
      courseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        courseName: null,
        departmentName: null,
        majorName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      departmentNames:[],
      majorNames:[],
      courseNames:[],
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
    getAllCourseNameByMajorName().then(res=>{
      console.log(res.data)
      this.courseNames=res.data
      this.form.courseName=''
    })
    this.getList();

  },
  methods: {
    /** 查询课程列表 */
    getList() {
      this.loading = true;
      listCourse(this.queryParams).then(response => {
        this.courseList = response.data.list;
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
        courseName: null,
        departmentName: null,
        majorName: null,
        startYear: null,
        term: null,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加课程";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCourse(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改课程";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCourse(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCourse(this.form).then(response => {
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
      this.$confirm('是否确认删除课程编号为"' + ids + '"的数据项？').then(function () {
        return delCourse(ids);
      }).then(() => {
        this.getList();
        this.$message.success("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/course/export', {
        ...this.queryParams
      }, `course_${new Date().getTime()}.xlsx`)
    },
    resetForm(formname) {
      const targetForm = this.$data[formname];
      console.log(targetForm);
      const defaultForm = { pageNum: 1, pageSize: 10 };
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
      getAllCourseNameByMajorName(selectedValue).then(res => {
        this.form.courseName=''
        this.courseNames=res.data
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
  }
};
</script>
