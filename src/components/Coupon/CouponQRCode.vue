<!--二维码优惠券-->
<template>
  <div class="couponQRCode" >
    <div style="margin-top: 5px" @keyup.enter="query_string_coupon('init')">
      <Input
        v-model="name"
        clearable
        placeholder="名称"
        style="width: 200px; margin: 0 5px 5px 0"
      />
      <Input
        v-model="excelName"
        clearable placeholder="Excel名称"
        style="width: 200px; margin: 0 5px 5px 0"
      />
      <Input
        v-model="username"
        clearable placeholder="领奖人"
        style="width: 200px; margin: 0 5px 5px 0"
      />
      <Input
        v-model="couponPoolId"
        clearable placeholder="券池ID"
        style="width: 200px; margin: 0 5px 5px 0"
      />
      <Select
        v-model="status"
        clearable
        placeholder="发放状态"
        style="width: 110px; margin: 0 5px 5px 0">
        <Option
          v-for="item in statusList"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}</Option>
      </Select>
      <Button
        type="default"
        @click="query_string_coupon('init')"
        style="margin: 0 5px 5px 0"
      >查找</Button>
     <!-- <Button
        type="default"
        @click="download"
        style="margin: 0 5px 5px 0;float:right"
      >导出</Button>-->
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
    <Modal :mask-closable="false" v-model="deleteShow" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除提示</span>
      </p>
      <div style="text-align:center">
        <p>确定删除数据吗?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="ok(params)">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import api from '../../libs/API'
  export default {
    name: "CouponQRCode",
    data() {
      return {
        deleteShow: false,

        tableLoading: false,
        page:1,
        pageSize:10,
        total: null,
        sortOrder: 'DESC',
        sortName: 'id',//  true 排序字段名

        id:'',
        name:'',
        excelName:'',
        username:'',
        couponPoolId:'',
        status:'',

        params:null,

        rows:[],

        message:'',

        statusList:[
          {
            label:'未发放',
            value:0
          },
          {
            label:'已发放',
            value:1
          },
        ],
        columns: [
          {
            title: '序号',
            key: 'serialNum',
            fixed: 'left',
            width:70
          },
          {
            title: '二维码编码',
            key: 'id',
            width:120,
            sortable: true
          },
          {
            title: '二维码名称',
            key: 'name',
            width:200
          },
          {
            title: '二维码地址',
            key: 'qrcodeUrl',
            width:200
          },
          {
            title: '描述',
            key: 'memo',
            width:300
          },
          {
            title: '领奖人',
            key: 'username',
            width:120
          },
          {
            title: '券池编码',
            key: 'couponPoolId',
            width:120
          },
          {
            title: '券池名称',
            key: 'couponPoolName',
            width:200
          },
          {
            title: '发放状态',
            key: 'status',
            width:90
          },
          {
            title:'Excel名称',
            key:'excelName',
            width:220
          },
          {
            title: '更多操作',
            key: 'action',
            width: 200,
            fixed:'right',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteShow = true;
                      this.params = {id:params.row.id};
                    }
                  }
                }, '删除单条'),
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style:{
                    marginLeft: '5px'
                  },
                  on: {
                    click: () => {
                      this.deleteShow = true;
                      this.params = {excelName:params.row.excelName};
                    }
                  }
                }, '删除所有')
              ]);
            }
          }
        ]
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
      download(){
        window.open('/coupon/pool/download.do?fileType=2','_self')
      },
      ok (params) {
        this.deleteCouponCard(params);
      },
      cancel () {
        this.deleteShow = false;
      },
      query_string_coupon (flag) {
        const _this = this;
        if(flag) {
          _this.page = 1;
          _this.pageSize = 10;
        }
        _this.tableLoading = true;
        api.post('coupon_qrcode_list', null , {
          name:_this.name,
          excelName:_this.excelName,
          username:_this.username,
          couponPoolId:_this.couponPoolId,
          status:_this.status,
          page:_this.page,
          pageSize:_this.pageSize,
          sortName:_this.sortName,
          sortOrder:_this.sortOrder,
        }).then((res) => {
          if(res.code === 200) {
            _this.tableLoading = false;
            let data = res.data;
            _this.total = data.total;
            let rows = data.rows;
            if(rows.length===0){
              if(rows.length === 0){
                _this.$Message.warning({
                  content: '未查到相关数据',
                  duration: 3
                });
              }
            }
            rows = rows.map((item, index) => {
              item.serialNum = _this.pageSize * (_this.page - 1)+ index + 1;
              item.status = item.status ===0 ? '未发放' : '已发放';
              return item;
            });
            _this.rows = rows;
          }
        }).catch((err) => {
          _this.tableLoading = false;
          _this.$Message.error({
            content: err.message || '查询数据失败',
            duration: 3
          });
        })

      },
      changePage (n) {
        this.page = n;
        this.query_string_coupon()
      },
      changePageSize (n) {
        this.pageSize = n;
        if (this.page == 1) {
          this.query_string_coupon()
        }
      },
      deleteCouponCard(params){
        const _this = this;
        _this.$Spin.show();
        api.post('delete_qrcode_coupon',null,params)
            .then((res) => {
              if(res.code === 200) {
                _this.$Spin.hide();
                _this.deleteShow = false;
                _this.$Message.success({
                  content: '数据删除成功',
                  duration: 3
                });
                _this.query_string_coupon();
              }
            }).catch((err) => {
              _this.$Spin.hide();
              _this.deleteShow = false;
              _this.$Message.success({
                content: err.message || '数据删除失败',
                duration: 3
          });
        })
      }
    },
    created() {
      this.$store.commit('updatePathName');
    },
    mounted(){
      this.query_string_coupon('init');
    }
  }
</script>

<style scoped>

</style>
