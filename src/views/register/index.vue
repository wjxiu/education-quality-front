<template>
  <div class="register-form">
    <h2>{{ formData.type === 'student' ? '学生注册' : '教师注册' }}</h2>
<!--    <el-radio-group v-model="formData.type">-->
<!--      <el-radio label="student">学生</el-radio>-->
<!--      <el-radio label="teacher">教师</el-radio>-->
<!--    </el-radio-group>-->

    <el-form :model="formData" :rules="rules" ref="registerForm" label-width="100px" v-if="formData.type === 'student'">
      <!-- 学生注册表单 -->
      <el-form-item label="学号" prop="id">
        <el-input v-model="formData.id" placeholder="请输入学号" clearable></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="formData.realName" placeholder="请输入真实姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formData.password" placeholder="请输入密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="学院名" prop="departmentName">
        <el-select v-model="formData.departmentName" size="small" placeholder="请选择学院名"
                   @change="handleDepartmentQueryChange" clearable>
          <el-option v-for="type in departmentNames" :key="type" :label="type" :value="type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专业名" prop="majorName">
        <el-select v-model="formData.majorName" size="small" placeholder="请选择专业名"
                   @change="handleMajorChange"
                   clearable>
          <el-option v-for="type in majorNames" :key="type" :label="type" :value="type"></el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="专业名称" prop="majorName">-->
<!--        <el-input v-model="formData.majorName" placeholder="请输入专业名称" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="学院名称" prop="departmentName">-->
<!--        <el-input v-model="formData.departmentName" placeholder="请输入学院名称" clearable></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="入学年份" prop="enrollYear">
        <el-input-number v-model="formData.enrollYear" :min="2000" :max="2099" placeholder="请选择入学年份"></el-input-number>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="formData.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" clearable></el-input>
      </el-form-item>
    </el-form>

    <el-form :model="formData" :rules="rules" ref="registerForm" label-width="100px" v-else>
      <!-- 教师注册表单 -->
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="formData.realName" placeholder="请输入真实姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formData.password" placeholder="请输入密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="formData.gender">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="handleSubmit">注册</el-button>
    <el-dialog
      title="确认退出注册"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>您确定要退出注册吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="$router.push('/login')">确认</el-button>
      </span>
    </el-dialog>
    <el-button type="danger" @click="dialogVisible=true" style="margin-left: 5px">返回登录界面</el-button>
  </div>
</template>

<script>
import {register} from "@/api/user";
import {getAllMajorName} from "@/api/major";
import {getAllDepartmentName,getDepartmentByMajorName} from "@/api/department";
import {getAllCourseNameByMajorName} from "@/api/course";
export default {
  data() {
    return {

      formData: {
        realName: '',
        password: '',
        majorName: '',
        departmentName: '',
        enrollYear: new Date().getFullYear(),
        email: '',
        phone: '',
        gender: '',
        id:"",
        type: 'student', // 默认学生身份
      },
      dialogVisible:false,
      rules: {
        realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
        id: [{ required: true, message: '请输入学号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        majorName: [{ required: true, message: '请输入专业名称', trigger: 'blur' }],
        departmentName: [{ required: true, message: '请输入学院名称', trigger: 'blur' }],
        enrollYear: [{ required: true, message: '请选择入学年份', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
      },
      departmentNames:[],
      majorNames:[],
      courseNames:[],
    };
  },
  created() {
    getAllDepartmentName().then(res => {
      this.departmentNames = res.data
      // this.formData.departmentName = res.data
    })
    getAllMajorName().then(res => {
      this.majorNames = res.data
      this.formData.majorName = ''
    })
    getAllCourseNameByMajorName().then(res=>{
      this.courseNames=res.data
      this.formData.courseName=''
    })
  },
  methods: {
    handleSubmit() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          // 执行注册操作，提交表单数据
          register(this.formData).then(res=>{
          this.$router.push('/login')
          })
          console.log('表单验证通过，提交数据：', this.formData);
          // 在这里可以调用后端接口提交数据
        } else {
          console.log('表单验证不通过');
          return false;
        }
      });
    },
    handleDepartmentQueryChange(selectedValue) {
      getAllMajorName(selectedValue).then(res => {
        this.formData.majorName = ''
        this.majorNames = res.data
      })
    },
    handleMajorChange(selectedValue) {
      console.log(selectedValue);
      getDepartmentByMajorName(selectedValue).then(res=>{
        this.formData.departmentName=res.data

      })

    },
  }
};
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
</style>
