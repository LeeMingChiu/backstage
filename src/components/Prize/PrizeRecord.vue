<!--领奖记录管理-->
<template>
  <div class="prizeRecord">
    <div class="header" style="margin-bottom: 5px;" @keyup.enter="query_prizeRecord_list(init)">
      <Input
        v-model="userId"
        clearable
        placeholder="用户ID"
        style="width: 80px; margin: 0 5px 5px 0"/>
      <Input
        v-model="username"
        clearable
        placeholder="PPTV用户名"
        style="width:100px; margin: 0 5px 5px 0"/>
      <Input
        v-model="taskId"
        clearable
        placeholder="任务ID"
        style="width:100px; margin: 0 5px 5px 0"/>
      <Input
        v-model="name"
        clearable
        placeholder="奖品名称"
        style="width:100px; margin: 0 5px 5px 0"/>
      <Select
        v-model="state"
        clearable
        style="width: 100px; margin: 0 5px 5px 0"
        placeholder="奖品状态">
        <Option
          v-for="item in prizeStatus"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}</Option>
      </Select>
      <Select
        v-model="invokeState"
        clearable
        style="width:120px; margin: 0 5px 5px 0"
        placeholder="接口调用状态">
        <Option
          v-for="item in apiStatus"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}</Option>
      </Select>
      <DatePicker
        v-model="beginTime"
        type="datetime"
        placeholder="开始时间"
        clearable
        style="width:195px; margin: 0 5px 5px 0; vertical-align: top;"
      ></DatePicker>
      <DatePicker
        v-model="endTime"
        type="datetime"
        placeholder="结束时间"
        clearable
        style="width:195px; margin: 0 5px 5px 0; vertical-align: top;"
      ></DatePicker>
      <Button
        type="default"
        @click="query_prizeRecord_list(init)"
        style="margin: 0 5px 5px 0"
      >查找</Button>
    </div>
    <!--项目列表-->
    <Table
      no-data-text=""
      @on-sort-change="sort"
      class="table"
      :loading="tableLoading"
      border
      height="600"
      :columns="columns"
      :data="rows"></Table>

    <!--分页-->
    <Page
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
    />
  </div>
</template>

<script>
  import api from '../../libs/API'
  import utils from '../../libs/utils'
  export default {
    name: "PrizeRecord",
    data () {
      return {
        tableLoading: false,

        total:0,

        init: true,

        // 页面初始化时不校验username
        // 单击查询时校验非空
        usernameNeed:false,

        page: 1,
        pageSize: 10,

        sortOrder: 'DESC',
        sortName: 'id',//  true 排序字段名

        userId: '',
        username: '',
        name:'',
        taskId: '',
        state: '',
        beginTime:'',
        endTime:'',

        columns: [
          {
            title: '序号',
            key: 'serialNum',
            width: 100,
            fixed:'left'
          },
          {
            title: '奖品记录编码',
            key: 'id',
            width: 120,
          },
          {
            title: 'pptv用户名',
            key: 'username',
            width:200
          },
          {
            title: '任务ID',
            key: 'taskId',
            width:120
          },
          {
            title: '奖品名称',
            key: 'name',
            width:120
          },
          {
            title: '奖品池描述',
            key: 'memo',
            width:200
          },
          {
            title: '用户ID',
            key: 'userId',
            width:120
          },
          {
            title: '领奖时间',
            key: 'awardTime',
            width:200
          },
          {
            title: '奖品状态',
            key: 'state',
            width:120
          },
          {
            title: '接口调用状态',
            key: 'invokeState',
            width:120
          },
          {
            title: '商品属性扩展',
            key: 'ext',
            width:200
          }
        ],
        prizeStatus: [
          {
            label:'未领奖',
            value: 0
          },
          {
            label:'已领奖',
            value: 1
          }
        ],
        apiStatus:[
          {
            label:'初始状态',
            value: 0
          },
          {
            label:'未调用',
            value: 1
          },
          {
            label:'调用中（MQ）',
            value: 2
          },
          {
            label:'调用成功',
            value: 3
          },
          {
            label:'调用失败',
            value: 4
          }
        ],
        invokeState:'',
        rows: []
      }
    },
    computed:{
      timeFormat(){
        if(this.time) {
          this.time.push(utils.dateFormat(this.time[0],'YYYY-MM-DD hh:mm:ss'));
          this.time.push(utils.dateFormat(this.time[1],'YYYY-MM-DD hh:mm:ss'));
          return this.time;
        }
      }
    },
    methods: {
      sort(col) {
        this.page = 1;
        this.pageSize = 10;
        if (col.order.toUpperCase() === 'NORMAL') {
          this.sortOrder = 'DESC';
          this.sortName = 'id';
        } else {
          this.sortOrder = col.order.toUpperCase();
          this.sortName = col.key.replace('Format', '');
        }
        this.query_coupon_pool_list();
      },
      query_prizeRecord_list (flag) {
        const _this = this;
        if(flag) {
          _this.page = 1;
          _this.pageSize = 10;
        }
        let params = {
          userId: _this.userId,
          username: _this.username,
          taskId: _this.taskId,
          state: _this.state,
          name: _this.name,
          invokeState: _this.invokeState,
          page:_this.page,
          pageSize:_this.pageSize,
          sortName:_this.sortName,
          sortOrder:_this.sortOrder,
          beginTime: utils.dateFormat(_this.beginTime,'YYYY-MM-DD hh:mm:ss'),
          endTime: utils.dateFormat(_this.endTime,'YYYY-MM-DD hh:mm:ss'),
        };
        if(!params.username){
          return _this.$Message.warning({
            content: 'pptv用户名查询条件不能为空',
            duration: 3
          })
        }
        _this.tableLoading = true;

        api.post('get_prize_record', null ,params).then((res) => {
          _this.tableLoading = false;
          if(res.code === 200) {
            if(res.data){
              const data =res.data;
              _this.total = data.total;
              let rows = data.rows;
              if(rows.length===0){
                _this.$Message.warning({
                  content: '未查到相关数据',
                  duration: 3
                });
              }
              if(rows){
                rows = rows.map((item, index) => {
                  item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                  item.awardTime= utils.dateFormat(item.awardTime,'YYYY-MM-DD hh:mm:ss');
                  item.state = item.state === 0 ? '未领奖': '已领奖';
                  item.invokeState = item.invokeState == 0 ? '初始状态':
                                     item.invokeState == 1 ? '未调用':
                                     item.invokeState == 2 ? '调用中（MQ）':
                                     item.invokeState == 3 ? '调用成功':
                                                             '调用失败';
                  return item;
                });
                _this.rows = rows;
              }
            }
          }
        }).catch((err) => {
          //console.error(err);
          _this.$Message.error({
            content: err.message || '数据查询失败',
            duration: 3
          });
          _this.tableLoading = false;
        })

      },
      changePage(n) {
        this.page = n;
        this.query_prizeRecord_list();
      },
      changePageSize(n) {
        this.pageSize = n;
        if (this.page === 1) {
          this.query_prizeRecord_list();
        }
      }
    },
    created() {
      this.$store.commit('updatePathName');
    },
    mounted(){
      //this.query_prizeRecord_list('init');
    }
  }
</script>

<style lang="less" scoped>
  .prizeCord{
    .header{
      .button{
        margin: 0 5px 5px 0;
        float: right;
      }
    }
  }
</style>
