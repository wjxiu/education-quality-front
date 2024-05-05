<template>
<!--  <div style="width:382px;height:auto;overflow-y: auto;overflow-x: hidden;margin:20px;">-->
<!--    <div>-->
<!--      <div class="rank-title">最新30天累计排放量排名</div>-->
<!--      <div v-loading="loading"-->
<!--           element-loading-text="加载中，请稍候..."-->
<!--           element-loading-spinner="el-icon-loading"-->
<!--           element-loading-background="rgba(255, 255, 255, 0.8)">-->
<!--        <div v-show="Cumulative_Rank.length>0" >-->
<!--          <div v-for="(item,index) in Cumulative_Rank"-->
<!--               :key="index"-->
<!--               style="padding-left:10px;">-->
<!--            <el-row style="font-size:14px;color:#606266;">{{index + 1 + "  "+item.name}}</el-row>-->
<!--            <el-row style="">-->
<!--              <el-col :span="20">-->
<!--                <el-progress :percentage="item.percent" :stroke-width="10" color="#50c097"></el-progress>-->
<!--              </el-col>-->
<!--              <el-col :span="4">-->
<!--                <span style="color:#50c097;font-weight:bold;margin-left:-35px;">{{item.value?item.value:''}}</span>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-show="Cumulative_Rank == null || Cumulative_Rank.length == 0" style="width: 382px;height:260px;line-height:260px;text-align:center;color:#909399;">-->
<!--          暂无数据-->
<!--        </div>-->
<!--      </div>-->

<!--    </div>-->
<!--  </div>-->
  <div>
    <el-table>
      <el-table-column label="名字" width="55" align="center" />
      <el-table-column label="平均分" width="55" align="center" />
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 加载
      loading: true, // true:表示正在加载中， false: 表示加载完毕
      // 排名的列表
      Cumulative_Rank: [
        { name: '企业名称1', value: 6600, percent: 100 },
        { name: '企业名称2', value: 5940, percent: 90 },
        { name: '企业名称3', value: 5280, percent: 80 },
        { name: '企业名称4', value: 4620, percent: 70 },
        { name: '企业名称5', value: 3960, percent: 60 },
        { name: '企业名称6', value: 3300, percent: 50 },
        { name: '企业名称7', value: 2640, percent: 40 },
        { name: '企业名称8', value: 1980, percent: 30 },
      ],
    };
  },
  methods: {
    // 模拟正常走接口 体验下加载的过程（不调用axios）
    mockNormal() {
      this.loading = true;
      setTimeout(() => {
        // 这里面是具体的实现逻辑....
        // ....
        // 逻辑处理好，关闭弹框
        this.loading = false;
      }, 1000);
    },
    // 正常走接口的情况
    Function_GetData() {
      this.loading = true; // 调接口前，表示正在加载中...
      this.Cumulative_Rank = []; // 将上一次从接口获取的数据清空掉
      this.$axios({
        method: 'get',
        url: 'http://xxx.xxx.xxx.xxx:xxxx/xxxx/xxxx/xxxx', // 实际跑项目的接口地址
        params: {
        },
      }).then((res) => {
        if (res.data.data != null) {
          const onlineData = res.data.data;
          // 排放量
          if (onlineData.out.ports.length > 0) {
            for (let i = 0; i < onlineData.out.ports.length; i++) {
              this.Cumulative_Rank.push({ name: '--', value: 0, percent: 0 });
              this.Cumulative_Rank[i].portName = onlineData.out.ports[i].portName;
              this.Cumulative_Rank[i].value = onlineData.out.values[i];
              if (i === 0) {
                // 取第一个的值为最大值，表示100%
                this.Cumulative_Rank[i].percent = 100;
              } else {
                // 后面的值都没有第一个大，后面的值除以第一个值 得到 百分比
                this.Cumulative_Rank[i].percent = (onlineData.out.values[i] / onlineData.out.values[0]) * 100;
              }
            }
            this.loading = false; // 接口调成功，数据也处理好了，关掉正在加载
          }
        } else {
          setTimeout(() => {
            this.loading = false; // 接口调成功了，但你没数据啊，意思一下，过了1秒，关掉加载框，不等了
          }, 1000);
        }
      }).catch(() => {
        setTimeout(() => {
          this.loading = false; // 接口报错了！？，那就不等了，算他超时，过了8秒，关掉加载框
        }, 8000);
      });
    },
  },
  mounted() {
    // 模拟正常走接口
    this.mockNormal();
    // 正常走接口的情况
    // this.Function_GetData();
  },
  created() {
  },
};
</script>
<style lang="scss" scoped>
.rank-title{
  font-size: 18px;
  color: #2D8CF0;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}
::v-deep .el-progress__text{
  display:none;
}
::v-deep .el-progress-bar__outer{
  background-color: rgba(235,238,245,0);
}
.progress-txt{
  .progress-title{
    width: 68px;
    display: inline-block;
    position: relative;
  }
  .progress-percen{
    display: inline-block;
    position: relative;
    left: 0px;
  }
}
.progress-custom{
  position: relative;
  // width: 364px;
  width: 100%;
  height: 20px;
  .progress-content{
    position: absolute;
    width: 100%;
    height: 12px;
    background-color: #ebeef5;
    margin: 1px;
    border-radius: 6px;
  }
  .progress-value{
    position: absolute;
    width: 20%;
    height: 12px;
    background-color: #43bef1;
    margin: 1px;
    border-radius: 6px;
    left: 0px; // 经测试，left 最多到70% 就已经最右边了
  }
}
</style>
