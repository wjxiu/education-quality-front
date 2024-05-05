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
      <el-form-item label="班级名" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入班级名" clearable @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item label="课程名" prop="name">
        <el-input v-model="queryParams.courseName" placeholder="请输入课程名" clearable
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
      <!--      <el-col :span="1.5">-->
      <!--        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>-->
      <!--      </el-col>-->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="questionVisable=true">自定义问卷
        </el-button>
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
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handlelinkOpen(scope.row)">问卷分配
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList()"
    />
    <el-dialog :title="selectedStuClass.name" :visible.sync="openChangeStudents" width="700px" append-to-body>
      <el-form :model="stuClassSearchForm" ref="queryForm" size="small" :inline="true" v-show="showSearch"
               label-width="68px">
        <el-form-item label="学生id" prop="studentId">
          <el-input v-model="stuClassSearchForm.studentId" placeholder="请输入学生id" clearable
                    @keyup.enter.native="handleClassStudent()"/>
        </el-form-item>
        <el-form-item label="学生名" prop="teacherId">
          <el-input v-model="stuClassSearchForm.studentName" placeholder="请输入学生名" clearable
                    @keyup.enter.native="handleClassStudent()"/>
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
              <el-input v-model="addStudentId" @keyup.enter.native='handleAddStudentOfClass'
                        placeholder="输入学生id"></el-input>
              <el-button @click="handleAddStudentOfClass">确认</el-button>
            </div>
            <el-button slot="reference">新增</el-button>
          </el-popover>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="selelctStudentMultiple"
                     @click="handleclassStudentDelete">删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-col>
      </el-row>
      <el-table :data="students" style="width: 100%" @selection-change="handleSelectionDeleteStudentChange">
        <el-table-column type="selection" width="55" align="center"/>
        <!-- 表格列的配置 -->
        <el-table-column prop="id" label="学生id" width="180"></el-table-column>
        <el-table-column prop="realName" label="学生名" width="180"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-delete"
                       @click="handleclassStudentDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班级名" prop="name">
          <el-input v-model="form.name" placeholder="请输入班级名"/>
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
    <el-dialog :visible.sync="questionVisable">
      <el-form :model="questionAdd">
        <el-form-item label="问卷名">
          <el-input
            v-model="questionAdd.questionnaireName"
            placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="选项" label-width="">
          <!-- 添加新选项的按钮 -->
          <el-button type="primary" @click="addOption">添加选项</el-button>
          <!-- 显示已有的选项 -->
          <div v-for="(option, index) in questionItems" :key="index" class="option-row">
            <span style="width:80px">第{{ index + 1 }}项</span>
            <el-input v-model="option.evalItem" placeholder="请输入选项"></el-input>
            <el-button type="danger" @click="removeOption(index)">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddQuestionForm">确定或修改</el-button>
        <el-button @click="cancelAddQuestionForm">关闭窗口</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="questionLinkVisible" :title="assignTitle" width="70%">
      <el-table :data="unlinkQuestionList">
        <el-table-column label="问卷名" prop="questionnaireName"/>
        <el-table-column label="创建者" prop="createorName"/>
        <el-table-column label="是否自定义" prop="customizeFlag">
          <template slot-scope="scope">
            {{ scope.row.customizeFlag === 1 ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column min-width="200px" label="是否使用该问卷作为调查问卷">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.assignFlag"
              active-text="使用"
              inactive-text="不使用"
              :active-value="1"
              :inactive-value="0"
              @change="submitAssginQuestionForm(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click=" questionLinkVisible = false">关闭窗口</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listStuClass,
  getStuClass,
  delStuClass,
  addStuClass,
  updateStuClass,
  getStuClassStudent,
  deleteStuClassStudent,
  addStuClassStudent
} from "@/api/stuClass";
import {getAllDepartmentName} from '@/api/department'
import {getAllMajorName} from '@/api/major'
import {addQuestionnaireWithItem, unlinkQuestions, assign} from '@/api/quesitionnaire'

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
      AddStudenPopvisible: false,
      selelctStudentMultiple: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        courseId: null,
        teacherId: this.$store.state.user.id,
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
      selectedStuClass: {},
      students: [],
      addStudentId: null,
      stuClassSearchForm: {studentId: null, studentName: null},
      ClassStudentFormName: '',
      questionVisable: false,
      questionList: [],
      questionAdd: {},
      questionItems: [],
      questionLinkVisible: false,
      unlinkQuestionList: [],
      assignTitle:"",
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
    submitAssginQuestionForm(row) {
      console.log(this.selectedStuClass);
      let newrow = {
        questionnaireId:row.id,
        courseId:this.selectedStuClass.courseId,
        stuClassId:this.selectedStuClass.id,
        assignFlag:row.assignFlag,
        customizeFlag:row.customizeFlag
      }
      assign(newrow).then(res => {
        this.$message.success("修改成功")
        let param = {stuClassId:this.selectedStuClass.id,   courseId:this.selectedStuClass.courseId,}
        unlinkQuestions(param).then(res => {
          console.log(res);
          this.unlinkQuestionList = res.data
        //   fixme 添加统一异常处理之后这里的catch不生效了
        }).catch(err=>{
          console.info("🚀 ~ file:出错啦啦啦啦啦 method: line: -----",)
          // unlinkQuestions(param).then(res => {
          //   console.log(res);
          //   this.unlinkQuestionList = res.data
          // })
        })
      })
    },

    submitAddQuestionForm() {
      this.$set(this.questionAdd, "customizeFlag", 1);
      this.$set(this.questionAdd, "itemList", this.questionItems);
      // 循环遍历数组并删除"content"属性
      for (var i = 0; i < this.questionItems.length; i++) {
        delete this.questionItems[i].content;
      }
      addQuestionnaireWithItem(this.questionAdd).then(res => {
        this.questionAdd = res.data
        this.$message.success("添加或者修改成功，确认后手动关闭对话框")
      })
    },
    cancelAddQuestionForm() {
      this.questionItems = []
      this.questionAdd = {}
      this.questionVisable = false
    },
    addOption() {
      this.questionItems.push({content: ''}); // 添加一个新的选项
    },
    removeOption(index) {
      this.questionItems.splice(index, 1); // 删除指定索引的选项
    },
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
      this.openChangeStudents = false
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        courseId: null,
        teacherId: this.$store.state.user.id,
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
      this.selelctStudentMultiple = selection.length <= 0
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
    handlelinkOpen(row) {
      this.assignTitle=row.courseName+"|"+row.name+" 分配问卷"
      this.questionLinkVisible = true
      console.log(row);
      this.selectedStuClass=row
      const {id: stuClassId, courseId} = row;
      let param = {stuClassId, courseId}
      unlinkQuestions(param).then(res => {
        console.log(res);
        this.unlinkQuestionList = res.data
      })
      // this.unlinkQuestionList=
    },
    handleClassStudent(row) {
      if (row !== null && row !== undefined) {
        this.selectedStuClass = row
      }
      var param = {
        studentId: this.stuClassSearchForm.studentId,
        studentName: this.stuClassSearchForm.studentName
      }
      getStuClassStudent(this.selectedStuClass.id, param).then(res => {
        this.students = res.data
      })
      //   查询班级学生
      this.openChangeStudents = true
    },
    resetClassStudent() {
      this.resetForm("stuClassSearchForm")
      getStuClassStudent(this.selectedStuClass.id, {}).then(res => {
        this.students = res.data
      })
    },
    handleAddStudentOfClass() {
      if (!this.addStudentId) {
        this.$message.error("学生id为空")
        return false
      }
      // stuClassId,studentId
      addStuClassStudent(this.selectedStuClass.id, this.addStudentId).then(res => {
        getStuClassStudent(this.selectedStuClass.id, {}).then(res => {
          this.students = res.data
        })
        // 关闭弹窗
        this.AddStudenPopvisible = false
        this.$message.success("添加成功")
      })
      this.addStudentId = ''
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
<style scoped>
.option-row {
  display: flex;
  align-items: center;
}

.option-row > * {
  margin-right: 10px; /* 调整选项和按钮之间的间距 */
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>

