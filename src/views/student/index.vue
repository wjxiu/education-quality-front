<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="学号" prop="id">
                <el-input v-model="queryParams.id" placeholder="请输入学号" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="学生名" prop="realName">
                <el-input v-model="queryParams.realName" placeholder="请输入学生名" clearable @keyup.enter.native="handleQuery" />
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
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="入学年份结束" prop="enrollYearEnd" label-width="100px">
                <el-input v-model="queryParams.enrollYearEnd" placeholder="请输入结束入学年份(包括)" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="queryParams.email" placeholder="请输入邮箱" clearable @keyup.enter.native="handleQuery" />
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
                    @click="handleUpdate">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                    @click="handleDelete">删除</el-button>
            </el-col>

            <el-col :span="1.5">
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="学号" align="center" prop="id" />
            <el-table-column label="学生名" align="center" prop="realName" />
            <el-table-column label="学院名" align="center" prop="departmentName" />
            <el-table-column label="专业名" align="center" prop="majorName" />
            <el-table-column label="入学年份" align="center" prop="enrollYear" />
            <el-table-column label="邮箱" align="center" prop="email" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        @click="handleStuRate(scope.row)">查看评分</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />

        <!-- 添加或修改学生对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="学生名" prop="realName">
                    <el-input v-model="form.realName" placeholder="请输入学生名" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <template #label>
                        <el-tooltip :content="form.id ? '密码留空代表不修改密码' : '添加用户的密码不能为空'" placement="top">
                            <i class="el-icon-info" style="margin-left: 5px; color: #909399;"></i>
                        </el-tooltip>密码
                    </template>
                    <el-input v-model="form.password" placeholder="输入密码" />
                </el-form-item>

                <el-form-item label="学院名" prop="departmentName">
                    <el-select v-model="form.departmentName" size="small" placeholder="请选择学院名"
                        @change="handleDepartmentChange">
                        <el-option v-for="type in departmentNames" :key="type" :label="type" :value="type">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="专业名" prop="majorName">
                    <el-select v-model="form.majorName" size="small" placeholder="请选择专业名" @change="handleMajorChange">
                        <el-option v-for="type in majorNames" :key="type" :label="type" :value="type"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="入学年份" prop="enrollYear">
                    <el-input v-model="form.enrollYear" placeholder="请输入入学年份" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog :title=ShowRateTitle :visible.sync="openShowRate" width="800px"
            :default-sort="{ prop: 'updateTime', order: 'descending' }" append-to-body>
            <el-table v-loading="loading" :data="studentRateList">
                <el-table-column label="教师" align="center" prop="teacherName" />
                <el-table-column label="班级" align="center" prop="stuClassName" />
                <el-table-column label="课程" align="center" prop="courseName" />
                <el-table-column label="评价项" sortable="" align="center" prop="evalItem" />
                <el-table-column label="评分" align="center" prop="rate" />
                <el-table-column label="评分时间" align="center" prop="updateTime">

                </el-table-column> -->
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import { listStudent, getStudent, delStudent, addStudent, updateStudent, getStudentRate } from "@/api/student";
import { getAllDepartmentName } from '@/api/department'
import { getAllMajorName } from '@/api/major'

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
                enrollYearStart: null,
                email: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
            },
            departmentNames: [],
            majorNames: [],
            studentRateList: [],
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
        /** 查询学生列表 */
        getList() {
            this.loading = true;
            listStudent(this.queryParams).then(response => {
                this.studentList = response.data.list;
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
            }).catch(() => { });
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
            this.ShowRateTitle = row.realName + " 学生的评价情况"
            const id = row.id
            this.openShowRate = true
            getStudentRate(id).then(res => {
                this.studentRateList = res.data
            })
        }
    }
};
</script>
