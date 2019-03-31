<!--领奖记录数据统计-->
<template>
  <div class="prizeCount" style="margin-bottom: 5px;">
    <div class="header" @keyup.enter="query_prizeCount_list('init')">
      <Input
        v-model="taskId"
        style="width:100px;margin: 0 5px 5px 0"
        clearable
        placeholder="任务ID"
      />
      <Input
        v-model="userId"
        style="width:100px;margin: 0 5px 5px 0"
        clearable
        placeholder="用户ID"
      />
      <Input
        v-model="username"
        style="width:160px;margin: 0 5px 5px 0"
        clearable
        placeholder="pptv用户名"
      />
      <Input
        v-model="prizeItemId"
        style="width:120px;margin: 0 5px 5px 0"
        clearable
        placeholder="奖品项ID"
      />
      <Input
        v-model="name"
        style="width:200px;margin: 0 5px 5px 0"
        clearable
        placeholder="奖品名称"
      />
      <Select v-model="state" style="width:100px;margin-top:-5px;" placeholder="领奖状态" clearable>
        <Option v-for="item in stateList" :value="item.value" :key="item.value">{{item.label}}</Option>
      </Select>
      <DatePicker
        v-model="awardTimeBegin"
        type="datetime"
        placeholder="开始时间"
        clearable
        style="width:160px; margin: 0 5px 5px 5px; vertical-align: top;"
      ></DatePicker>
      <DatePicker
        v-model="awardTimeEnd"
        type="datetime"
        placeholder="结束时间"
        clearable
        style="width:160px; margin: 0 5px 5px 0; vertical-align: top;"
      ></DatePicker>
      <Button
        type="default"
        style="margin: 0px 5px 5px 0px;vertical-align: top;"
        class="button-search"
        @click="query_prizeCount_list('init')">查找</Button>


      <!--<Button
        type="default"
        @click="exportRealData"
        >导出</Button>
      <Button
        @click="updatedMobileNum"
        type="default"
        >同步</Button>-->
    </div>
      <!--项目列表-->
      <Table
        no-data-text=""
        class="table"
        :loading="tableLoading"
        border
        :data="rows"
        height="600"
        :columns="columns">
      </Table>
      <!--分页-->
      <!--<Page
        v-if="total"
        class="page"
        :total="total"
        :current="page"
        :page-size="pageSize"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        show-sizer
        show-total
        show-elevator
        style="text-align: center; font-size: 12px; margin-top: 10px;"
      />-->
    </div>
</template>

<script>
  import api from '../../libs/API'
  import utils from "../../libs/utils"
  export default {
    name: "PrizeCount",
    data() {
      return {
        tableLoading: false,

        total: 0,
        page:1,
        pageSize:10,
        sortOrder: 'DESC',
        sortName: 'id',//  true 排序字段名

        userId:'',
        taskId:'',
        username:'',
        prizePoolId:'',
        prizeItemId:'',
        name:'',
        state:'',
        awardTimeEnd:'',
        awardTimeBegin:'',

        stateList:[
          {
            label: '全部',
            value: 999
          },
          {
            label: '已领奖',
            value: 1
          },
          {
            label: '未领奖',
            value: 0
          }
        ],

        columns: [
          {
            title: '序号',
            key: 'serialNum',
            width: 100
          },
          {
            title: '类别',
            key: 'type'
          },
          {
            title: '数值',
            key: 'num'
          }
        ],
        rows:[]
      }
    },
    methods: {
      query_prizeCount_list (flag) {
        const _this = this;
        if(flag){
          _this.page = 1;
          _this.pageSize =10;
        }
        _this.tableLoading = true;
        api.post('get_prize_count', null , {
          userId:_this.userId,
          taskId:_this.taskId,
          prizeItemId:_this.prizeItemId,
          awardTimeBegin:new Date(_this.awardTimeBegin).getTime(),
          awardTimeEnd:new Date(_this. awardTimeEnd).getTime(),
          name:_this.name,
          username:_this.username,
          state:_this.state === 999 ? '' : _this.state,
          page:_this.page,
          pageSize: _this.pageSize,
          sortName: _this.sortName,
          sortOrder: _this.sortOrder
        }).then((res) => {
          if(res.code === 200) {
            _this.tableLoading = false;
            if(res.data){
              let index = 1;
              res.data.rows = [];
              for (let key in res.data) {
                if (res.data.hasOwnProperty(key)) {
                  if ((key.indexOf('shard') !== -1) || (key.indexOf('total') !== -1)) {
                    res.data.rows.push({
                      type: key,
                      num: res.data[key],
                      serialNum: index++
                    })
                  }
                }
              }
              _this.rows = res.data.rows;
            }
          }
        }).catch((err) => {
          _this.$Message.error({
            content: _this.message || '数据查询失败',
            duration: 3
          });
          _this.tableLoading = false;
        })
      },
      clearSearch() {
        this.userId = '';
        this.username = '';
        this.taskId = '';
        this.prizePoolId = '';
        this.prizeItemId = '';
        this.time = '';
        this.name = '';
      },
      changePage (n) {
        this.page = n;
        this.query_prizeCount_list()
      },
      changePageSize (n) {
        this.pageSize = n;
        if (this.page == 1) {
          this.query_prizeCount_list()
        }
      },
      exportRealData(){
        api.post('/prize/real/export.do')
            .then(res => {
              this.message = res.message;
              if(res.code === '200') {
              }
            }).catch(err => {
              this.$Message.error({
                content: this.message || '数据导出失败',
                duration: 3
              });
        })
      },
      /*同步一账通手机号码*/
      updatedMobileNum() {
        const _this = this;
        api.post('/prize/real/passportMobileNum.do')
            .then(res => {
              if(res.code === '200') {
                _this.tableLoading = false;
                if(res.data) {
                  const data = res.data;
                  _this.query_prizeReal_list();
                }
              }
            }).catch((err) => {
              _this.$Message({
                content: err.message || '同步失败'
              })
            })
      }
    },
    created() {
      this.$store.commit('updatePathName');
    },
    mounted() {
      this.query_prizeCount_list('init')
    }
  }
</script>

<style lang="less" scoped>
  .prizeCount{
    .header{
      margin: 5px 0px;
      .button{
        margin: 0 5px 5px 0;
        float: right;
      }
    }
  }
</style>
