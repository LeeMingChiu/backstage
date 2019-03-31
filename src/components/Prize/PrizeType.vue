<!--奖品类型-->
<template>
  <div class="prizeType">
    <div class="header" style="margin-bottom: 5px;" @keyup.enter="query_prize_list('init')">
      <Input
        v-model="id"
        clearable
        placeholder="奖品类型编码"
        style="width: 200px; margin: 0 5px 5px 0"
      />
      <Input
        v-model="name"
        clearable placeholder="奖品类型名称"
        style="width: 200px; margin: 0 5px 5px 0"
      />
      <Button
        type="default"
        @click="query_prize_list"
        style="margin: 0 5px 5px 0"
      >查找</Button>
    </div>

    <!--项目列表-->
    <Table
      no-data-text=""
      @on-sort-change="sort"
      :loading="tableLoading"
      border
      height="600"
      :columns="columns"
      :data="rows"
    ></Table>

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
  export default {
    name: "PrizeType",
    data () {
      return {
        tableLoading: false,
        total: 0,

        page: 1,
        pageSize: 10,

        id:'',
        name:'',
        sortOrder: 'ASC',
        sortName: 'id',

        columns: [
          {
            title: '序号',
            key: 'serialNum',
            width:100,
            fixed:'left',
          },
          {
            title: '奖品类型编码',
            key: 'id',
            sortable:true,
            width:130,
            sortMethod:function(a,b,type){
            },
          },
          {
            title: '奖品类型名称',
            key: 'name',
            width:200,
          },
          {
            title: '英文名称',
            key: 'englishName',
            width:200
          },
          {
            title: '描述',
            key: 'memo',
            width:300
          },
          {
            title: '奖品扩展项',
            key: 'prizeItemExt',
            width:300
          },
          {
            title: '奖品纪录',
            key: 'prizeRecordExt',
            width:300
          }
        ],
        rows: []
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
        this.query_prize_list()
      },
      query_prize_list(flag) {
        const _this = this;
        if(flag){
          _this.page = 1;
          _this.pageSize =10;
        }
        _this.tableLoading = true;
        api.post('get_prize_pool', null, {
          page: _this.page,
          pageSize: _this.pageSize,
          id:_this.id,
          name:_this.name,
          sortName:_this.sortName,
          sortOrder:_this.sortOrder,
        }).then(res => {
          if(res.code === 200) {
            _this.tableLoading = false;
            _this.message = res.message;
            let data = res.data;

            _this.total = data.total;
            let rows = data.rows;
            if(rows.length===0){
              _this.$Message.warning({
                content: '未查到相关数据',
                duration: 3
              });
            }
            rows = rows.map((item, index) => {
              item.serialNum = _this.pageSize * (_this.page - 1)+ index + 1;
              return item;
            });
            _this.rows = rows;

          }
        }).catch(err => {
          _this.$Message.error({
            content: err.message || '数据查询失败',
            duration: 3
          });
          _this.tableLoading = false;
        })
      },
      changePage(n) {
        this.page = n;
        this.query_prize_list();
      },
      changePageSize(n) {
        this.pageSize = n;
        if (this.page === 1) {
          this.query_prize_list();
        }
      }
    },
    /*created() {
     this.$store.commit('updatePathName');
    },*/
    mounted() {
      const _this = this;
      _this.query_prize_list('init');
    }
  }
</script>

<style lang="less" scoped>
  .prizeType{

  }
</style>
