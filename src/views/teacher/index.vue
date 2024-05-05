<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="工号" prop="id">
        <el-input v-model="queryParams.id" placeholder="请输入工号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="姓名" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="管理员标识" prop="adminFlag" label-width="100px">
        <el-select v-model="queryParams.adminFlag" placeholder="请选择管理员标识" clearable >
          <el-option label="是" value="1"></el-option>
          <el-option label="不是" value="0"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click.native="handleAdd()">新增</el-button>

      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" @click.native="handleUpdate">修改</el-button>

      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click.native="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-upload" size="mini" @click.native="handleImport">导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click.stop="downloadTemplate">下载模板</el-button>
      </el-col>

      <el-col :span="1.5">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="teacherList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand" width="80">
        <template slot="header">
          <el-tooltip class="item" effect="dark" content="点击下方箭头图标显示具体班级" placement="top-start">
            <span><i class="el-icon-question"></i> 班级 </span>
          </el-tooltip>
        </template>
        <template slot-scope="props">
          <el-table :data="props.row.stuClassList">
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
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="工号" align="center" prop="id" />
      <el-table-column label="姓名" align="center" prop="realName" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="性别" align="center" prop="gender">
        <template slot-scope="scope">
       <p>   {{ scope.row.gender === 1 ? '男' : (scope.row.gender === 0 ? '女' : 'qqq') }}</p>
        </template>
      </el-table-column>
      <el-table-column label="管理员标识" align="center" prop="adminFlag">
        <template slot-scope="scope">
          <i :class="scope.row.adminFlag === 1 ? 'el-icon-check' : 'el-icon-close'
            " style="font-size: 20px"></i>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="性别" prop="gender" label-width="100px">
          <el-select v-model="form.gender" placeholder="请选择性别" clearable >
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理员标识" prop="adminFlag" label-width="100px">
          <el-select v-model="form.adminFlag" placeholder="请选择管理员标识" clearable >
            <el-option label="是" :value="1"></el-option>
            <el-option label="不是" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible="uploadVisible" title="批量导入教师(自动上传)"  :before-close="handleBeforeClose">
      <el-upload
        class="upload-demo"
        action="http://localhost:8081/user/batchTeacherImport"
        :before-upload="beforeUpload"
        :on-error="handleUploadError"
        :on-success="handleUploadSuccess"
        :file-list="file">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTeacher,
  getTeacher,
  delTeacher,
  addTeacher,
  updateTeacher,
  getTeacherClasses,
} from "@/api/teacher";

export default {
  name: "Teacher",
  data() {
    return {
      isExpand: false,
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
      // 【请填写功能名称】表格数据
      teacherList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        realName: null,
        phone: null,
        password: null,
        adminFlag: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      uploadVisible:false,
      file:[],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleBeforeClose(){
      this.uploadVisible=false
    },
    downloadTemplate(event){
      // 创建一个隐藏的链接
      const link = document.createElement('a');
      link.href = '/static/教师导入模板.xlsx';
      link.setAttribute('download', '教师导入模板.xlsx');
      link.style.display = 'none';
      document.body.appendChild(link);

      // 触发链接点击事件
      link.click();

      // 移除链接
      document.body.removeChild(link);

    },
    handleUploadError(error, file, fileList) {
      this.$message.error('文件上传失败，请重试！');
      console.error('文件上传失败：', error, file, fileList);
    },
    handleUploadSuccess(response, file, fileList) {
      console.log(response);
      if (response.code===200){
        this.$message.success('文件上传成功');
      }else{
        this.$message.error('文件上传失败或处理失败');
        this.$message.error(response.message);
      }
      // console.error('文件上传失败：', response, file, fileList);
    },

    handleImport(){
      this.uploadVisible=true
    },
    beforeUpload(file){
      const ismatch=file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      if (!ismatch) {
        this.$message.error('上传文件只能是 XLSX 格式!');
        return false;
      }
    },
    handleExpand() { },
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listTeacher(this.queryParams).then((response) => {
        this.teacherList = response.data.list;
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
        realName: null,
        phone: null,
        createTime: null,
        updateTime: null,
        delFlag: null,
        password: null,
        adminFlag: null,
        gender:null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加教师";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTeacher(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改教师";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateTeacher(this.form).then((response) => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeacher(this.form).then((response) => {
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
      this.$confirm('是否确认删除【请填写功能名称】编号为"' + ids + '"的数据项？')
        .then(function () {
          return delTeacher(ids);
        })
        .then(() => {
          this.getList();
          this.$message.success("删除成功");
        })
        .catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/teacher/export",
        {
          ...this.queryParams,
        },
        `teacher_${new Date().getTime()}.xlsx`
      );
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
  },
};
</script>
