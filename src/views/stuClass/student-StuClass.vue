<script>
import {addTeacher, delTeacher, getTeacher, listTeacher, updateTeacher} from "@/api/teacher";

export default {
  name: "student-StuClass",
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
        name: null,
        teacherName: null,
        departmentName: null,
        majorName: null,
        startYear:null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      majorNames: [],
      departmentNames: [],

    };
  },
  created() {
    this.getList();
  },
  methods: {
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
        email: null,
        createTime: null,
        updateTime: null,
        delFlag: null,
        password: null,
        adminFlag: null,
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
      this.resetForm("queryForm");
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
      //this.reset();
      this.open = true;
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getTeacher(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateTeacher(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTeacher(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
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
      this.$modal
        .confirm('是否确认删除【请填写功能名称】编号为"' + ids + '"的数据项？')
        .then(function () {
          return delTeacher(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
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
  },

}
</script>

<template>
  <div class="app-container">
<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-popover-->
<!--          placement="top-start"-->
<!--          title="为班级添加学生（按回车键确认）"-->
<!--          width="200"-->
<!--          trigger="hover"-->
<!--        >-->
<!--        </el-popover>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"-->
<!--                   @click="handleclassStudentDelete(row)">删除-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <el-popover
      placement="top-start"
      title="为班级添加学生（按回车键确认）"
      width="200px"
      trigger="hover"
    >
    </el-popover>
    <el-popover
      placement="top-start"
      title="标题"
      width="200"
      trigger="hover"
      content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
      <el-button slot="reference">hover 激活</el-button>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">

</style>
