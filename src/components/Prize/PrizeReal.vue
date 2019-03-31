<!--实物管理-->
<template>
  <div class="prizeReal">
    <div class="header" style="margin-bottom: 5px;" @keyup.enter="query_prizeReal_list('init')">
      <Input
        v-model="userId"
        class="input"
        clearable
        placeholder="用户ID"
      />
      <Input
        v-model="username"
        class="input"
        clearable
        placeholder="pptv用户名"
      />
      <Input
        v-model="prizeItemId"
        class="input"
        clearable
        placeholder="奖品项ID"
      />
      <Input
        v-model="goodName"
        class="input"
        clearable
        placeholder="实物名称"
      />
      <Button
        type="default"
        class="button-search"
        @click="query_prizeReal_list('init')"
      >查找</Button>
      <Button
        type="primary"
        style="margin-left:5px;float: right"
        @click="exportExcel"
      >导出</Button>
      <Button
        type="primary"
        style="margin-left:5px;float: right"
        @click="updatedMobileNum"
      >同步</Button>
    </div>
    <!--项目列表-->
    <Table
      no-data-text=""
      @on-sort-change="sort"
      :loading="tableLoading"
      border
      height="600"
      :columns="columns"
      :data="rows">
    </Table>
    <!--分页-->
    <Page
      v-if="total"
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
    name: "PrizeCount",
    data() {
      return {
        tableLoading: false,
        total:0,

        page: 1,
        pageSize: 10,

        sortOrder: 'DESC',
        sortName: 'id',

        userId:'',
        username:'',
        prizeItemId:'',
        goodName:'',

        columns: [
          {
            title: '序号',
            key: 'serialNum',
            width: 70,
            fixed:'left'
          },
          {
            title: '实物信息ID',
            key: 'id',
            width:120,
            sortable: true,
            sortMethod:function(a,b,type){
            }
          },
          {
            title: 'pptv用户名',
            key: 'username',
            width:200

          },
          {
            title: '用户ID',
            key: 'userId',
            width:120
          },
          {
            title: '奖品项ID',
            key: 'prizeItemId',
            width:120
          },
          {
            title: '实物名称',
            key: 'goodName',
            width:200
          },
          {
            title: '收件人姓名',
            key: 'addresseeName',
            width:100

          },
          {
            title: '收件人手机号码',
            key: 'addresseeMobileNum',
            width:130
          },
          {
            title: '邮寄地址',
            key: 'address',
            width:300
          },
          {
            title: '一账通手机号码',
            key: 'passportMobileNum',
            width:130
          },
          {
            title: '奖品记录编码',
            key: 'prizeRecordId',
            width:110
          },
          {
            title: '更新时间',
            key: 'updateTime',
            width:150
          }
        ],
        rows: [],
        message:''
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
        this.query_prizeReal_list()
      },
      query_prizeReal_list (flag) {
        const _this = this;
        if(flag) {
          _this.page = 1;
          _this.pageSize = 10;
        }
        _this.tableLoading = true;
        api.post('get_prize_real', null , {
          userId: _this.userId,
          username: _this.username,
          page: _this.page,
          goodName: _this.goodName,
          prizeItemId: _this.prizeItemId,
          pageSize: _this.pageSize,
          sortName: _this.sortName,
          sortOrder: _this.sortOrder
        }).then((res) => {
          _this.tableLoading = false;
          if(res.code === 200) {

            if(res.data){
              const data =res.data;
              _this.total = data.total;
              let rows = data.rows;
              if(rows.length===0) {
                _this.$Message.warning({
                  content: '未查到相关数据',
                  duration: 3
                });
              }
              rows = rows.map((item, index) => {
                item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                item.updateTime=utils.dateFormat(item.updateTime,'YYYY-MM-DD hh:mm:ss');
                return item;
              });
              _this.rows = rows;
            }
          }
        }).catch((err) => {
          _this.$Message.error({
            content: err.message || '数据查询失败',
            duration: 3
          });
          _this.tableLoading = false;
        })

      },
      clearSearch() {
        this.userId = '';
        this.userName ='';
        this.prizeItemId ='';
        this.goodName = '';
      },
      changePage (n) {
        this.page = n;
        this.query_prizeReal_list()
      },
      changePageSize (n) {
        this.pageSize = n;
        if (this.page === 1) {
          this.query_prizeReal_list();
        }
      },
      // 导出
      exportExcel(){
        window.open('/prize/real/export.do','_self');
      },
      /*同步一账通手机号码*/
      updatedMobileNum() {
        const _this = this;
        _this.$Spin.show();
        api.post('updated_prize_real_mobileNum')
            .then(res => {
              if(res.code === 200) {
                _this.$Spin.hide();
                if(res.data) {
                  const data = res.data;
                  _this.$Message.success({
                    content:'失败数：' + data.failNum + ' ' + '成功数：' + data.sunccessNum
                  });
                  _this.query_prizeReal_list();
                }
              }
            }).catch((err) => {
              _this.$Spin.hide();
              _this.$Message.error({
                content: err.message || '数据同步失败',
                duration: 3
              });
        })
      }
    },
    created() {
      this.$store.commit('updatePathName');
    },
    mounted() {
      this.query_prizeReal_list('init')
    }
  }
</script>

<style lang="less" scoped>
  .prizeReal{
    .header{
      margin:5px 0 10px 0px;
      .input{
        width:180px;
      }
      .button{
        margin: 0 5px 5px 0;
        float: right;
      }
    }
    .page {
      text-align: center;
      font-size: 12px;
      margin-top: 10px;
    }
  }
</style>
