<!--奖品池管理-->
<template>
  <div class="prizePool" @keyup.enter="query_prizePool_list('init')">
    <div class="header" style="margin-bottom: 5px;">
      <Input
        class="input"
        v-model="id"
        clearable
        placeholder="奖池ID"
      />
      <Input
        class="input"
        v-model="name"
        clearable
        placeholder="奖池名称"
      />
      <Select
        class="select"
        v-model="type"
        placeholder="奖池类型">
        <Option
          v-for="item in typeList"
          :value="item.value"
          :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button
        class="button-search"
        @click="query_prizePool_list('init')">查找</Button>
      <Button
        type="primary"
        style="float: right"
        class="button"
        @click="handleCreat">新建奖品池</Button>
      <Button
        type="primary"
        class="button"
        style="float: right"
        @click="getPrizeTypeDisplay">我的奖品分类</Button>
    </div>
    <!--项目列表-->
    <Table
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

    <!--我的奖品分类Modal-->
    <Modal :mask-closable="false"
      class="modal_prizeType"
      :footer-hide="true"
      @click="showPrizeTypeModal"
      v-model="showModalPrizeType"
      width="500"
      title="奖品分类设置"
      :styles="{top: '10px'}"
      :width="600"
    >
      <div class="content">
        <div style="margin-bottom:15px;">
          <Row>
            <Col span="8"><span>奖品分类</span></Col>
            <Col span="8"><span>分类名称</span></Col>
            <Col span="8"><span>显示顺序</span></Col>
          <!--  <Col span="6"><span>是否展示</span></Col>-->
          </Row>
        </div>
        <div v-for="(item,index) in prizeTypeDisplayBos" :key="index">
          <Row style="margin-bottom:15px;">
            <Col span="8" style="margin-top:6px;">
              <Checkbox :label="item.firstName" v-model="item.displayMask">{{item.firstName}}</Checkbox>
            </Col>
            <Col span="8"><Input style="width:100px;" clearable v-model="item.name"/></Col>
            <Col span="8"><InputNumber :min="0" style="width:100px;" clearable v-model="item.displayOrder"></InputNumber></Col>
            <!-- <Col span="6">
               <Select style="width:100px;" v-model="item.displayFlag" @on-change="updateGoUrl">
                 <Option v-for="(list,index) in displayFlagList" :value="list.value" :key="index">{{list.label}}</Option>
               </Select>
             </Col>-->
          </Row>
        </div>
        <!--<CheckboxGroup
          v-for="(item,index) in prizeTypeDisplayBos"
          v-model="item.index"
          :key="index">
          <Row style="margin-bottom:15px;">
            <Col span="8" style="margin-top:6px;">
              &lt;!&ndash;TODO THIS&ndash;&gt;
              <Checkbox :label="item.name" v-model="item.displayFlag"></Checkbox>
            </Col>
            <Col span="8"><Input style="width:100px;" clearable v-model="item.name"/></Col>
            <Col span="8"><Input style="width:100px;" clearable v-model="item.displayOrder"/></Col>
           &lt;!&ndash; <Col span="6">
              <Select style="width:100px;" v-model="item.displayFlag" @on-change="updateGoUrl">
                <Option v-for="(list,index) in displayFlagList" :value="list.value" :key="index">{{list.label}}</Option>
              </Select>
            </Col>&ndash;&gt;
          </Row>
        </CheckboxGroup>-->
        <div slot="footer" style="text-align: center">
          <Button type="error" @click="cancelUpdatePrizeType">取消</Button>
          <Button type="success" @click="updatePrizeTypeDisplay">确定</Button>
        </div>
      </div>
    </Modal>
    <!--创建奖品池Modal-->
    <Modal :mask-closable="false" class="modal_prizePool" v-model="showModal" title="奖品池详情" :styles="{top: '10px'}" :width="800">

      <div class="content">
        <!--奖品池信息-->
        <div>
          <!--<p v-if="createdInfoList.id !==''">
            <i style="color:red;margin-right:5px;">*</i>奖品池ID
            <Input  v-model="createdInfoList.id" clearable placeholder="奖品池ID" style="width:200px;margin-left: 40px"/>
          </p>-->
          <p>
            <i style="color:red;margin-right:5px;">*</i>奖品池名称
            <Input  v-model="createdInfoList.name" clearable placeholder="不能超过12个汉字" style="width:200px;margin-left: 30px"/>
            <span style="margin-left:50px">奖品池描述</span>
            <Input  v-model="createdInfoList.memo" clearable placeholder="不能超过15个汉字" style="width: 200px;"/>
          </p>
          <!--领奖失败弹窗图片-->
          <p class="prizePool-imgLoad-tip" style="font-size:12px;margin:20px 0">领奖失败弹窗图片：<span style="display:inline;color:red;">（注：当领奖失败时，弹窗上显示的图片。图片格式PNG / JPG / GIF）</span></p>
          <div class="uploadImg" style="margin-bottom: 10px;" v-for="(item, index) in createdInfoList.imageList" :key="index">
            <span style="display: inline-block;text-align: left; vertical-align: top;">{{item.type}}</span>
            <div class="uploadCoverImg" @mousemove="item.show = true" @mouseleave="item.show = false">
              <Icon type="ios-camera" size="30" v-if="!item.url" style="float: left"></Icon>
              <input type="file" :id="item.type + '-' + index" @change="selectFile(item,index,item.type + '-' + index,createdInfoList.imageList)">
              <img :src="item.url" alt="">
              <div class="mask" :style="{display: (item.url && item.show) ? 'inline-block' : 'none'}">
                <Icon size="30" type="ios-trash-outline" style="cursor: pointer" @click.native="removeUrl(item,index,item.type + '-' + index,createdInfoList.imageList)"></Icon>
              </div>
            </div>
          </div>
        </div>
        <!--奖品项地址-->
        <div>
          <!--循环外层的两个地址项-->
          <div v-for="(outer,outerIndex) in createdInfoList.outer" :key="outerIndex">
            <p v-if="outerIndex===0" style="margin:10px 0"><span style="display: inline">领奖失败弹窗角标按钮文案：</span><Input  style="width:200px;" clearable placeholder="不超过5个汉字" v-model="createdInfoList.buttonLabel1"/></p>
            <p v-if="outerIndex===1" style="margin:10px 0"><span style="display: inline">领奖失败弹窗扩展按钮文案：</span><Input  style="width:200px;" clearable placeholder="不超过5个汉字" v-model="createdInfoList.buttonLabel2"/></p>
            <p v-if="outerIndex===0">（失败角标）跳转地址</p>
            <p v-if="outerIndex===1">（失败扩展）跳转地址</p>
            <div v-for="(url,urlIndex) in createdInfoList.outer[outerIndex]" :key="urlIndex" style="margin-bottom:10px;">
              <Select style="width:200px" v-model="url.type" @on-change="changeOuterUrlType(createdInfoList.outer,createdInfoList.outerUrlType,url.type, outerIndex)">
                <Option v-for="(urlType,typeIndex) in createdInfoList.outerUrlType" :key="typeIndex" :value="urlType.value" :disabled="outerIndex===0?urlType.disabled1:urlType.disabled2">{{urlType.label}}</Option>
              </Select>
              <Input style="width:470px;" v-model="url.url"  />
              <Button icon="ios-add" size="small" shape="circle" v-if="!urlIndex" @click="addGoUrl(createdInfoList.outer,outerIndex)"></Button>
              <Button icon="ios-close" size="small" shape="circle" v-else @click="removeGoUrl(createdInfoList.outer,outerIndex,urlIndex,createdInfoList.outer[outerIndex],createdInfoList.outerUrlType)"></Button>
            </div>
          </div>
        </div>
        <div>
          <p style="margin:20px 0;">
            <i style="font-style: normal;color:red;">*</i>有效期<InputNumber :min="1" v-model="createdInfoList.timeout" style="width:100px;margin-left:28px; margin-right: 10px;"></InputNumber>
            天
            <i style="font-style: normal;color:red; margin-left: 100px;">*</i>领奖截止时间：<DatePicker v-model="createdInfoList.deadtime" type="datetime" placeholder="年/月/日/时/分/秒" style="width: 200px"></DatePicker>
          </p>
          <p style="margin:20px 0;">
            <i style="font-style: normal;color:red;">*</i>奖池类型
            <Select v-model="createdInfoList.type" :value="createdInfoList.type" style="width:200px;margin-left:10px;">
              <Option v-for="(type,prizeTypeIndex) in typeList" :value="type.value" :key="prizeTypeIndex">{{type.label}}</Option>
            </Select>
          </p>
        </div>
        <!--折叠面板-->
        <div>
          <p style="font-size: 14px; text-align: center;margin: 20px 0;">
            - - - - - -添加奖品项信息- - - - - -
          </p>
          <Collapse
            style="margin-bottom:15px;"
            v-model="value1">
            <!--v-for="(item, l) in createdInfoList.prizeItemList"
           :key="l"-->
            <!--l不等于0时 显示 删除按钮-->
            <Panel :name="value1" v-for="(item, l) in createdInfoList.prizeItemList" :key="l">
              <div style="float: right">
                <div v-if="l">
                  <Button type="text" @click="deletePrizeItem(l)" style="font-size:20px;color:#e13d13;position:relative;right:-4px;z-index:1;float: right;top:-2.5px;" ghost>×</Button>
                </div>
              </div>
              <span style="float: right; position: absolute;right:30px;">奖项{{l+1}}</span>
              <div slot="content" class="collapseContent">
                <!--奖品项目信息-->
                <div>
                  <p v-if="item.id">奖品项ID：{{item.id}}</p>
                  <p>
                    <i style="color:red;margin-right:5px;">*</i>奖品名称
                    <Input v-model="item.name" clearable placeholder="不能超过12个汉字" style="width:200px;margin-left: 30px"/>
                  </p>
                  <p>
                    奖品描述
                    <Input v-model="item.memo" clearable type="textarea" placeholder="不能超过1024个汉字" :rows="8" style="width: 400px;font-size:12px; margin-left: 40px;"/>
                  </p>
                  <p>
                    <i style="color:red;">* </i>奖品类型
                    <Select v-model="item.prizeType" :value="item.prizeType" style="width:200px;margin-left:35px;" placeholder="奖品类型" @on-change="showSelect(item.prizeType)">
                      <Option v-for="list in innerTypeList" :value="list.value" :key="list.value">{{ list.label }}</Option>
                    </Select>
                  </p>
                  <p v-show="item.prizeType == 1">
                    <i style="color:red;margin-right:5px;">*</i>掉卡位ID
                    <Input
                      v-model="item.strategy"
                      clearable
                      style="width:200px;margin-left: 30px"
                    />
                  </p>
                  <p v-show="item.prizeType == 3">
                    <i style="color:red;margin-right:5px;">*</i>会员类型
                    <Select  style="width:200px;margin-left:30px;" v-model="item.prizeTypeExtBo.vip_type">
                      <Option v-for="(type,index) in vipList" :key="index" :value="type.value">{{type.label}}</Option>
                    </Select>
                  </p>
                  <p v-show="item.prizeType == 3">
                    <i style="color:red;margin-right:5px;">*</i>会员天数
                    <Input
                      clearable
                      v-model="item.prizeTypeExtBo.member_day"
                      style="width:200px;margin-left: 30px"
                    />
                  </p>
                  <p v-show="item.prizeType == 3">
                    <i style="color:red;margin-right:5px;">*</i>渠道号
                    <Input
                      clearable
                      v-model="item.prizeTypeExtBo.channel"
                      style="width:200px;margin-left:40px"
                    />
                  </p>
                  <p v-show="item.prizeType == 3">
                    <i style="color:red;margin-right:5px;">*</i>秘钥
                    <Input
                      clearable
                      v-model="item.prizeTypeExtBo.md5key"
                      style="width:200px;margin-left:50px"
                    />
                  </p>
                  <p v-show="item.prizeType == 11">
                    <i style="color:red;margin-right:5px;">*</i>每次获取津贴额
                    <!--TODO THIS-->
                    <Input
                      clearable
                      style="width:200px;margin-left: 30px"
                    />
                  </p>
                  <!--TODO THIS-->
                  <p v-show="item.prizeType == 11">
                    <i style="color:red;margin-right:5px;">*</i>已发放津贴额
                    <Input
                      v-model="item.usedYunZuan"
                      clearable
                      style="width:200px;margin-left: 30px"
                    />
                  </p>
                  <p v-show="item.prizeType == 5 ||item.prizeType ==6 || item.prizeType == 7 ">
                    <i style="color:red;margin-right:5px;">*</i>奖品类型
                    <Select style="width:200px;margin-left: 30px" v-model="item.prizeCouponPoolId" :value="item.prizeCouponPoolId">
                      <Option v-for="(prizePoolType,index) in prizePoolTypeList" :value="prizePoolType.value" :key="index">{{prizePoolType.label}}</Option>
                    </Select>
                    <Button icon="ios-refresh" size="small" shape="circle" @click="getType" style="margin-right: 5px;" :loading="refshLoading"></Button>
                    <Button icon="ios-add" size="small" shape="circle" @click="openPrizePool"></Button>
                  </p>
                  <p v-show="item.prizeType == 2">
                    <i style="color:red;margin-right:5px;">*</i>每次获取云钻数
                    <Input
                      v-model="item.prizeTypeExtBo.yuzuan_numbe"
                      clearable
                      style="width:200px;margin-left: 30px"
                    />
                  </p>
                  <!--TODO THIS-->
                  <p>
                    <i style="color:red;margin-right:5px;">*</i>总发放数量
                    <InputNumber :min="0" v-model="item.totalQuantity" clearable placeholder="此奖项可获得的奖品总数" style="width:200px;margin-left: 30px"></InputNumber>
                  </p>
                  <p>
                    <Row>
                      <Col span="8"><i style="margin-right: 10px;font-style: normal">未发放数量：</i><InputNumber :readonly="countReaonly" v-model="item.quantity" style="width:70px;margin-left:20px;"></InputNumber></Col>
                      <Col span="8"><i style="margin-right: 10px;font-style: normal">已发放数量：</i><InputNumber :readonly="countReaonly" :min="0" v-model="item.usedQuantity" style="width:70px;"></InputNumber></Col>
                    </Row>
                  </p>
                  <p v-show="item.prizeType == 2">
                    <i style="color:red;margin-right:5px;">*</i>已发放云钻数
                    <InputNumber :min="0" v-model="item.prizeTypeExtBo.usedYunZuan" clearable style="width:200px;margin-left:40px"></InputNumber>
                  </p>
                  <p>
                    <i style="color:red;margin-right:5px;">*</i>掉奖概率：
                    <InputNumber v-model="item.probability" :min="0" :max="100" clearable placeholder="范围值0-100" style="width:200px;margin-left:15px"></InputNumber>
                  </p>
                  <p>
                    <i style="color:red">*</i>
                    <i style="font-style: normal;margin-right:5px;">展示顺序：</i>
                    <InputNumber v-model="item.displayOrder" :min="1" :max="999" clearable placeholder="数值越小，奖品位置越靠前" style="width:200px;margin-left:18px"></InputNumber>
                  </p>
                </div>
                <!--奖品池图片-->
                <div>
                  <p class="prizePool-imgLoad-tip" style="margin:20px 0">
                    奖品图片：（注：图片格式PNG / JPG / GIF，PC端为70*96px，移动端为191*262px）
                  </p>
                  <div class="uploadImg" style="margin-bottom: 10px;" v-for="(i, index) in item.imageList" :key="index">
                    <span style="display: inline-block; width: 40px;text-align: right; vertical-align: top;">{{i.type}}</span>
                    <div class="uploadCoverImg" @mousemove="i.show = true" @mouseleave="i.show = false">
                      <Icon type="ios-camera" size="30" v-if="!i.url" style="float: left"></Icon>
                      <input :key="index" type="file" :id="i.type + '-' + l + '-' + index" @change="selectFile(i,index,i.type + '-' + l + '-' + index,item.imageList)"/> <!--item,index,id,imgList-->
                      <img :src="i.url" alt="" style="vertical-align: top">
                      <div class="mask" :style="{display: (i.url && i.show) ? 'inline-block' : 'none'}">
                        <Icon size="30" type="ios-trash-outline" style="cursor: pointer" @click.native="removeUrl(i,index,i.type + '-' + l + '-' + index,item.imageList)"></Icon>
                      </div>
                    </div>
                  </div>
                </div>
                <!--内层奖品项地址-->
                <div v-for="(inner,innerIndex) in item.inner" :key="innerIndex">
                  <p v-if="innerIndex===0" style="margin:10px 0"><span style="display: inline">领奖成功弹窗角标按钮文案：</span><Input  style="width:200px;" clearable placeholder="不超过5个汉字" v-model="item.buttonLabel1"/></p>
                  <p v-if="innerIndex===1" style="margin:10px 0"><span style="display: inline">领奖成功弹窗扩展按钮文案：</span><Input  style="width:200px;" clearable placeholder="不超过5个汉字" v-model="item.buttonLabel2"/></p>
                  <p v-if="innerIndex===0">(去使用)跳转地址:<span style="display: inline;color:red;">（注：如果需要打开站外APP，请填写：外部路由地址$$$正常跳转地址，优先打开外部路由地址）</span></p>
                  <p v-if="innerIndex===1">（成功角标）跳转地址</p>
                  <p v-if="innerIndex===2">（成功扩展）跳转地址</p>
                  <div v-for="(innerUrl,innerUrlIndex) in item.inner[innerIndex]" :key="innerUrlIndex" style="margin-bottom:10px;">
                    <Select style="width:200px" :value="innerUrl.type" v-model="innerUrl.type" @on-change="changeOuterUrlType(item.inner, item.innerUrlType, innerUrl.type, innerIndex)">
                      <Option v-for="(innerUrlType,innerTypeIndex) in item.innerUrlType" :key="innerTypeIndex" :value="innerUrlType.value"
                              :disabled="item.innerUrlType[innerTypeIndex]['disabled' + (innerIndex + 1)]">{{innerUrlType.label}}</Option>
                    </Select>
                    <Input  style="width:470px;" v-model="innerUrl.url" />
                    <Button icon="ios-add" size="small" shape="circle" v-if="!innerUrlIndex" @click="addGoUrl(item.inner, innerIndex)"></Button>
                    <Button icon="ios-close" size="small" shape="circle" v-else @click="removeGoUrl(item.inner, innerIndex, innerUrlIndex,item.inner[innerIndex],item.innerUrlType)"></Button>
                  </div>
                </div>
              </div>
            </Panel>
          </Collapse>
        </div>
        <!--新增奖品项button-->
        <p style="margin:10px 0"><Button type="primary" :disabled="buttonDisabled" long @click.native="addPrizeItem">添加奖品项</Button></p>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="error" @click="handleCancle">取消</Button>
        <Button type="success" :disabled="selectDisabled" @click="createPool" v-if="handleMask">确定</Button>
        <Button type="success" :disabled="selectDisabled" @click="createPool" v-else>确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import api from '../../libs/API'
  import utils from '../../libs/utils'
  export default {
    name: "PrizePool",
    data () {
      return {
        handleMask: true,
        inputReadonly:true,
        buttonDisabled:false,

        refshLoading:false,

        countDisabled:true,

        countReaonly: true,

        // 新建时未发放数量初始值为0
        initPrizePoolCount:0,

        apiUrl:'',

        initCount:1,
        modal_prizePoolDetail:false,

        tableLoading: false,

        detailData:[],

        showModal: false,
        showModalPrizeType: false,


        vipList:[
          {
            label:'普通会员',
            value:1
          },
          {
            label:'移动会员',
            value: -5
          },
          {
            label:'超级会员',
            value:10
          }
        ],

        total: 0,
        page:1,
        pageSize:10,

        sortOrder: 'DESC',
        sortName: 'id',//  true 排序字段名

        id: '',
        name: '',
        type: '',

        rows: [],

        handleType:'',

        focusList:[],


        innerTypeList:[],

        prizePoolTypeList:[],

        // 奖品分类展示
        data: [],
        PrizeTypeDisplayBo:[],
        typeList: [
          {
            label: '单奖品',
            value: 2
          },
          {
            label: '多奖品',
            value: 1
          }
        ],
        /* 创建奖品池参数 */
        createdInfo: {
          name: '',
          projectId: '',
          type: '',
          memo: '',
          timeout: '',
          deadtime: '',
          buttonLabel1: '',
          buttonLabel2: '',
          goUrl1: {},
          goUrl2: {},
          image1:'',
          image2:'',
          image3:'',
          image4:'',
          prizeItemList: [
            {
              prizeTypeExtBo:{
                strategy:'',
                yuzuan_number:'',
                member_day:'',
                redirect_url:'',
                yigou_url:'',
                coupon_pool_id:'',
                vip_type:'',
                channel:'',
                md5key:'',
                bonus_number:''
              },
              prizePoolId: '',
              name: '',
              memo: '',
              prizeType: '',
              probability: '',
              quantity: '',
              yuzuan_numbe:'',
              totalQuantity: '',
              usedQuantity: '',
              displayOrder: '',
              usedYunZuan: '',
              buttonLabel1: '',
              buttonLabel2: '',
              goUrl:{},
              goUrl2:{},
              goUrl3:{},
              image1:'',
              image2:'',
              image3:'',
              image4:''
            }
          ]
        },
        prizeItemListTemplate: [],

        /* 渲染数据参数 */
        createdInfoList:{
          name: '',
          projectId: '',
          type: '',
          memo: '',
          timeout: '',
          deadtime: '',
          buttonLabel1: '',
          buttonLabel2: '',
          goUrl1: {},
          goUrl2: {},
          imageList:[
            {
              type: 'PC',
              url: null,
              show: false
            },
            {
              type: 'M',
              url: null,
              show: false,
            },
            {
              type: 'TV',
              url: null,
              show: false
            },
            {
              type: 'PAD',
              url: null,
              show: false
            }
          ],
          outerUrlType: [
            {
              label: 'iPhone端',
              value: 0,
              mask:'iph',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'AndroidPhone端',
              value: 1,
              mask:'aph',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'PC浏览器',
              value: 2,
              mask:'web',
              disabled1: false,
              disabled2: false
            },
            {
              label: '手机浏览器',
              value: 3,
              mask:'wap',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'windows客户端',
              value: 4,
              mask:'clt',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'Mac客户端',
              value: 5,
              mask:'mac',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'AndroidPad端',
              value: 6,
              mask:'apd',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'ipad端',
              value: 7,
              mask:'ipd',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'TV端',
              value: 8,
              mask:'atv',
              disabled1: false,
              disabled2: false
            },
            {
              label: '电视盒子',
              value: 9,
              mask:'box',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'WinPhone端',
              value: 10,
              mask:'wph',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'WinPad端',
              value: 11,
              mask:'wpd',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'flash播放器',
              value: 12,
              mask:'flp',
              disabled1: false,
              disabled2: false
            },
            {
              label: '其它非核心业务终端',
              value: 13,
              mask:'misc',
              disabled1: false,
              disabled2: false
            }
          ],
          outer: [
              [],
              []
          ],
          prizeItemList:[
            {
              prizeTypeExtBo:{
                strategy:'',
                yuzuan_number:'',
                member_day:'',
                redirect_url:'',
                yigou_url:'',
                coupon_pool_id:'',
                vip_type:'',
                channel:'',
                md5key:'',
                bonus_number:''
              },
              prizePoolId: '',
              name: '',
              memo: '',
              prizeType: '',
              probability: '',
              quantity: '',
              yuzuan_numbe:'',
              totalQuantity: '',
              usedQuantity: 0,
              displayOrder: '',
              usedYunZuan: 0,
              buttonLabel1: '',
              buttonLabel2: '',
              goUrl:{},
              goUrl1:{},
              goUrl2:{},
              imageList: [
                {
                  type: 'PC',
                  url: null,
                  show: false
                },
                {
                  type: 'M',
                  url: null,
                  show: false,
                },
                {
                  type: 'TV',
                  url: null,
                  show: false
                },
                {
                  type: 'PAD',
                  url: null,
                  show: false
                }
              ],
              innerUrlType: [
                {
                  label: 'iPhone端',
                  value: 0,
                  mask:'iph',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'AndroidPhone端',
                  value: 1,
                  mask:'aph',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'PC浏览器',
                  value: 2,
                  mask:'web',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: '手机浏览器',
                  value: 3,
                  mask:'wap',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'windows客户端',
                  value: 4,
                  mask:'clt',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'Mac客户端',
                  value: 5,
                  mask:'mac',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'AndroidPad端',
                  value: 6,
                  mask:'apd',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'ipad端',
                  value: 7,
                  mask:'ipd',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'TV端',
                  value: 8,
                  mask:'atv',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: '电视盒子',
                  value: 9,
                  mask:'box',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'WinPhone端',
                  value: 10,
                  mask:'wph',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'WinPad端',
                  value: 11,
                  mask:'wpd',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'flash播放器',
                  value: 12,
                  mask:'flp',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: '其它非核心业务终端',
                  value: 13,
                  mask:'misc',
                  disabled1: false,
                  disabled2: false
                }
              ],
              inner: [
                [],
                [],
                []
              ],
              prizeData:[],
              prizeItem_prizePoolType:''
            }
          ]
        },

        prizePoolDetail:{
          name: '',
          projectId: '',
          type: '',
          memo: '',
          timeout: '',
          deadtime: '',
          buttonLabel1: '',
          buttonLabel2: '',
          goUrl1: {},
          goUrl2: {},
          imageList:[
            {
              type: 'PC端',
              url: null,
              show: false
            },
            {
              type: '移动端',
              url: null,
              show: false,
            },
            {
              type: 'TV端',
              url: null,
              show: false
            },
            {
              type: 'pad端',
              url: null,
              show: false
            }
          ],
          outerUrlType: [
            {
              label: 'iPhone端',
              value: 0,
              mask:'iph',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'AndroidPhone端',
              value: 1,
              mask:'aph',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'PC浏览器',
              value: 2,
              mask:'web',
              disabled1: false,
              disabled2: false
            },
            {
              label: '手机浏览器',
              value: 3,
              mask:'wap',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'windows客户端',
              value: 4,
              mask:'clt',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'Mac客户端',
              value: 5,
              mask:'mac',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'AndroidPad端',
              value: 6,
              mask:'apd',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'ipad端',
              value: 7,
              mask:'ipd',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'TV端',
              value: 8,
              mask:'atv',
              disabled1: false,
              disabled2: false
            },
            {
              label: '电视盒子',
              value: 9,
              mask:'box',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'WinPhone端',
              value: 10,
              mask:'wph',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'WinPad端',
              value: 11,
              mask:'wpd',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'flash播放器',
              value: 12,
              mask:'flp',
              disabled1: false,
              disabled2: false
            },
            {
              label: '其它非核心业务终端',
              value: 13,
              mask:'misc',
              disabled1: false,
              disabled2: false
            }
          ],
          outer: [
            [
              {
                type:'',
                url:''
              }
            ],
            [
              {
                type:'',
                url:''
              }
            ]
          ],
          prizeItemList:[
            {
              prizeTypeExtBo:{
                strategy:'',
                yuzuan_number:'',
                member_day:'',
                redirect_url:'',
                yigou_url:'',
                coupon_pool_id:'',
                vip_type:'',
                channel:'',
                md5key:'',
                bonus_number:''
              },
              prizePoolId: '',
              name: '',
              memo: '',
              prizeType: '',
              probability: '',
              quantity: '',
              yuzuan_numbe:'',
              totalQuantity: '',
              usedQuantity: 0,
              displayOrder: '',
              usedYunZuan: 0,
              buttonLabel1: '',
              buttonLabel2: '',
              goUrl:{},
              goUrl1:{},
              goUrl2:{},
              imageList: [
                {
                  type: 'PC端',
                  url: null,
                  show: false
                },
                {
                  type: '移动端',
                  url: null,
                  show: false,
                },
                {
                  type: 'TV端',
                  url: null,
                  show: false
                },
                {
                  type: 'pad端',
                  url: null,
                  show: false
                }
              ],
              innerUrlType: [
                {
                  label: 'iPhone端',
                  value: 0,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                },
                {
                  label: 'AndroidPhone端',
                  value: 1,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                },
                {
                  label: 'PC浏览器',
                  value: 2,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                },
                {
                  label: '手机浏览器',
                  value: 3,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                },
                {
                  label: 'windows客户端',
                  value: 4,
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'Mac客户端',
                  value: 5,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                },
                {
                  label: 'AndroidPad端',
                  value: 6,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                },
                {
                  label: 'ipad端',
                  value: 7,
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'TV端',
                  value: 8,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                },
                {
                  label: '电视盒子',
                  value: 9,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                },
                {
                  label: 'WinPhone端',
                  value: 10,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                },
                {
                  label: 'WinPad端',
                  value: 11,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                },
                {
                  label: 'flash播放器',
                  value: 12,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                },
                {
                  label: '其它非核心业务终端',
                  value: 13,
                  disabled1: false,
                  disabled2: false,
                  disabled3: false
                }
              ],
              inner: [
                [
                  {
                    type:'',
                    url:''
                  }
                ],
                [
                  {
                    type:'',
                    url:''
                  }
                ],
                [
                  {
                    type:'',
                    url:''
                  }
                ]
              ],
              prizeItemList:[],
              prizeData:[],
              prizeItem_prizePoolType:''
            }
          ]
        },



        columns: [
          {
            title: '序号',
            key: 'serialNum',
            width:70,
            fixed:'left'
          },
          {
            title: '奖池ID',
            key: 'id',
            sortable: true,
            width:100,
            fixed:'left',
          },
          {
            title: '奖池名称',
            key: 'name',
            /*width:200*/
          },
          {
            title: '奖池类型',
            key: 'type',
            width:120
          },
          {
            title: '有效期（天）',
            key: 'timeout',
            /*width:100*/
          },
         /* {
            title: '当天领奖',
            key: 'timeout'
          },*/
          {
            title: '截止日期',
            key: 'deadtime',
            sortable: true,
            /*width:150*/
          },
         /* {
            title: '奖项数量',
            key: 'deadtime'
          },*/
          /*{
            title: '创建时间',
            key: 'deadtime',
            sortable: true
          },*/
          {
            title: '操作',
            key: 'action',
            width:100,
            align: 'center',
            render: (h, params) => {
              return h('div',[
                /*h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small',
                    },
                    on: {
                      click: () => {
                        const body = {
                          id: params.row.id,
                          action:'detail',
                        };
                        this.modal_prizePoolDetail = true;
                        this.getId(params.row.id);
                        this.handlePrizePoolDetail(body);
                      }
                    }
                  }, '详情'),*/
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                      click: () => {
                        this.createdInfoList = {
                          name: '',
                          projectId: '',
                          type: '',
                          memo: '',
                          timeout: '',
                          deadtime: '',
                          buttonLabel1: '',
                          buttonLabel2: '',
                          goUrl1: {},
                          goUrl2: {},
                          imageList:[
                            {
                              type: 'PC端',
                              url: null,
                              show: false
                            },
                            {
                              type: '移动端',
                              url: null,
                              show: false,
                            },
                            {
                              type: 'TV端',
                              url: null,
                              show: false
                            },
                            {
                              type: 'pad端',
                              url: null,
                              show: false
                            }
                          ],
                          outerUrlType: [
                            {
                              label: 'iPhone端',
                              value: 0,
                              mask:'iph',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: 'AndroidPhone端',
                              value: 1,
                              mask:'aph',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: 'PC浏览器',
                              value: 2,
                              mask:'web',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: '手机浏览器',
                              value: 3,
                              mask:'wap',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: 'windows客户端',
                              value: 4,
                              mask:'clt',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: 'Mac客户端',
                              value: 5,
                              mask:'mac',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: 'AndroidPad端',
                              value: 6,
                              mask:'apd',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: 'ipad端',
                              value: 7,
                              mask:'ipd',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: 'TV端',
                              value: 8,
                              mask:'atv',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: '电视盒子',
                              value: 9,
                              mask:'box',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: 'WinPhone端',
                              value: 10,
                              mask:'wph',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: 'WinPad端',
                              value: 11,
                              mask:'wpd',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: 'flash播放器',
                              value: 12,
                              mask:'flp',
                              disabled1: false,
                              disabled2: false
                            },
                            {
                              label: '其它非核心业务终端',
                              value: 13,
                              mask:'misc',
                              disabled1: false,
                              disabled2: false
                            }
                          ],
                              /*outerUrlList: [
                                {
                                  type:'',
                                  url:''
                                }
                              ],*/
                          outer: [
                            [
                                {
                                  type:'',
                                  url:''
                                }
                            ],
                            [
                              {
                                type:'',
                                url:''
                              }
                            ]
                          ],
                              prizeItemList:[
                            {
                              prizePoolId: '',
                              name: '',
                              memo: '',
                              prizeType: '',
                              probability: '',
                              quantity: '',
                              yuzuan_numbe:'',
                              totalQuantity: '',
                              usedQuantity: 0,
                              displayOrder: '',
                              usedYunZuan: 0,
                              buttonLabel1: '',
                              buttonLabel2: '',
                              goUrl:{},
                              goUrl1:{},
                              goUrl2:{},
                              imageList: [
                                {
                                  type: 'PC',
                                  url: null,
                                  show: false
                                },
                                {
                                  type: 'M',
                                  url: null,
                                  show: false,
                                },
                                {
                                  type: 'TV',
                                  url: null,
                                  show: false
                                },
                                {
                                  type: 'PAD',
                                  url: null,
                                  show: false
                                }
                              ],
                              innerUrlType: [
                                {
                                  label: 'iPhone端',
                                  value: 0,
                                  mask:'iph',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: 'AndroidPhone端',
                                  value: 1,
                                  mask:'aph',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: 'PC浏览器',
                                  value: 2,
                                  mask:'web',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: '手机浏览器',
                                  value: 3,
                                  mask:'wap',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: 'windows客户端',
                                  value: 4,
                                  mask:'clt',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: 'Mac客户端',
                                  value: 5,
                                  mask:'mac',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: 'AndroidPad端',
                                  value: 6,
                                  mask:'apd',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: 'ipad端',
                                  value: 7,
                                  mask:'ipd',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: 'TV端',
                                  value: 8,
                                  mask:'atv',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: '电视盒子',
                                  value: 9,
                                  mask:'box',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: 'WinPhone端',
                                  value: 10,
                                  mask:'wph',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: 'WinPad端',
                                  value: 11,
                                  mask:'wpd',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: 'flash播放器',
                                  value: 12,
                                  mask:'flp',
                                  disabled1: false,
                                  disabled2: false
                                },
                                {
                                  label: '其它非核心业务终端',
                                  value: 13,
                                  mask:'misc',
                                  disabled1: false,
                                  disabled2: false
                                }
                              ],
                              inner: [
                                [
                                  {
                                    type:'',
                                    url:''
                                  }
                                ],
                                [
                                  {
                                    type:'',
                                    url:''
                                  }
                                ],
                                [
                                  {
                                    type:'',
                                    url:''
                                  }
                                ]
                              ],

                              prizeData:[],

                              prizeItem_prizePoolType:''
                            }
                          ]
                        };
                        const body = {
                          id: params.row.id,
                          action:'detail',
                        };
                        if(this.handleMask){
                          this.handleMask = false;
                        }
                        this.countDisabled = false;
                        this.apiUrl = 'update_prize_pool';
                        this.showModal =true;
                        this.getId(params.row.id);
                        this.handlePrizePoolDetail(body);
                    }
                  }
                }, '修改')
              ])
            }
          }
        ],
        images: [],
        selectDisabled: false,
        value1: 'value1',
        prizeTypeDisplayBos:[],
        pushList:[],
        message:'',

        /*prizeItemPrizeType:[
          {
            label:'球星卡',
            value:0
          },
          {
            label:'云钻',
            value:1
          },
          {
            label:'会员',
            value:2
          },
          {
            label:'购物津贴',
            value:3
          },
          {
            label:'二维码优惠券',
            value:4
          },
          {
            label:'实物',
            value:5
          },
        ],*/
        displayFlagList:[
          {
            label:'展示',
            value:0,
            displayFlag:''

          },
          {
            label:'不展示',
            value:1,
            displayFlag:''

          }
        ],
        poolType:[]
      }
    },
    methods: {
      showPrizeTypeModal(){
        this.showModalPrizeType = true;
        this.prizeTypeDisplayBos = [];
      },
      openPrizePool(){
        window.open('#/coupon/pool?type=createPool', '_blank');
      },
      handleCreat(){
        this.countDisabled = true;
        this.createdInfoList ={
          name: '',
          projectId: '',
          type: '',
          memo: '',
          timeout: '',
          deadtime: '',
          buttonLabel1: '',
          buttonLabel2: '',
          goUrl1: {},
          goUrl2: {},
          imageList:[
            {
              type: 'PC端',
              url: null,
              show: false
            },
            {
              type: '移动端',
              url: null,
              show: false,
            },
            {
              type: 'TV端',
              url: null,
              show: false
            },
            {
              type: 'pad端',
              url: null,
              show: false
            }
          ],
          outerUrlType: [
            {
              label: 'iPhone端',
              value: 0,
              mask:'iph',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'AndroidPhone端',
              value: 1,
              mask:'aph',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'PC浏览器',
              value: 2,
              mask:'web',
              disabled1: false,
              disabled2: false
            },
            {
              label: '手机浏览器',
              value: 3,
              mask:'wap',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'windows客户端',
              value: 4,
              mask:'clt',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'Mac客户端',
              value: 5,
              mask:'mac',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'AndroidPad端',
              value: 6,
              mask:'apd',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'ipad端',
              value: 7,
              mask:'ipd',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'TV端',
              value: 8,
              mask:'atv',
              disabled1: false,
              disabled2: false
            },
            {
              label: '电视盒子',
              value: 9,
              mask:'box',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'WinPhone端',
              value: 10,
              mask:'wph',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'WinPad端',
              value: 11,
              mask:'wpd',
              disabled1: false,
              disabled2: false
            },
            {
              label: 'flash播放器',
              value: 12,
              mask:'flp',
              disabled1: false,
              disabled2: false
            },
            {
              label: '其它非核心业务终端',
              value: 13,
              mask:'misc',
              disabled1: false,
              disabled2: false
            }
          ],
          /*outerUrlList: [
                {
                  type:'',
                  url:''
                }
              ],*/
          outer: [
            [
              {
                type:'',
                url:''
              }
            ],
            [
              {
                type:'',
                url:''
              }
            ]
          ],
          prizeItemList:[
                  {
                    prizeTypeExtBo: {
                      channel:'',
                      member_day:'',
                      vip_type:'',
                      md5key:''
                    },
                    prizePoolId: '',
                    name: '',
                    memo: '',
                    prizeType: '',
                    probability: '',
                    quantity: '',
                    yuzuan_numbe:'',
                    totalQuantity: '',
                    usedQuantity: 0,
                    displayOrder: '',
                    usedYunZuan: 0,
                    buttonLabel1: '',
                    buttonLabel2: '',
                    goUrl:{},
                    goUrl1:{},
                    goUrl2:{},
                    imageList: [
                        {
                          type: 'PC端',
                          url: null,
                          show: false
                        },
                        {
                          type: '移动端',
                          url: null,
                          show: false,
                        },
                        {
                          type: 'TV端',
                          url: null,
                          show: false
                        },
                        {
                          type: 'pad端',
                          url: null,
                          show: false
                        }
                        ],
                    innerUrlType: [
                {
                  label: 'iPhone端',
                  value: 0,
                  mask:'iph',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'AndroidPhone端',
                  value: 1,
                  mask:'aph',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'PC浏览器',
                  value: 2,
                  mask:'web',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: '手机浏览器',
                  value: 3,
                  mask:'wap',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'windows客户端',
                  value: 4,
                  mask:'clt',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'Mac客户端',
                  value: 5,
                  mask:'mac',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'AndroidPad端',
                  value: 6,
                  mask:'apd',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'ipad端',
                  value: 7,
                  mask:'ipd',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'TV端',
                  value: 8,
                  mask:'atv',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: '电视盒子',
                  value: 9,
                  mask:'box',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'WinPhone端',
                  value: 10,
                  mask:'wph',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'WinPad端',
                  value: 11,
                  mask:'wpd',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: 'flash播放器',
                  value: 12,
                  mask:'flp',
                  disabled1: false,
                  disabled2: false
                },
                {
                  label: '其它非核心业务终端',
                  value: 13,
                  mask:'misc',
                  disabled1: false,
                  disabled2: false
                }
              ],
                    inner: [
                [
                  {
                    type:'',
                    url:''
                  }
                ],
                [
                  {
                    type:'',
                    url:''
                  }
                ],
                [
                  {
                    type:'',
                    url:''
                  }
                ]
              ],

                    prizeData:[],

                    prizeItem_prizePoolType:''
                  }
                  ]
        };
        if(!this.handleMask){
          this.handleMask = true;
        }
        this.showModal = true;
        this.apiUrl = 'create_prize_pool';
      },
      handleCancle(){
        this.showModal = false;
        this.apiUrl = '' ;
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
        this.query_prizePool_list()
      },
      getType(){
        const _this = this;
        _this.refshLoading = true;
        api.get('get_prize_type_idAndName')
            .then((res) => {
              if(res.code === 200) {
                _this.refshLoading = false;
                res.data.forEach(item => {
                  _this.innerTypeList.push({
                    label: item.name,
                    value: item.id
                  })
                });

              }
            }).catch((err) => {
              _this.$Message.error({
                content: err.message || '刷新失败',
                duration: 3
              })
        })
      },
      showSelect(type){
        const _this = this;
        //console.log(type);
        api.get('get_pool_type',{prizeType:type}).
            then((res) =>{
              if(res.code === 200) {
                res.data.forEach(item => {
                  _this.prizePoolTypeList.push({
                    label: item.name,
                    value: item.id
                  })
                });

                //console.log( _this.prizePoolTypeList);

              }
            })
      },
      urlRender(backUrl,upUrl){
        //console.log('未渲染前的前台url');
        let backUrlArr = [];
        for (let key in backUrl) {
          //console.log(key  + ':' + backUrl[key]);
          if(backUrl[key]){
            backUrlArr.push(backUrl[key])
          }
        }
        //console.log('-----------backUrlArr-----------');
        //console.log(backUrlArr);
        if(backUrlArr === []){
          //console.log(upUrl);
          upUrl.push({type:'', url:''});
          //console.log(upUrl);
        } else {
          Object.keys(backUrl).forEach((key) => {
            // backUrl  = {ipd:'',iph:'',wap:'',.......,apd:null}
            // 后台返回的字段 值是 null 默认渲染一条空数据
            // 后台返回的字段 值是 ''
            if(backUrl[key] !=='' && backUrl[key] !== null) {
              //将 key 处理为对应的数字
              let url = backUrl[key];
              switch(key){
                case 'iph':
                  key = 0;
                  upUrl.push({type: key,url:url});
                  break;
                case 'aph':
                  key = 1;
                  upUrl.push({type: key,url:url});
                  break;
                case 'web':
                  key = 2;
                  upUrl.push({type: key,url:url});
                  break;
                case 'wap':
                  key = 3;
                  upUrl.push({type: key,url:url});
                  break;
                case 'clt':
                  key = 4;
                  upUrl.push({type: key,url:url});
                  break;
                case 'mac':
                  key = 5;
                  upUrl.push({type: key,url:url});
                  break;
                case 'apd':
                  key = 6;
                  upUrl.push({type: key,url:url});
                  break;
                case 'ipd':
                  key = 7;
                  upUrl.push({type: key,url:url});
                  break;
                case 'atv':
                  key = 8;
                  upUrl.push({type: key,url:url});
                  break;
                case 'box':
                  key = 9;
                  upUrl.push({type: key,url:url});
                  break;
                case 'wph':
                  key = 10;
                  upUrl.push({type: key,url:url});
                  break;
                case 'wpd':
                  key = 11;
                  upUrl.push({type: key,url:url});
                  break;
                case 'flp':
                  key = 12;
                  upUrl.push({type: key,url:url});
                  break;
                case 'misc':
                  key = 13;
                  upUrl.push({type: key,url:url});
                  break;
              }
            }
          });
        }
        //console.log('----------arr------------');
        //console.log(backUrlArr);
        //console.log('...........前台url渲染后的结果...........')
        //console.log(upUrl);
      },
      validate(value){
        if(value.length>=4){
          this.$Message.error({
            content: '最多输入4个字符',
            duration: 3
          });
        }
      },
      backUrlFormat(backUrl,upUrl,typeList){
        /*//console.log('aaaaa');
        //console.log(upUrl);
        upUrl = this.createdInfoList.outer[0];
        upUrl = [];
        typeList.forEach((item, index) => {
          //item.value 0 1 2 3
          //item.mask iph ipd
          if (backUrl[item.mask]) {
            upUrl.push({
              url: backUrl[item.mask],
              type: item.value
            })
          }
        })
        //console.log(upUrl);
        //console.log(this.createdInfoList.outer)*/
        this.createdInfoList.outer = [
            [
              {
                type: 0,
                url: ''
              }
            ],[
            {
              type: 0,
              url: ''
            }
          ]
        ]
        //console.log(this.createdInfoList);
      },
      // 单个奖品池查看详情
      handlePrizePoolDetail(params) {
        const _this = this;
        //console.log(params);
        _this.$Spin.show();
        api.post('query_prize_pool_detail', null, params).then(res => {
          _this.message = res.message;
          //console.log('后台返回的');
          //console.log(res.data.pool);
          if (res.code === 200) {
            _this.$Spin.hide();
            let data = res.data.pool;
            _this.prizePoolDetail.imageList[0].url = data.imageUrl.web === null?'':data.imageUrl.web;
            _this.prizePoolDetail.imageList[1].url = data.imageUrl.iph === null?'':data.imageUrl.iph;
            _this.prizePoolDetail.imageList[2].url = data.imageUrl.atv === null?'': data.imageUrl.atv;
            _this.prizePoolDetail.imageList[3].url = data.imageUrl.ipd === null?'':data.imageUrl.ipd;
            _this.prizePoolDetail.image1 = data.image1 === null?'':data.image1;
            _this.prizePoolDetail.image2 = data.image2 === null?'':data.image2;
            _this.prizePoolDetail.image3 = data.image3 === null?'':data.image3;
            _this.prizePoolDetail.image4 = data.image4 === null?'':data.image4;

            _this.prizePoolDetail.goUrl1 = data.goUrl1 === null?'':data.goUrl1;
            _this.prizePoolDetail.goUrl2 = data.goUrl2 === null?'':data.goUrl2;
            _this.prizePoolDetail.outer.timeout = data.timeout === null?'':data.timeout;
            _this.prizePoolDetail.id = data.id === null?'': data.id;
            _this.prizePoolDetail.name = data.name === null?'':data.name;
            _this.prizePoolDetail.memo = data.memo === null?'':data.memo;
            _this.prizePoolDetail.endIndex = data.endIndex === null?'':data.endIndex;
            _this.prizePoolDetail.page = data.page === null?1:data.page;
            _this.prizePoolDetail.pageIndex = data.pageIndex === null?0:data.pageIndex;
            _this.prizePoolDetail.pageSize = data.pageSize === null?10:data.pageSize;
            _this.prizePoolDetail.pagingFlag = data.pagingFlag === null?'':data.pagingFlag;
            _this.prizePoolDetail.projectId = data.projectId === null?'':data.projectId;
            //TODO THIS 所属项目
            // _this.prizePoolDetail.projectId = _this.prizePoolDetail.projectId = ?
            _this.prizePoolDetail.rowCount = data.rowCount === null?'':data.rowCount;
            _this.prizePoolDetail.rows = data.rows === null?[]:data.rows;
            _this.prizePoolDetail.sortName = data.sortName === null?'':data.sortName;
            _this.prizePoolDetail.sortOrder = data.sortOrder === null?'':data.sortOrder;
            _this.prizePoolDetail.startIndex = data.startIndex===null?'':data.startIndex;
            _this.prizePoolDetail.taskName = data.taskName === null?'':data.taskName;
            _this.prizePoolDetail.timeout = data.timeout === null?'':data.timeout;
            _this.prizePoolDetail.type = data.type === null?'':data.type;
            _this.prizePoolDetail.typeName = data.typeName ===null?'':data.typeName;
            _this.prizePoolDetail.buttonLabel1 = data.buttonLabel1 === null?'':data.buttonLabel1;
            _this.prizePoolDetail.buttonLabel2 = data.buttonLabel2 === null?'':data.buttonLabel2;
            _this.prizePoolDetail.deadtime = data.deadtime === null?'':utils.dateFormat(data.deadtime,'YYYY-MM-DD hh:mm:ss');
            _this.prizePoolDetail.outer[0] = [];
            _this.prizePoolDetail.outer[1] = [];
            _this.urlRender(data.goUrl1,_this.prizePoolDetail.outer[0],_this.prizePoolDetail.outerUrlType);
            _this.urlRender(data.goUrl2,_this.prizePoolDetail.outer[1],_this.prizePoolDetail.outerUrlType);
            /*后台奖品项*/
            for(let i = 0;i< data.prizeItemList.length;i++) { // 后台奖品项集合
              let dataItem = data.prizeItemList[i]; // 后台每个奖品项
              for(let j =0;j<_this.prizePoolDetail.prizeItemList.length;j++) {
                let prizeItem = _this.prizePoolDetail.prizeItemList[j]; // 前台每个奖品项
                prizeItem.inner[0] = [];
                prizeItem.inner[1] = [];
                prizeItem.inner[2] = [];
                _this.urlRender(dataItem.goUrl,prizeItem.inner[0]);
                _this.urlRender(dataItem.goUrl1,prizeItem.inner[1]);
                _this.urlRender(dataItem.goUrl2,prizeItem.inner[2]);

                prizeItem.imageList.image1 = dataItem.image1 === null?'':dataItem.image1;
                prizeItem.imageList.image2 = dataItem.image2 === null?'':dataItem.image2;
                prizeItem.imageList.image3 = dataItem.image3 === null?'':dataItem.image3;
                prizeItem.imageList.image4 = dataItem.image4 === null?'':dataItem.image4;

                /*_this.backUrlFormat(dataItem.goUrl,prizeItem.inner[0],prizeItem.innerUrlType);
                _this.backUrlFormat(dataItem.goUrl1,prizeItem.inner[1],prizeItem.innerUrlType);
                _this.backUrlFormat(dataItem.goUrl2,prizeItem.inner[2],prizeItem.innerUrlType);
*/
                prizeItem.imageList[0].url = dataItem.imageUrl.web === null?'':dataItem.imageUrl.web;
                prizeItem.imageList[1].url = dataItem.imageUrl.iph === null?'':dataItem.imageUrl.iph;
                prizeItem.imageList[2].url = dataItem.imageUrl.atv === null?'':dataItem.imageUrl.atv;
                prizeItem.imageList[3].url = dataItem.imageUrl.ipd === null?'':dataItem.imageUrl.ipd;
                //console.log('-----------------------yuzuan_uber----------------')
                //console.log('--------json数据-------');
                //console.log(JSON.parse(dataItem.prizeTypeExt).yuzuan_number);
                //prizeItem.yuzuan_number = JSON.parse(dataItem.prizeTypeExt).yuzuan_number;
                prizeItem.buttonLabel1 = dataItem.buttonLabel1 === null ? '' : dataItem.buttonLabel1;
                prizeItem.buttonLabel2 = dataItem.buttonLabel2 === null ? '' : dataItem.buttonLabel2;
                prizeItem.displayOrder = dataItem.displayOrder === null ? '' : dataItem.displayOrder;
                prizeItem.id = dataItem.id === null ? '':dataItem.id;
                prizeItem.memo = dataItem.memo === null ? '' : dataItem.memo;
                prizeItem.name = dataItem.name === null ? '' : dataItem.name;
                prizeItem.usedQuantity = dataItem.usedQuantity === null?'0':dataItem.usedQuantity;
                prizeItem.prizeCouponPoolId = dataItem.prizeCouponPoolId === null?'':dataItem.prizeCouponPoolId;
                prizeItem.prizePoolId = dataItem.prizePoolId === null ? '' : dataItem.prizePoolId;
                prizeItem.prizeRecordId = dataItem.prizeRecordId === null ? '' : dataItem.prizeRecordId;
                prizeItem.prizeType = dataItem.prizeType === null ? '' : dataItem.prizeType;
                prizeItem.probability = dataItem.probability === null ? '' :dataItem.probability ;
                prizeItem.quantity = dataItem.quantity === null ? '' : dataItem.quantity;
                prizeItem.stackTrace = dataItem.stackTrace === null ? '' :dataItem.stackTrace ;
                prizeItem.quantity = dataItem.quantity === null ? '' :dataItem.quantity ;
                prizeItem.totalQuantity = dataItem.totalQuantity === null ? '' :dataItem.totalQuantity ;
                prizeItem.sync = dataItem.sync === null ? '' : dataItem.sync;
                prizeItem.taskExecuteId = dataItem.taskExecuteId === null ? '' :dataItem.taskExecuteId ;
                prizeItem.taskId = dataItem.taskId === null ? '' : dataItem.taskId;
                prizeItem.totalQuantity = dataItem.totalQuantity === null ? '' : dataItem.totalQuantity;
                prizeItem.userId = dataItem.userId === null ? '' :dataItem.userId ;
                prizeItem.user = dataItem.user === null ? '' :dataItem.user ;
                prizeItem.username = dataItem.username === null ?'': dataItem.username;
                for(let index =0;index<dataItem.length;index++){
                  prizeItem.strategy = dataItem[index].strategy === null ? '' : dataItem[index].strategy ;
                  prizeItem.prizeItemmember_day = dataItem[index].prizeItemmember_day === null ? '': dataItem[index].prizeItemmember_day;
                  prizeItem.member_day = dataItem[index].member_day === null ? '':dataItem[index].member_day ;
                  prizeItem.redirect_url = dataItem[index].redirect_url === null ? '':dataItem[index].redirect_url ;
                  prizeItem.yigou_url = dataItem[index].yigou_url === null ? '':dataItem[index].yigou_url ;
                  prizeItem.coupon_pool_id = dataItem[index].coupon_pool_id === null ? '': dataItem[index].coupon_pool_id;
                  prizeItem.vip_type = dataItem[index].vip_type === null ? '': dataItem[index].vip_type;
                  prizeItem.channel = dataItem[index].channel === null ? '':dataItem[index].channel;
                  prizeItem.md5key = dataItem[index].md5key === null ? '': dataItem[index].md5key;
                  prizeItem.bonus_number = dataItem[index].bonus_number === null ? '':dataItem[index].bonus_number;
                }
              }
            }
            //console.log('dssfsfsfsfsf++++++++')
            //console.log(_this.prizePoolDetail);
            _this.createdInfoList = _this.prizePoolDetail;
            //_this.getType();
            //console.log('渲染的');
            //console.log( _this.createdInfoList);
          }
        }).catch(err => {
          _this.$Spin.hide();
          //console.error(err);
          _this.$Message.error({
            content: err.message || '数据查询失败',
            duration: 3
          });
          _this.showModalPrizeType = false;
          _this.$Spin.hide();
        })
      },
      // 更新奖品池
      updatePrizePool() {
        const _this = this;
        _this.$Spin.show();
        /*_this.createdInfo.prizeType = _this.createdInfoList.prizeType;
        _this.createdInfo.deadtime = _this.createdInfoList.deadtime;
        _this.createdInfo.timeout = _this.createdInfoList.timeout;
        _this.createdInfo.projectId = _this.createdInfoList.projectId;
        _this.createdInfo.type = _this.createdInfoList.type;

        _this.createdInfo.name = _this.createdInfoList.name;
        _this.createdInfo.id = _this.createdInfoList.id;

        _this.createdInfo.memo = _this.createdInfoList.memo;
        _this.createdInfo.buttonLabel1 = _this.createdInfoList.buttonLabel1;
        _this.createdInfo.buttonLabel2 = _this.createdInfoList.buttonLabel2;
        for(let i = 0; i< _this.createdInfoList.prizeItemList;i++){
          let prizeItem = _this.createdInfoList.prizeItemList[i];
          for(let j=0;j<_this.createdInfo.prizeItemList;j++){
            let updatePrizeItem = _this.createdInfo.prizeItemList[j];
            updatePrizeItem.name = prizeItem.name;
          }
        }
        conosle.log(_this.createdInfoList.id);*/
        alert('ffsdfs')
        _this.createdInfo=_this.createdInfoList;
        //console.log('更新参数');
        //console.log(_this.createdInfo);
        api.post('update_prize_pool', null, _this.createdInfo).then(res => {
          _this.tableLoading = true;
          _this.message = res.message;
          if (res.code === 200) {
            _this.$Spin.hide();
            const data = res.data;
            _this.Message.success({
              content: '更新成功',
              duration: 3
            })
            _this.createdInfo = data;
            _this.query_prizePool_list();
          }
        }).catch(err => {
          _this.$Spin.hide();
          _this.Message.error({
            content: err.message || '更新失败',
            duration: 3
          })
          _this.$Spin.hide();
        })
      },
      getId(id){
        this.createdInfoList.id = id;
      },
      /* 新增一个url */
      addGoUrl(outer,outerIndex) {
        outer[outerIndex].push({
          url:'',
          type:''
        });
      },
      /* 删除一个url*/
      removeGoUrl(outer,outerIndex,urlIndex,urlList,urlType) {
        let index = urlList[urlIndex].type;
        if(index !== '') {
          let n = outerIndex + 1;
          urlType[index]['disabled' + n] = false;
        }
        outer[outerIndex].splice(urlIndex,1)
      },
      /* 切换 url select*/
      changeOuterUrlType(outer,type,value,index){
        //console.log(this.createdInfoList)
        if (!value && (value !== 0)) return;
        let list = [];
        outer[index].forEach(item => {
          if((item.type === 0) || item.type) {
            list.push(item.type)
          }
        });
        type.forEach(item => {
          if(index === 0){
            item.disabled1 = (list.indexOf(item.value) !== -1);
          } else if (index === 1) {
            item.disabled2 = (list.indexOf(item.value) !== -1);
          } else {
            item.disabled3 = (list.indexOf(item.value) !== -1);
          }
        });
      },
      urlFormat(urlList,len,inner){
        for(let i = 0; i < urlList.length; i++) {
          let n = 0;
          if(len === 2) {
            n = i + 1;
          }
          if (len === 3) {
            if(i===0) {
              n = '';
            } else {
              n = i;
            }
          }
          for(let j = 0; j < urlList[i].length; j++) {
            let item = urlList[i][j];
            let type = item.type;
            if(type !== '') {
              switch(type){
                case 0:
                  inner['goUrl' + n].iph = item.url;
                  break;
                case 1:
                  inner['goUrl' + n].aph = item.url;
                  break;
                case 2:
                  inner['goUrl' + n].web = item.url;
                  break;
                case 3:
                  inner['goUrl' + n].wap = item.url;
                  break;
                case 4:
                  inner['goUrl' + n].clt = item.url;
                  break;
                case 5:
                  inner['goUrl' + n].mac = item.url;
                  break;
                case 6:
                  inner['goUrl' + n].apd = item.url;
                  break;
                case 7:
                  inner['goUrl' + n].ipd = item.url;
                  break;
                case 8:
                  inner['goUrl' + n].atv = item.url;
                  break;
                case 9:
                  inner['goUrl' + n].box = item.url;
                  break;
                case 10:
                  inner['goUrl' + n].wph = item.url;
                  break;
                case 11:
                  inner['goUrl' + n].wpd = item.url;
                  break;
                case 12:
                  inner['goUrl' + n].flp = item.url;
                  break;
                case 13:
                  inner['goUrl' + n].misc = item.url;
                  break;
              }
            }
          }
        }
      },
      // 创建奖品池
      createPool(){
        const _this = this;
        //console.log(_this.createdInfoList);
        if( _this.createdInfoList.id){
          _this.createdInfo.id = _this.createdInfoList.id
        }
        _this.createdInfo.projectId = _this.createdInfoList.projectId || 1;
        _this.urlFormat(_this.createdInfoList.outer,2,_this.createdInfoList);
        _this.createdInfoList.prizeItemList.forEach((item) =>{
          _this.urlFormat(item.inner,3,item);
        });
        let prizeItemList = _this.createdInfoList.prizeItemList;
        // 奖品项

        let outLen=prizeItemList.length;
        for(let i = 0; i < outLen; i++ ) {
          let prizeItem = prizeItemList[i];
          _this.prizeItemListTemplate.push({
            prizePoolId: prizeItem.prizePoolId,
            name: prizeItem.name,
            memo: prizeItem.memo,
            vip_type: prizeItem.vip_type,
            prizeType: prizeItem.prizeType,
            probability: prizeItem.probability,
            quantity: prizeItem.quantity,
            yuzuan_numbe: prizeItem.yuzuan_numbe,
            totalQuantity: prizeItem.totalQuantity,
            usedQuantity: prizeItem.usedQuantity,
            usedYunZuan: prizeItem.usedYunZuan,
            buttonLabel1: prizeItem.buttonLabel1,
            buttonLabel2: prizeItem.buttonLabel2,
            displayOrder: prizeItem.displayOrder,
            prizeCouponPoolId: prizeItem.prizeCouponPoolId,
            goUrl:  prizeItem.goUrl,
            goUrl1: prizeItem.goUrl1,
            goUrl2: prizeItem.goUrl2,
            image1: prizeItem.imageList[0].url,
            image2: prizeItem.imageList[1].url,
            image3: prizeItem.imageList[2].url,
            image4: prizeItem.imageList[3].url,
          })
        }
        _this.createdInfo.prizeItemList = _this.prizeItemListTemplate;
        _this.createdInfo.name = _this.createdInfoList.name;
        _this.createdInfo.type = _this.createdInfoList.type;
        //console.log( _this.createdInfo.type);
        _this.createdInfo.memo = _this.createdInfoList.memo;
        _this.createdInfo.timeout = _this.createdInfoList.timeout;
        _this.createdInfo.deadtime = new Date(_this.createdInfoList.deadtime).getTime();
        _this.createdInfo.buttonLabel1 = _this.createdInfoList.buttonLabel1;
        _this.createdInfo.buttonLabel2 = _this.createdInfoList.buttonLabel2;
        _this.createdInfo.goUrl1 = _this.createdInfoList.goUrl1;
        _this.createdInfo.displayOrder = _this.createdInfoList.displayOrder;
        _this.createdInfo.goUrl2 = _this.createdInfoList.goUrl2;
        _this.createdInfo.image1 = _this.createdInfoList.imageList[0].url;
        _this.createdInfo.image2 = _this.createdInfoList.imageList[1].url;
        _this.createdInfo.image3 = _this.createdInfoList.imageList[2].url;
        _this.createdInfo.image4 = _this.createdInfoList.imageList[3].url;
        /*------------------type--------------------*/
        if(!_this.createdInfo.name) {
          return _this.$Message.error({
            content:'奖品池名称不能为空',
            duration:3
          })
        }
        if(!_this.createdInfoList.timeout) {
          return _this.$Message.error({
            content:'有效期不能为空',
            duration:3
          })
        }
        if(!_this.createdInfoList.deadtime) {
          return _this.$Message.error({
            content:'截至时间不能为空',
            duration:3
          })
        }
        if(!_this.createdInfoList.buttonLabel1.length > 5) {
          return _this.$Message.error({
            content:'最多输入5个字符',
            duration:3
          })
        }
        if(!_this.createdInfoList.buttonLabel2.length > 5) {
          return _this.$Message.error({
            content:'最多输入5个字符',
            duration:3
          })
        }
        if(!_this.createdInfoList.type) {
          return _this.$Message.error({
            content:'奖池类型不能为空',
            duration:3
          })
        }
        _this.$Spin.show();
        //console.log(_this.apiUrl);
        api.post(_this.apiUrl,null,_this.createdInfo)
            .then((res) => {
              if(res.code === 200) {
                _this.message = res.message;
                _this.$Spin.hide();
                this.showModal = false;
                _this.query_prizePool_list();
              }
            }).catch((err) => {
              _this.$Message.error({
                content: err.message || '奖品池创建失败',
                duration: 3
              });
              _this.$Spin.hide();
              //console.error(err);
            })
      },
      // 查询奖品池数据
      query_prizePool_list (flag) {
        const _this = this;
        if(flag) {
          _this.page =1;
          _this.pageSize = 10;
        }
        _this.tableLoading = true;
        const params = {
          id: _this.id,
          name: _this.name,
          type: _this.type,
          page: _this.pageInit,
          pageSize: _this.pageSizeInit,
          sortName: _this.sortName,
          sortOrder: _this.sortOrder
        };
        api.post('query_prize_pool_list', null , params).then((res) => {
          _this.tableLoading = false;
          if(res.code === 200) {
            _this.message = res.message;
            if (res.data) {
              let data = res.data;
              _this.total = data.total;
              let rows = data.rows;
              rows = rows.map((item, index) => {
                item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                item.deadtime=utils.dateFormat(item.deadtime,'YYYY-MM-DD hh:mm:ss');
                item.type = item.type === 2?'单奖品':'多奖品';
                return item;
              });
              _this.rows = rows;
            }
          }
        }).catch((err) => {
          _this.tableLoading = false;
          _this.$Message.error({
            content: err.message || '奖品池数据查询失败',
            duration: 3
          });
        })
      },
      // 新增奖品项
      addPrizeItem(){
        if(this.initCount === 100){
          this.buttonDisabled = true;
        }
        if(this.initCount !== 100) {
          this.initCount = this.initCount + 1;
          this.createdInfoList.prizeItemList.push({
            prizeTypeExtBo:{
              strategy:'',
              yuzuan_number:'',
              member_day:'',
              redirect_url:'',
              yigou_url:'',
              coupon_pool_id:'',
              vip_type:'',
              channel:'',
              md5key:'',
              bonus_number:''
            },
            prizePoolId: '',
            name: '',
            memo: '',
            prizeType: '',
            probability: '',
            quantity: '',
            yuzuan_numbe:'',
            totalQuantity: '',
            usedQuantity: 0,
            displayOrder: '',
            usedYunZuan: 0,
            buttonLabel1: '',
            buttonLabel2: '',
            goUrl:{},
            goUrl1:{},
            goUrl2:{},
            imageList: [
              {
                type: 'PC',
                url: null,
                show: false
              },
              {
                type: 'M',
                url: null,
                show: false,
              },
              {
                type: 'TV',
                url: null,
                show: false
              },
              {
                type: 'PAD',
                url: null,
                show: false
              }
            ],
            innerUrlType: [
              {
                label: 'iPhone端',
                value: 0,
                mask:'iph',
                disabled1: false,
                disabled2: false
              },
              {
                label: 'AndroidPhone端',
                value: 1,
                mask:'aph',
                disabled1: false,
                disabled2: false
              },
              {
                label: 'PC浏览器',
                value: 2,
                mask:'web',
                disabled1: false,
                disabled2: false
              },
              {
                label: '手机浏览器',
                value: 3,
                mask:'wap',
                disabled1: false,
                disabled2: false
              },
              {
                label: 'windows客户端',
                value: 4,
                mask:'clt',
                disabled1: false,
                disabled2: false
              },
              {
                label: 'Mac客户端',
                value: 5,
                mask:'mac',
                disabled1: false,
                disabled2: false
              },
              {
                label: 'AndroidPad端',
                value: 6,
                mask:'apd',
                disabled1: false,
                disabled2: false
              },
              {
                label: 'ipad端',
                value: 7,
                mask:'ipd',
                disabled1: false,
                disabled2: false
              },
              {
                label: 'TV端',
                value: 8,
                mask:'atv',
                disabled1: false,
                disabled2: false
              },
              {
                label: '电视盒子',
                value: 9,
                mask:'box',
                disabled1: false,
                disabled2: false
              },
              {
                label: 'WinPhone端',
                value: 10,
                mask:'wph',
                disabled1: false,
                disabled2: false
              },
              {
                label: 'WinPad端',
                value: 11,
                mask:'wpd',
                disabled1: false,
                disabled2: false
              },
              {
                label: 'flash播放器',
                value: 12,
                mask:'flp',
                disabled1: false,
                disabled2: false
              },
              {
                label: '其它非核心业务终端',
                value: 13,
                mask:'misc',
                disabled1: false,
                disabled2: false
              }
            ],
            inner: [
              [],
              [],
              []
            ],
            prizeData:[],
            prizeItem_prizePoolType:''
          })
        }
      },
      // 删除奖品项
      deletePrizeItem(index){
        if(this.initCount === 100) {
          this.buttonDisabled = false;
        }
        if(this.initCount >= 2){
          this.initCount = this.initCount - 1;
          this.createdInfoList.prizeItemList.splice(index,1);
        }
      },
      changePage (n) {
        this.page = n;
        this.query_prizePool_list()
      },
      changePageSize (n) {
        this.pageSize = n;
        if (this.pageSize == 1) {
          this.query_prizePool_list()
        }
      },
      removeUrl(item,index,id,imgList) {
        let number = index;
        number = number + 1;
        let image = 'image' +  number;
        this.$set(imgList[index],image,'');
        document.getElementById(id).value = '';
        item.url = '';
        item.show = false;
      },
      selectFile(item,index,id,imgList) {
        const _this = this;
        let inputFile = document.getElementById(id);
        if (inputFile.files && inputFile.files.length) {
          let file = inputFile.files[0];
          if (file.size > 300000) {
            inputFile.value = '';
            return _this.$Message.warning({
              content: '图片大小必须小于300KB',
              duration: 3
            });
          }
          let fileType = file.type.split('/')[1].toLowerCase();
          if (['jpeg', 'jpg', 'png', 'gif'].indexOf(fileType) === -1) {
            _this.removeUrl('img');
            return _this.$Message.warning({
              content: '图片格式只支持jpg/png/gif',
              duration: 3
            });
          }
          let number = index;
          number = number + 1;
          let image = 'image' +  number;

          _this.$set(imgList[index],image,file);
          let reader = new FileReader();
          reader.readAsDataURL(file); // 将文件读取为DataUrl
          reader.onload = function () {
            item.url = reader.result;
          };
        }
      },
      // 展示奖品类型
      getPrizeTypeDisplay(){
        const  _this = this;
        _this.$Spin.show();
        api.post('get_prize_type')
            .then((res) =>{
              _this.$Spin.hide();
              _this.showModalPrizeType = true;
              _this.message = res.message;
              if(res.code === 200) {
                if (res.data){
                  let data = res.data;
                  data.forEach((item,index) =>{
                    item.firstName = item.name;
                    item.name = item.name;
                    _this.focusList.push(false);
                    if(item.displayFlag === 0){
                      item.displayMask = true
                    } else {
                      item.displayMask = false;
                    }
                    return item;
                  })
                  _this.prizeTypeDisplayBos = data;
                  //console.log(_this.prizeTypeDisplayBos);
                }
              }
            }).catch((err) => {
          _this.$Spin.hide();
          _this.$Message.error({
            content: err.message || '奖品分类查询失败',
            duration: 3
          });
        })
      },
      // checkbox状态切换
      /*checkPrizeTypeItem(value,item,index){
        //console.log(value);
        //console.log(index);
        if (value[0]) {
          this.prizeTypeDisplayBos.push(
              {
                id: item.id,
                name: item.name,
                displayFlag: item.displayFlag === '展示' ? 0 : 1,
                prizeTypeId: item.prizeTypeId,
                displayOrder: item.displayOrder
              }
          )
          //console.log(this.prizeTypeDisplayBos);
        }else{
          this.prizeTypeDisplayBos.splice(index,1);
          //console.log(this.prizeTypeDisplayBos);
        }
      },*/
      // 取消更新奖品类型
      cancelUpdatePrizeType(){
        this.showModalPrizeType = false;
        this.prizeTypeDisplayBos = null;
      },
      // 更新奖品类型
      updatePrizeTypeDisplay(){
        const _this = this;
        //console.log(_this.prizeTypeDisplayBos);
        let checkedState = '';
        for(let i = 0;i < _this.prizeTypeDisplayBos.length; i++){
          let item = _this.prizeTypeDisplayBos[i];
          item.displayFlag = item.displayMask === true ? 0:1;
          if(item.name.length > 4 ) {
            checkedState = item.name + ' - 长度最多4个字符';
            _this.$Message.error({
              content: checkedState,
              duration: 3
            })
            break
          }
          if(item.displayMask && item.name === '' ) {
            checkedState = item.firstName + ' - 分类名称不能为空';
            _this.$Message.error({
              content: checkedState,
              duration: 3
            })
            break
          }
          if(item.displayMask && item.displayOrder === null) {
            checkedState = item.name + ' - 勾选后内容不能为空 ';
            _this.$Message.error({
              content: checkedState,
              duration: 3
            })
            break
          }
        }
        if(!checkedState){
          api.post('update_prize_type', null,{prizeTypeDisplayBos: _this.prizeTypeDisplayBos})
              .then((res) => {
                _this.message = res.message;
                if(res.code === 200) {
                  _this.$Message.success({
                    content: '数据更新成功',
                    duration: 3
                  });
                  _this.showModalPrizeType = false;
                  _this.query_prizePool_list();
                }
              }).catch(err => {
            //console.error(err);
            _this.$Message.error({
              content: err.message || '数据更新失败',
              duration: 3
            });
            _this.showModalPrizeType = false;
          })
        }
      }
    },
    computed:{
      pageInit (){
        let page = this.page;
        return page
      },
      pageSizeInit (){
        let pageSize = this.pageSize;
        return pageSize
      }

    },
    created () {
      this.$store.commit('updatePathName');
    },
    mounted () {
      if (window.location.href.split('?')[1] === 'type=create') {
        this.showModal = true;
      }
      this.getType();
      this.query_prizePool_list('init')
    }
  }
</script>

<style lang="less" scoped>
  .prizePool {
    .header {
      margin-top: 5px;
      .select{
        width: 100px;
        margin: 0 5px 5px 0;
      }
      .input{
        width: 180px;
        margin: 0 5px 5px 0
      }
      .button{
        margin: 0 5px 5px 0;
      }
      .button-search{
        margin: 0 5px 5px 0;
      }
    }
    .page {
      text-align: center;
      font-size: 12px;
      margin-top: 10px;
    }
  }
  .content {
    max-height: 500px;
    overflow-y: auto;
    p {
      margin-bottom: 10px;
      span {
        display: inline-block;
        width: 90px;
      }
    }
    .uploadImg {
      position: relative;
      display: inline-block;
      width: 22%;
      vertical-align: top;
    }
    .uploadCoverImg {
      display: inline-block;
      width: 100px;
      height: 100px;
      border: 1px dashed #ccc;
      position: relative;
      transition: 200ms;
      &:hover {
        border-color: dodgerblue;
      }
      b, input {
        display: inline-block;
        width: 100%;
        height: 100%;
        position: absolute;
        opacity: 0;
        z-index: 10;
        left: 0;
        top: 0;
      }
      img {
        max-width: 100%;
        max-height: 100%;
      }
      video {
        max-width: 100%;
        max-height: 100%;
      }
      .mask {
        background-color: rgba(0, 0, 0, .3);
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 100;
        line-height: 100px;
        text-align: center;
        color: #fff;
      }
    }
  }
</style>

