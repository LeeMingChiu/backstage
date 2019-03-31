<!--券池管理-->
<template>
  <div class="couponPool">
    <div style="margin-top: 5px" @keyup.enter="query_coupon_pool_list('init')">
      <Select v-model="prizeType" placeholder="券池类型" style="width:150px;margin: 0 5px 5px 0" clearable>
        <Option v-for="item in prizeTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Input
        v-model="id"
        clearable
        placeholder="券池ID"
        style="width: 200px; margin: 0 5px 5px 0"
      />
      <Input
        v-model="name"
        clearable placeholder="券池名称"
        style="width: 200px; margin: 0 5px 5px 0"
      />
      <Button
        @click="query_coupon_pool_list('init')"
        style="margin: 0 5px 5px 0"
      >查找</Button>
      <Button
        type="primary"
        style="float: right;margin-left:5px;margin-top:-5px;"
        @click="openModal('create')"
      >新增</Button>
      <Button
        type="primary"
        style="float: right;:5px;margin-top:-5px;"
        @click="handleDownLoad(1)"
      >卡密优惠券模板</Button>
      <Button
        type="primary"
        style="float: right;margin-left:5px;margin-top:-5px;margin-right:5px;"
        @click="handleDownLoad(2)"
      >二维码优惠券模板</Button>
      <!--<Button
        type="primary"
        style="margin-top:-5px;float: right"
        @click="clearSearch"
      >重置</Button>-->
    </div>

    <!--项目列表-->
    <Table
      no-data-text=""
      @on-sort-change="sort"
      :loading="tableLoading"
      border
      height="600"
      :columns="columns"
      :data="rows"></Table>

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

    <!--更新、创建modal-->
    <Modal :mask-closable="false" title="券池信息" v-model="showModal">
      <Row style="margin-bottom: 20px">
          <Col span="4" :style="{'padding-top':'8px'}"><span style="display: inline;color:red;">*</span>券池类型：</Col>
          <Col span="16">
            <Select :disabled="typeDisabled" v-model="createdPoolInfo.prizeType" placeholder="券池类型">
              <Option v-for="(item,index) in prizeTypeList" :value="item.value" :key="item.value" v-if="index">{{ item.label }}</Option>
            </Select>
          </Col>
      </Row>
      <Row style="margin-bottom: 20px">
        <Col span="4" :style="{'padding-top':'8px'}"><span style="display: inline;color:red;">*</span>券池名称：</Col>
        <Col span="16">
          <Input
            v-model="createdPoolInfo.name"
            clearable
            placeholder="不超过12个汉字"/>
        </Col>
      </Row>
      <Row style="margin-bottom: 20px">
        <Col span="4" :style="{'padding-top':'8px'}">券池描述：</Col>
        <Col span="16">
          <Input
            v-model="createdPoolInfo.memo"
            clearable
            :maxlength="128"
            placeholder="不超过128个汉字"/>
        </Col>
      </Row>
      <Row style="margin-bottom: 20px">
        <Col span="4" :style="{'padding-top':'8px'}">提供方：</Col>
        <Col span="16">
          <Input
            v-model="createdPoolInfo.provider"
            clearable
            placeholder="不超过50个汉字"/>
        </Col>
      </Row>
      <Row style="margin-bottom: 20px" :gutter="12" v-show="createdPoolInfo.prizeType != 11">
        <Col span="4" :style="{'padding-top':'8px'}" offset="1">面额：</Col>
        <Col span="8" pull="1">
          <Input
            style="width:120px;"
            v-model="createdPoolInfo.number"
            clearable
            placeholder="支持小数后两位"/>
        </Col>
        <Col span="4" :style="{'padding-top':'8px'}" pull="1">单位：</Col>
        <Col span="5" pull="3">
          <Input
            style="width:115px;"
            v-model="createdPoolInfo.type"
            clearable
            placeholder="面额单位，如元"/>
        </Col>
      </Row>
      <Row style="margin-bottom: 20px" v-show="createdPoolInfo.prizeType == 6 || createdPoolInfo.prizeType == 11">
        <Col span="4" :style="{'padding-top':'8px'}"><span style="display: inline;color:red;">*</span>活动编码：</Col>
        <Col span="16">
          <Input
            v-model="createdPoolInfo.activityId"
            clearable
            placeholder="活动编码"/>
        </Col>
      </Row>
      <Row style="margin-bottom: 20px" v-show="createdPoolInfo.prizeType == 6">
        <Col span="4" :style="{'padding-top':'8px'}"><span style="display: inline;color:red;">*</span>活动秘钥：</Col>
        <Col span="16">
          <Input
            v-model="createdPoolInfo.activitySecretKey"
            clearable
            placeholder="活动秘钥"/>
        </Col>
      </Row>
      <Row style="margin-bottom: 20px" v-show="createdPoolInfo.prizeType != 5 && createdPoolInfo.prizeType != 7">
        <Col span="4" :style="{'padding-top':'8px'}">库存数量：</Col>
        <Col span="16">
          <Input
            v-model="createdPoolInfo.quantity"
            clearable
            placeholder="库存数量"/>
        </Col>
      </Row>
      <Row style="margin-bottom: 20px" v-show="createdPoolInfo.prizeType != 11">
        <Col span="3" :style="'text-align:right;padding-top:8px'"><span style="display: inline;color:red;">*</span>有效期：</Col>
        <Col span="20" offset="1">
          <DatePicker
            :value="time"
            format="yyyy-MM-dd"
            v-model="time"
            type="daterange"
            placeholder="开始时间 - 结束时间"
            clearable
            style="width:200px; margin: 0 5px 5px 0; vertical-align: top;"
          ></DatePicker>
        </Col>
      </Row>
      <div slot="footer" style="text-align: center">
        <Button type="error" @click="handleCancle">取消</Button>
        <Button type="success"  @click="handleCouponPool('creat')" v-if="!typeDisabled">确定</Button>
        <Button type="success"  @click="handleCouponPool('update')" v-else>确定</Button>
      </div>
    </Modal>
    <!--导入Modal-->
    <Modal :mask-closable="false" v-model="showImportModal" title="文件上传" :footer-hide="true">
      <Upload
        :multiple="false"
        ref="excelFile"
        :max-size="2048"
        :before-upload="handleUpload"
        type="drag"
        :action="action">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>点击选择文件或者拖拽文件到此处</p>
        </div>
      </Upload>
      <div v-show="fileList" style="margin:20px 0">
        <div v-for="(item,index) in fileList" style="overflow: hidden;margin-bottom:20px;">
          <span style="float: left">文件名称: {{item.name}}</span>
          <Button style="float:right;width:20px; height:20px;" type="error"  size="small" shape="circle" icon="md-close" @click="deleteFile(index)"></Button>
        </div>
      </div>
      <div style="text-align: center;margin-top:20px;">
        <Button type="error" @click="cancel">取消</Button>
        <Button type="success"  @click="upload" :loading="loadingStatus">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import api from '../../libs/API'
  import utils from "../../libs/utils";
  export default {
    name: "CouponPool",
    data() {
      return {
        typeDisabled: false,

        tableLoading: false,

        total: 0,
        page:1,
        pageSize:10,

        sortOrder: 'DESC',
        sortName: 'id',

        backPrizeType:[],

        id:'',
        name:'',

        handleType: 'create',

        mask:true,
        prizeType:'',

        singlePoolData:[],

        time:'',

        showModal:false,
        showImportModal: false,

        loadingStatus:false,
        file:null,
        fileList:[],

        action:'',

        upLoadFile:{},

        quantity:'',

        uploadData:{},

        title:[],

        timeVal:[],

        showProgress:false,

        percentage:0,

        message:'',

        apiUrl:'',

        // 创建更新券池 params
        createdPoolInfo:{
          id:'',
          name:'',
          activityId:'',
          activitySecretKey:'',
          memo:'',
          prizeType:6,
          provider:'',
          quantity:'',
          number:'',
          type:'',
          startTime:'',
          endTime:'',
        },
        prizeTypeList:[
          {
            label:'全部',
            value:999
          },
          {
            label:'卡密优惠券',
            value:5
          },
          {
            label:'易购优惠券',
            value:6
          },
          {
            label:'二维码优惠券',
            value:7
          },
          {
            label:'购物津贴',
            value:11
          },
        ],
        totalNum:'',
        successNum:'',
        count:'',
        columns: [
          {
            title: '序号',
            key: 'serialNum',
            fixed: 'left',
            width:100,
          },
          {
            title: '券池ID',
            key: 'id',
            width:100,
            sortable: true,
          },
          {
            title: '名称',
            key: 'name',
            width:240
          },
          {
            title: '描述',
            key: 'memo',
            width:300
          },
          {
            title: '提供方',
            key: 'provider',
            width:240
          },
          {
            title: '券池类型',
            key: 'prizeType',
            width:120
          },
          {
            title: '库存数量',
            key: 'quantity',
            width: 130,
            sortable: true
          },
          {
            title: '面额',
            key: 'number',
            width:70,

          },
          {
            title: '单位',
            key: 'type',
            width:70
          },
          {
            title: '开始时间',
            key: 'startTime',
            width:110,
            sortable: true,
          },
          {
            title: '结束时间',
            key: 'endTime',
            width:110,
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            width: 220,
            fixed:'right',
            align: 'left',
            render: (h, params) => { // params:{row:'当前单元格数据',column:'当前列数据',index:'当前是第几行'}
              return h('div',[
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.openModal('update');
                      let updateData = JSON.stringify(params.row);
                      this.createdPoolInfo = JSON.parse(updateData);
                      if(params.row.prizeType === '卡密优惠券') {
                        this.createdPoolInfo.prizeType = 5;
                      }
                      if(params.row.prizeType === '易购优惠券') {
                        this.createdPoolInfo.prizeType = 6;
                      }
                      if(params.row.prizeType === '二维码优惠券') {
                        this.createdPoolInfo.prizeType = 7;
                      }
                      if(params.row.prizeType === '购物津贴') {
                        if(params.row.number === '--'){
                          this.createdPoolInfo.number = ''
                        }
                        if(params.row.type === '--'){
                          this.createdPoolInfo.type = ''
                        }
                        if(params.row.beginTime === '--'){
                          this.createdPoolInfo.beginTime = new Date().getTime()
                        }
                        if(params.row.endTime === '--'){
                          this.createdPoolInfo.endTime = new Date().getTime()
                        }
                        this.createdPoolInfo.prizeType = 11;
                      }
                      this.quantity = params.row.quantity;
                      this.getTime(params.row.endTime);
                      //this.prizeTypeFormat(params.row.prizeType);
                      this.getParams({id:params.row.id, type:params.row.prizeType});
                      this.time = [params.row.startTime, params.row.endTime];
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginLeft: '5px'
                  },
                  on: {
                    click: () => {
                      let type = params.row.prizeType === '卡密优惠券' ? 5 :
                                 params.row.prizeType === '易购优惠券' ? 6 :
                                 params.row.prizeType === '二维码优惠券' ? 7 :
                                                                        11;

                      this.searchRemainderNum({
                        id:params.row.id,
                        type
                      });
                    }
                  }
                }, '剩余数量'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style:{
                    marginLeft: '5px',
                    display: params.row.prizeType === '卡密优惠券' ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      // 卡密
                      this.showImportModal = true;
                      this.setId(params.row.id);
                      this.uploadUrl = 'import_coupon_pool_string'
                    }
                  }
                }, '导入库存'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style:{
                    margin: '5px 0 5px 5px',
                    display: params.row.prizeType === '二维码优惠券' ? 'inline-block' : 'none'
                  },
                  on: {
                    click: () => {
                      this.setId(params.row.id);
                      this.showImportModal = true;
                      // 二维码
                      this.uploadUrl = 'import_coupon_pool_qrcode'
                    }
                  }
                }, '导入库存')
              ])
            }
          }
        ],
        rows:[],
      }
    },
    methods: {
      handleCancle(){
        const _this = this;
        _this.showModal = false;
        _this.createdPoolInfo = {
          id:'',
          name:'',
          activityId:'',
          activitySecretKey:'',
          memo:'',
          prizeType:'',
          provider:'',
          quantity:'',
          number:'',
          type:'',
          startTime:'',
          endTime:'',
        };
        _this.time = '';
      },
      // 券池 更新 创建
      handleCouponPool(handleType){
        const _this = this;
        _this.$Spin.show();
        let params = {};
        if(_this.createdPoolInfo.id){
          params.id = _this.createdPoolInfo.id;

        }
        params.prizeType = _this.createdPoolInfo.prizeType;
        params.name = _this.createdPoolInfo.name;
        params.memo = _this.createdPoolInfo.memo;
        params.provider = _this.createdPoolInfo.provider;
        params.number =  _this.createdPoolInfo.number;
        params.type = _this.createdPoolInfo.type;

        _this.createdPoolInfo.prizeType = _this.createdPoolInfo.prizeType === 999 ? '' : _this.createdPoolInfo.prizeType;
        if(_this.createdPoolInfo.prizeType === 5 || _this.createdPoolInfo.prizeType === 7){
          params.startTime = new Date(_this.time[0]).getTime();
          params.endTime = new Date(_this.time[1]).getTime();
          params.quantity = _this.quantity;
        }
        if(_this.createdPoolInfo.prizeType === 6) { // 易购优惠券
          params.startTime = new Date(_this.time[0]).getTime();
          params.endTime = new Date(_this.time[1]).getTime();
          params.activityId = _this.createdPoolInfo.activityId;
          params.activitySecretKey = _this.createdPoolInfo.activitySecretKey;
          params.quantity = _this.createdPoolInfo.quantity === '' ? 0 : _this.createdPoolInfo.quantity;
        }
        if(_this.createdPoolInfo.prizeType === 11) { // 购物津贴
          params.activityId = _this.createdPoolInfo.activityId;
          params.quantity = _this.createdPoolInfo.quantity === '' ? 0 : _this.createdPoolInfo.quantity;
          params.startTime = new Date().getTime();
          params.endTime = new Date().getTime();
        }
        let validatorStr = '';
        if(params.prizeType === '') {
          _this.$Spin.hide();
          validatorStr = '券池类型不能为空';
          return _this.$Message.error({
            content: validatorStr,
            duration: 3
          })
        }
        if(params.name === '') {
          _this.$Spin.hide();
          validatorStr = '券池名称不能为空';
          return _this.$Message.error({
            content: validatorStr,
            duration: 3
          })
        }
        if(params.memo.length > 128) {
          _this.$Spin.hide();
          validatorStr = '券池描述不能超过128个汉字';
          return _this.$Message.error({
            content: validatorStr,
            duration: 3
          })
        }
        if(params.provider.length > 50) {
          _this.$Spin.hide();
          validatorStr = '提供方不能超过50个汉字';
          return _this.$Message.error({
            content: validatorStr,
            duration: 3
          })
        }
        if(params.name.length > 12) {
          _this.$Spin.hide();
          validatorStr = '券池名称最多12个汉字';
          return _this.$Message.error({
            content:validatorStr,
            duration: 3
          })
        }
        if(params.activityId === '') {
          _this.$Spin.hide();
          validatorStr = '活动编码不能为空';
          return _this.$Message.error({
            content:validatorStr,
            duration: 3
          })
        }
        if(params.activitySecretKey === '') {
          _this.$Spin.hide();
          validatorStr = '活动秘钥不能为空';
          return _this.$Message.error({
            content:validatorStr,
            duration: 3
          })
        }
        if(params.prizeType !== 11 && !(_this.time[0]) && !(_this.time[1])) {
          _this.$Spin.hide();
          validatorStr = '有效期不能为空';
          return _this.$Message.error({
            content:validatorStr,
            duration: 3
          })
        }
        if(!validatorStr){ // validatorStr === ''
          api.post('add_pool_coupon',null,params)
              .then((res) => {
                if(res.code === 200) {
                  _this.time = '';
                  _this.$Spin.hide();
                  _this.showModal = false;
                  _this.query_coupon_pool_list();
                  this.$Message.success({
                    content: '操作成功',
                    duration: 3
                  });
                }
              }).catch((err) => {
                _this.$Spin.hide();
                _this.$Message.error({
                  content: err.message || '操作失败',
                  duration: 3
                });
          })
        }
      },
      getTime(time){
        this.time = time;
      },
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
      setId(id){
        this.createdPoolInfo.id = id;
      },
      getParams(params){
        this.createdPoolInfo.id = params.id;
      },
      // 查看券池剩余数量
      searchRemainderNum(params){
        const _this = this;
        api.post('query_surplus_coupon_pool',null,params)
            .then((res) => {
              if(res.code ===  200) {
                _this.message = res.message;
                const data = res.data;
                _this.count = data.count;
                _this.$Message.success({
                  content: '剩余 ' + data.count + ' 条' || '数据查询成功',
                  duration: 3
                });
              }
            }).catch((err) => {
              this.$Message.error({
                content: err.message || '数据查询失败',
                duration: 3
              });
            })
      },
      // 模板下载
      downloadExcel(fileType){
        window.open('/coupon/pool/download.do?fileType='+ fileType, '_self');
        /*api.get('/coupon/pool/download.do',fileType)
            .then((res) => {
              if(res.code === '200') {
                let openUrl = window.location.href + '?' + fileType;
                window.open('http://10.200.190.7:8080/ppms-admin-web/coupon/pool/download.do?fileType='+ fileType, '_self');
              }
            }).catch((err) => {
          //console.log(err);
          this.$Message.error({
            content: err.body || '文件下载失败',
            duration: 3
          });
        });*/
      },
      handleDownLoad(fileType){
        this.downloadExcel(fileType);
      },
      prizeTypeFormat(val){
        let name = '';
        this.backPrizeType.forEach(item => {
          if(item.id === val) {
            name = item.name;
          }
        });
        return name;
      },
      // 券池查询
      query_coupon_pool_list(flag) {
        const _this = this;
        if(flag) {
          _this.page = 1;
          _this.pageSize = 10;
        }
        _this.tableLoading = true;
        const params = {
          id: _this.id,
          name: _this.name,
          page:_this.page,
          prizeType:_this.prizeType === 999 ? '':_this.prizeType,
          pageSize: _this.pageSize,
          sortName: _this.sortName,
          sortOrder: _this.sortOrder
        };
        api.post('query_coupon_pool_list', null, params).then(res => {
          _this.tableLoading = false;
          if(res.code === 200) {
            _this.tableLoading = false;
            _this.message = res.message;
            let rows = res.data.rows;
            if(rows.length===0){
              if(rows.length === 0){
                _this.$Message.warning({
                  content: '未查到相关数据',
                  duration: 3
                });
              }
            }
            rows = rows.map((item, index) => {
              item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
              item.startTime= utils.dateFormat(item.startTime,'YYYY-MM-DD');
              item.endTime= utils.dateFormat(item.endTime,'YYYY-MM-DD');
              item.prizeType = _this.prizeTypeFormat(item.prizeType);
              if(item.prizeType === '购物津贴'){
                item.startTime = '--';
                item.endTime = '--';
                item.type = '--';
                item.number = '--';
              }
              return item;
            });
            _this.rows = rows;
            _this.total = res.data.total;
          }
        }).catch(err => {
          this.$Message.error({
            content: err.message || '项目列表查询失败',
            duration: 3
          });
          _this.tableLoading = false;
        })
      },
      // 页面初始化
      openModal(handleType){
        const _this = this;
        _this.showModal = true;
        _this.createdPoolInfo = {
          id:'',
          name:'',
          activityId:'',
          activitySecretKey:'',
          memo:'',
          prizeType:'',
          provider:'',
          quantity:'',
          number:'',
          type:'',
          startTime:'',
          endTime:'',
        };
        _this.time = '';
        if( handleType === 'create' ){
          _this.handleType = 'create';
          _this.createdPoolInfo.prizeType = 6;
          _this.typeDisabled = false;

        } else {
          _this.handleType = 'update';
          _this.typeDisabled = true;
        }
      },
      // 取消默认上传
      handleUpload(file){
        this.fileList = [];
        this.upLoadFile = file;
        this.fileList.push(file);
        let fileType = '';
        for(let i = 0;i < this.fileList.length;i++){
          let typeName = this.fileList[i].name;
          fileType = typeName.slice(typeName.lastIndexOf('.') + 1);
          if(['xls','xlsx','cvs'].lastIndexOf(fileType) == -1){
            this.$Message.error({
              content: '文件格式不正确,请上传xls、xlsx、cvs类型的excel格式文件',
              duration: 3
            });
          }
        }
        return false;
      },
      // 手动上传
      upload () {
        const _this = this;
        let form = new FormData();
        if(_this.fileList.length===0){
          return _this.$Message.warning({
            content:'请选择上传文件',
            duration:3
          })
        }
        for(let i = 0; i < _this.fileList.length;i++){
          let item = _this.fileList[i];
          form.append('excel',item);
          form.append('id',_this.createdPoolInfo.id);
        }
        _this.loadingStatus = true;
        let timeOut = 60 * 1000;
        api.post(_this.uploadUrl, null, form, timeOut)
            .then((res) => {
              if(res.code === 200) {
                _this.loadingStatus = false;
                const data = res.data;
                _this.totalNum = data.totalNum;
                _this.successNum = data.successNum;
                const successMsg = '总共上传了' + this.totalNum + '条数据，上传成功了' + this.successNum + '条数据';
                _this.$Message.success({
                  content: successMsg || '数据导入成功',
                  duration: 3
                });
                _this.showImportModal = false;
                _this.$refs.excelFile.clearFiles();
                _this.query_coupon_pool_list();
                _this.fileList = [];
              } else {

                _this.loadingStatus = false;
                _this.fileList = [];
                _this.$Message.error({
                  content: ' 文件上传失败',
                  duration: 3
                });
                _this.showImportModal = false;
              }
            })
            .catch((err) =>{
              _this.loadingStatus = false;
              _this.$Message.error({
                content: err.message || '数据导入失败',
                duration: 3
              });
            })
      },
      // 删除文件
      deleteFile(index){
        this.fileList.splice(index,1);
      },
      // 取消上传
      cancel(){
        this.fileList = [];
        this.showImportModal = false;
      },
      // 页码切换
      changePage(n) {
        this.page = n;
        this.query_coupon_pool_list();
      },
      // 页数切换
      changePageSize(n) {
        this.pageSize = n;
        if (this.page === 1) {
          this.query_coupon_pool_list();
        }
      },
      getType(){
        const _this = this;
        _this.refshLoading = true;
        api.get('get_prize_type_idAndName')
            .then((res) => {
              if(res.code === 200) {
                this.backPrizeType = res.data;
              }
            }).catch((err) => {
          _this.$Message.error({
            content: err.message || '刷新失败',
            duration: 3
          })
        })
      },
    },
    created() {
       this.$store.commit('updatePathName');
    },
    mounted() {
      const _this = this;
      _this.getType();
      if (window.location.href.split('?')[1] === 'type=createPool') {
        _this.showModal = true;
      }
      if (window.location.href.split('?')[1] === 'type=create') {
        _this.showModal = true;
      }
      _this.query_coupon_pool_list('init');
    },
    computed:{
      handleAll() {
        if(this.handleType === 'create'){
          return true;
        } else {
          return false;
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .couponPool{}
</style>
