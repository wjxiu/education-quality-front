<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="问卷名字" prop="questionnaireName">
        <el-input
          v-model="queryParams.questionnaireName"
          placeholder="请输入问卷名字"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人id" prop="createorId">
        <el-input
          v-model="queryParams.createorId"
          placeholder="请输入创建人id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="createorName">
        <el-input
          v-model="queryParams.createorName"
          placeholder="请输入创建人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否启用" prop="enabled">
        <el-select v-model="queryParams.enabled" placeholder="请选择是否启用" clearable @change="handleQuery">
          <el-option label="未启用" value="0"></el-option>
          <el-option label="已启用" value="1"></el-option>
        </el-select>
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
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="itemMultiple"
          @click="handleQuestionnaireItemDelete(itemIds)"
        >移除问卷选项
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-upload" size="mini" @click.native="handleImport">导入</el-button>
      </el-col>

      <el-col :span="1.5">
          <el-popover
            placement="top-start"
            title="标题"
            width="200"
            trigger="hover">
            <el-button type="warning" size="mini" plain icon="el-icon-download" slot="reference">下载模板</el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click.stop="downloadTemplatenormal">下载问卷-选项模板</el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click.stop="downloadTemplate">下载问卷-选项-课程关联模板</el-button>
          </el-popover>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="questionnaireList" @selection-change="handleSelectionChange"
              @expand-change="handleExpandChange">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="questionEvalMap[props.row.id]" @selection-change="handleQuestionItemSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="id" align="center" prop="id"/>
            <el-table-column label="评价项" align="center" prop="evalItem"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
<!--                禁止修改默认问卷-->
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleQuestionnaireItemDelete(scope.row)"
                >移除选项
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="问卷id" align="center" prop="id"/>
      <el-table-column label="问卷名字" align="center" prop="questionnaireName"/>
      <el-table-column label="创建人id" align="center" prop="createorId"/>
      <el-table-column label="创建人" align="center" prop="createorName"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="150"/>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="150"/>
      <el-table-column label="是否启用" align="center" prop="enabled">
        <template slot-scope="scope">
          <span>{{ getEnabledText(scope.row.enabled) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否自定义" prop="customizeFlag">
        <template slot-scope="scope">
          {{ scope.row.customizeFlag === 1 ? '是' : '否' }}
        </template>
      </el-table-column>
      <!--      <el-table-column label="是否可删除" align="center" prop="delFlag">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ getDelFlagText(scope.row.delFlag) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.questionnaireName === '默认问卷'" content="默认选项禁止修改名字和删除" placement="top">
            <i class="el-icon-info"></i>
          </el-tooltip>
          <el-button
            v-if="scope.row.questionnaireName !== '默认问卷'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <!--        todo  对问卷选项的增删修查-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleItemAdd(scope.row)"
          >关联选项
          </el-button>
          <el-button
            v-if="scope.row.questionnaireName !== '默认问卷'"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>

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

    <!-- 添加或修改问卷对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="问卷名字" prop="questionnaireName">
          <el-input v-model="form.questionnaireName" placeholder="请输入问卷名字"/>
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-select v-model="form.enabled" placeholder="请选择是否启用" clearable @change="handleQuery">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="是否可删除" prop="enabled">-->
        <!--          <el-select v-model="form.delFlag" placeholder="选择是否可删除该问卷" clearable >-->
        <!--            <el-option label="不可删除" :value="0"></el-option>-->
        <!--            <el-option label="可删除" :value="2"></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="关联问卷选项"
      :visible.sync="addItemDialogVisible"
      width="70%"
      @close="unlinkItem = []">
      <!-- 问卷选项列表 -->
      <!--      <el-table :data="questionEvals" @selection-change="handleQuestionItemSelectionChange">
                  <el-table-column type="selection" width="55" align="center"/>
                  <el-table-column label="id" align="center" prop="id"/>
                  <el-table-column label="评价项" align="center" prop="evalItem"/>-->
      <!--      <el-table :data="selectedItem">-->
      <!--        <el-table-column type="selection" width="55" align="center"/>-->
      <!--        <el-table-column label="id" align="center" prop="id"/>-->
      <!--        <el-table-column label="评价项" align="center" prop="evalItem"/>&ndash;&gt;-->
      <!--      </el-table>-->
      <el-checkbox-group v-model="selectedItem" v-if="unlinkItem.length>0">
        <el-checkbox style="display: block;" v-for="item in unlinkItem" :label="item.id" :key="item.id">{{
            item.evalItem
          }}
        </el-checkbox>
      </el-checkbox-group>
      <el-empty v-else>问卷选项已经分配完成</el-empty>
      <!-- 确认和取消按钮 -->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addItemDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="confirmAddItem">确认</el-button>
  </span>
    </el-dialog>
    <el-dialog :visible="uploadVisible" title="批量导入问卷(自动上传)"  :before-close="handleBeforeClose">
      <el-upload
        class="upload-demo"
        action="http://localhost:8081/questionnaire/import"
        :before-upload="beforeUpload"
        :headers="customHeaders"
        :on-success="handleUploadSuccess"
        :file-list="file">
        <el-button size="small" type="primary">点击上传问卷-选项文件</el-button>
      </el-upload>
      <el-upload
        class="upload-demo"
        action="http://localhost:8081/questionnaire/importWithCourse"
        :before-upload="beforeUpload"
        :headers="customHeaders"
        :on-success="handleUploadSuccess"
        :file-list="file">
        <el-button size="small" type="primary">点击上传问卷-选项-课程关联的文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xlsx文件</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import {
  listQuestionnaire,
  getQuestionnaire,
  delQuestionnaire,
  addQuestionnaire,
  updateQuestionnaire,
  deleteQuestionItem
} from "@/api/quesitionnaire";
import {getquestionEval, notlink, updateEval, updateEvalBatch} from "@/api/eval"

export default {
  name: "Questionnaire",
  data() {
    return {
      file:[],
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
      // 问卷表格数据
      questionnaireList: [],
      unlinkItem: [],
      selectedItem: [],
      selectedQuestion: null,

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      selectedItems: [],
      // 控制添加选项对话框的显示与隐藏
      addItemDialogVisible: false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        questionnaireName: null,
        createorName: null,
        createorId: null,
        enabled: null,
      },
      itemIds: [],
      questionEvals: [],
      questionEvalMap: {},
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        questionnaireName: [
          {required: true, message: "问卷名字不能为空", trigger: "blur"}
        ],
        createorId: [
          {required: true, message: "创建人id不能为空", trigger: "blur"}
        ],
      },
      itemSingle: true,
      itemMultiple: true,
      uploadVisible:false,
      customHeaders: {
        Authorization: this.$store.state.user.token,
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleBeforeClose(){
      this.uploadVisible=false
      this.getList();
    },
    // handleBeforeClose
    beforeUpload(file){
      const ismatch=file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      if (!ismatch) {
        this.$message.error('上传文件只能是 XLSX 格式!');
        return false;
      }
    },
    handleUploadError(error, file, fileList) {
      this.$message.error('文件上传失败，请重试！');
      console.error('文件上传失败：', error, file, fileList);
    },
    handleUploadSuccess(response, file, fileList) {
      if (response){
        this.$message.success('文件上传成功');
        this.getList();
      }else{
        this.$message.error('文件上传失败或处理失败');
        this.getList();
      }
    },
    handleImport(){
      this.uploadVisible=true
    },
    downloadTemplatenormal(event){
      // 创建一个隐藏的链接
      const link = document.createElement('a');
      link.href = '/static/问卷-选项导入模板.xlsx';
      link.setAttribute('download', '问卷-选项导入模板.xlsx');
      link.style.display = 'none';
      document.body.appendChild(link);
      // 触发链接点击事件
      link.click();
      // 移除链接
      document.body.removeChild(link);
    },
    downloadTemplate(event){
      // 创建一个隐藏的链接
      const link = document.createElement('a');
      link.href = '/static/问卷-选项-课程导入模板.xlsx';
      link.setAttribute('download', '问卷-选项-课程导入模板.xlsx');
      link.style.display = 'none';
      document.body.appendChild(link);
      // 触发链接点击事件
      link.click();
      // 移除链接
      document.body.removeChild(link);
    },
    handleExpandChange(row, expandedRows) {
      if (expandedRows.includes(row)) {
        getquestionEval(row.id).then(res => {
          this.$set(this.questionEvalMap, row.id, res.data)
          // this.questionEvalMap[row.id]=res.data
          this.questionEvals = res.data
        })
      }
    },
    handleQuestionnaireItemUpdate(row) {
      updateEval()
    },
    handleQuestionnaireItemDelete(row) {
      const ids = row.id || this.itemIds;
      this.$confirm('是否确认移除问卷选项编号为"' + ids + '"的数据项？').then(function () {
        return deleteQuestionItem(ids);
      }).then(() => {
        this.getList();
        this.$message.success("删除成功");
      }).catch(() => {
      });
      this.itemIds=[]
      // fixme 这里不生效
      this.itemMultiple=false
    },
    handleItemAdd(row) {
      // 这里可以根据需要进行初始化操作
      // 清空之前的选中状态
      this.selectedQuestion = row;
      notlink(row.id).then((res) => {
        this.unlinkItem = res.data
      })
      // 显示对话框
      this.addItemDialogVisible = true;
    },
    // 确认添加选项
    confirmAddItem() {
      console.log(this.selectedItem);
      if (this.selectedItem.length === 1) {
        updateEval({questionnaireId: this.selectedQuestion.id, id: this.selectedItem[0]}).then(res => {
          this.addItemDialogVisible = false;
          this.unlinkItem = [];
          notlink(this.selectedQuestion.id).then((res) => {
            this.unlinkItem = res.data
          })
          this.getList();
        })
      } else {
        const updateArray = []
        this.selectedItem.forEach(itemId => {
          updateArray.push({questionnaireId: this.selectedQuestion.id, id: itemId});
        });
        updateEvalBatch(updateArray).then(res => {
          this.addItemDialogVisible = false;
          this.unlinkItem = [];
          notlink(this.selectedQuestion.id).then((res) => {
            this.unlinkItem = res.data
          })
          this.getList();
          this.selectedItem = []
        })

      }
    },
    getEnabledText(value) {
      switch (value) {
        case 0:
          return '未启用';
        case 1:
          return '已启用';
        default:
          return '未知状态';
      }
    },
    /** 查询问卷列表 */
    getList() {
      this.loading = true;
      listQuestionnaire(this.queryParams).then(response => {
        this.questionnaireList = response.data.list;
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
        questionnaireName: null,
        createorId: null,
        enabled: null,
        updateTime: null,
        delFlag: null
      };
      this.resetForm();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetqueryForm();
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // questionnaireList
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleQuestionItemSelectionChange(selection) {
      this.itemIds = selection.map(item => item.id)
      this.itemSingle = selection.length !== 1
      this.itemMultiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加问卷";
    },
    resetForm() {
      this.form = {}
    },
    resetqueryForm() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        questionnaireName: null,
        createorName: null,
        createorId: null,
        enabled: null,
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getQuestionnaire(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改问卷";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.createTime = ''
            updateQuestionnaire(this.form).then(response => {
              this.$message.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addQuestionnaire(this.form).then(response => {
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
      this.$confirm('是否确认删除问卷编号为"' + ids + '"的数据项？').then(function () {
        return delQuestionnaire(ids);
      }).then(() => {
        this.getList();
        this.$message.success("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const a = document.createElement('a')
      a.href = 'http://localhost:8081/questionnaire/export'
      a.download = '文件名'
      a.style.display = 'none'
      a.target = 'downloadFile'
      document.body.appendChild(a) // 兼容火狐
      a.click()
      document.body.removeChild(a) // 移除a标签
    }
  }
};
</script>
<style>
.upload-container {
  display: flex;
  justify-content: space-between; /* 水平间隔平均分布 */
}

.upload-item {
  flex: 1; /* 均分父容器的宽度 */
  margin-right: 20px; /* 可根据需要调整两个上传组件之间的间距 */
}
</style>
