<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-form-item label="学号" prop="id">
        <el-input v-model="queryParams.id" placeholder="请输入学号" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="学生名" prop="realName">
        <el-input v-model="queryParams.realName" placeholder="请输入学生名" clearable
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

      <el-form-item label="入学年份起始" prop="enrollYearStart" label-width="100px">
        <el-input v-model="queryParams.enrollYearStart" placeholder="请输入起始入学年份(包括)" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="入学年份结束" prop="enrollYearEnd" label-width="100px">
        <el-input v-model="queryParams.enrollYearEnd" placeholder="请输入结束入学年份(包括)" clearable
                  @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="审核状态" prop="email" >
        <el-select v-model="queryParams.isApprove" placeholder="选择审核状态" clearable>
          <el-option label="未审核" :value="0"></el-option>
          <el-option label="审核成功" :value="1"></el-option>
          <el-option label="审核失败" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="queryParams.email" placeholder="请输入邮箱" clearable @keyup.enter.native="handleQuery"/>
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
        <el-button type="success" plain icon="el-icon-edit" size="mini"
                   @click="getFailOrUnCheck">审核学生
        </el-button>
      </el-col>
      <el-col :span="1.5" v-show="CheckMode==='check'">
        <el-button type="success" plain icon="el-icon-edit" size="mini"
                   @click="quickCheck">退出审核
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-edit" size="mini"  v-show="!multiple"
                   @click="handleCheckBatch('y')">审核成功
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-edit" size="mini" v-show="!multiple"
                   @click="handleCheckBatch('n')">审核失败
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                   @click="handleDelete">删除
        </el-button>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-upload" size="mini" @click.native="uploadVisible=true">导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click.stop="downloadTemplate">下载模板</el-button>
        </el-col>
      </el-col>
      <el-col :span="1.5">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="学号" align="center" prop="id"/>
      <el-table-column label="学生名" align="center" prop="realName"/>
      <el-table-column label="学院名" align="center" prop="departmentName"/>
      <el-table-column label="专业名" align="center" prop="majorName"/>
      <el-table-column label="入学年份" align="center" prop="enrollYear"/>
      <el-table-column label="性别" align="center" prop="gender">
        <template slot-scope="scope">
          <p v-if="scope.row.gender === 1">男</p>
          <p v-else-if="scope.row.gender === 0">女</p>
          <p v-else>未知</p>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="isApprove" >
        <template slot-scope="scope">
          <p v-if="scope.row.isApprove === 0">未审核</p>
          <p v-else-if="scope.row.isApprove === 1">审核成功</p>
          <p v-else-if="scope.row.isApprove === 2">审核失败</p>
          <p v-else>未知</p>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" prop="email"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-popover placement="right" width="400" trigger="click" v-show="CheckMode==='check'">
            <el-radio-group v-model="scope.row.isApprove" @change="handleApproveChange(scope)">
              <el-radio :label="1">审核成功</el-radio>
              <el-radio :label="2">审核失败</el-radio>
            </el-radio-group>
            <el-button size="mini" type="text" icon="el-icon-edit" slot="reference">审核</el-button>
          </el-popover>
          <el-button size="mini" type="text" icon="el-icon-edit"
                     @click="handleStuRate(scope.row)">查看评分
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-edit"
                     @click="handleUpdate(scope.row)">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete"
                     @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList"/>

    <!-- 添加或修改学生对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学生名" prop="realName" label-position="left">
          <el-input v-model="form.realName" placeholder="请输入学生名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-position="left">
          <template #label>
            <el-tooltip :content="form.id ? '密码留空代表不修改密码' : '添加用户的密码不能为空'" placement="top">
              <i class="el-icon-info" style="margin-left: 5px; color: #909399;"></i>
            </el-tooltip>
            密码
          </template>
          <el-input v-model="form.password" placeholder="输入密码"/>
        </el-form-item>

        <el-form-item label="学院名" prop="departmentName" label-position="left">
          <el-select v-model="form.departmentName" size="small" placeholder="请选择学院名"
                     @change="handleDepartmentChange">
            <el-option v-for="type in departmentNames" :key="type" :label="type" :value="type">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="专业名" prop="majorName" label-position="left">
          <el-select v-model="form.majorName" size="small" placeholder="请选择专业名" @change="handleMajorChange">
            <el-option v-for="type in majorNames" :key="type" :label="type" :value="type"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入学年份" prop="enrollYear" label-position="left">
          <el-input v-model="form.enrollYear" placeholder="请输入入学年份"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-position="left">
          <el-input v-model="form.email" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender" label-position="left">
          <el-select v-model="form.gender" placeholder="请选择性别" clearable>
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title=ShowRateTitle :visible.sync="openShowRate" width="800px"
               :default-sort="{ prop: 'updateTime', order: 'descending' }" append-to-body>
      <el-table v-loading="loading" :data="ShowRateRes.list">
        <el-table-column label="学生" align="center" prop="studentName"/>
        <el-table-column label="教师" align="center" prop="teacherName"/>
        <el-table-column label="班级" align="center" prop="stuClassName"/>
        <el-table-column label="课程" align="center" prop="courseName"/>
        <el-table-column label="评价项" sortable="" align="center" prop="evalItem"/>
        <el-table-column label="评分" align="center" prop="rate"/>
        <el-table-column label="评分时间" align="center" prop="updateTime">
        </el-table-column>
        -->
      </el-table>
      <pagination v-show="ShowRateRes.total > 0" :total="ShowRateRes.total"
                  :page.sync="ShowRateTitleQueryParams.pageNum" :limit.sync="ShowRateTitleQueryParams.pageSize"
                  @pagination="handleStuRate"/>
    </el-dialog>
    <el-dialog :visible="uploadVisible" title="批量导入学生(自动上传)"
               :before-close="handleBeforeClose">
      <el-upload
        class="upload-demo"
        action="http://localhost:8081/user/batchStudentImport"
        :before-upload="beforeUpload"
        :on-success="handleUploadSuccess"
        :file-list="file">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import {listStudent, getStudent, delStudent, addStudent, updateStudent, getStudentRate} from "@/api/student";
import {getAllDepartmentName} from '@/api/department'
import {getAllMajorName} from '@/api/major'
import {approveforstudent, getFailOrUnCheck} from '@/api/user'

export default {
  name: "Student",
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
      // 学生表格数据
      studentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openShowRate: false,
      ShowRateTitle: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        realName: null,
        majorName: null,
        departmentName: null,
        enrollYearStart: null,
        isApprove: null,
        email: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      departmentNames: [],
      majorNames: [],
      studentRateList: [],
      ShowRateTitleQueryParams: {
        studentId: -1,
        pageNum: 1,
        pageSize: 10,
      },
      ShowRateRes: [],
      ShowRateStudentId: null,
      CheckMode:'uncheck',
      uploadVisible:false,
      file:[],
    };

  },
  created() {
    this.getList();
    getAllDepartmentName().then(res => {
      console.log("created");
      this.departmentNames = res.data
    })
    getAllMajorName().then(res => {
      this.majorNames = res.data
    })
  },
  mounted() {


  },
  methods: {
    handleBeforeClose(){
      this.uploadVisible=false
    },
    downloadTemplate(event){
      // 创建一个隐藏的链接
      const link = document.createElement('a');
      link.href = '/static/学生导入模板.xlsx';
      link.setAttribute('download', '学生导入模板.xlsx');
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

    /** 查询学生列表 */
    getList() {
      this.loading = true;
      if (this.CheckMode==='uncheck'){
        listStudent(this.queryParams).then(response => {
          this.studentList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      } else if(this.CheckMode==='check'){
        getFailOrUnCheck(this.queryParams).then(response => {
          this.studentList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
          this.CheckMode='check'
        })
      }
    },
    handleApproveChange(scope){
      console.log(scope.row.isApprove);
      console.log(scope.row);
      approveforstudent(scope.row.id,scope.row.isApprove===1?'y':'n').then(res=>{
        this.getList()
      })
    },
    getFailOrUnCheck() {
      getFailOrUnCheck(this.queryParams).then(response => {
        this.studentList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
        this.CheckMode='check'
      })
    },
    handleCheckBatch(confirm){
      this.reset();
      const id = row.id || this.ids
      getStudent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生";
      });
    },
    quickCheck(){
      this.CheckMode='uncheck'
      this.getList()
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
        password: null,
        majorName: null,
        departmentName: null,
        enrollYear: null,
        email: null,
        updateTime: null,
        createTime: null,
        delFlag: null
      };
      this.resetForm("queryParams");
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
      this.title = "添加学生";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStudent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生";
      });
    },
    handleAllDepartmentName() {

    },
    handleAllCourseName() {

    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateStudent(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStudent(this.form).then(response => {
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
      this.$confirm('是否确认删除学生编号为"' + ids + '"的数据项？').then(function () {
        return delStudent(ids);
      }).then(() => {
        this.getList();
        this.$message.Success("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/student/export', {
        ...this.queryParams
      }, `student_${new Date().getTime()}.xlsx`)
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
      console.log('');
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
        console.log(this.queryForm);
        this.queryParams.majorName = ''
        this.majorNames = res.data
      })
    },
    handleStuRate(row) {
      console.log(row);

      this.openShowRate = true
      if (row.id) {
        this.ShowRateStudentId = row.id;
      }
      this.ShowRateTitleQueryParams.studentId = this.ShowRateStudentId
      getStudentRate(this.ShowRateTitleQueryParams).then(res => {
        this.ShowRateRes = res.data
        if (this.ShowRateRes.list[0] && this.ShowRateRes.list[0].studentName) {
          this.ShowRateTitle = "学生 " + this.ShowRateRes.list[0].studentName + " 的评价情况"
        } else {
          this.ShowRateTitle = "学生 " + row.realName + " 的评价情况"
        }
      })

    }
  }
};
</script>
