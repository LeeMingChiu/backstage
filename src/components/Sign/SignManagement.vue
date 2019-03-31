<style lang="less" scoped>
  .signManagement {
    height: 100%;
    font-size: 12px;
    p {
      margin-bottom: 5px;

      &:last-child {
        margin-bottom: 0;
      }

      span {
        display: inline-block;
        width: 80px;
        text-align: right;
      }
    }
    .uploadImg {
      position: relative;
      display: inline-block;
      width: 33.33%;
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
    .collapse {
      span {
        width: 100px;
      }
    }
    textarea {
      padding: 5px 7px;
      border-radius: 5px;
      border-color: #ddd;
      color: #515a6e;
    }
    textarea::-webkit-input-placeholder {
      color: #c5c8ce;
    }
    textarea:-moz-placeholder {
      color: #c5c8ce;
    }
    textarea::-moz-placeholder {
      color: #c5c8ce;
    }
    textarea:-ms-input-placeholder {
      color: #c5c8ce;
    }
    .leftImg {
      width: 114px;
      height: 34px;
    }
    .rightImg {
      width: 121px;
      height: 32px;
    }
  }
</style>
<template>
  <div class="signManagement">
    <Card :style="{'height:':'100%'}">
      <p style="margin-bottom: 10px;">
        <router-link to="/sign/timing?type=2">
          <Button style="margin: 0 5px 5px 0" type="primary">签到定时</Button>
        </router-link>
      </p>
      <!-- <p style="position: relative;left:-18px;"><span
         style="margin-left:20px;display: inline;">
       </span>定时生效时间：
         <DatePicker :options="options3" format="yyyy-MM-dd HH:mm:ss" v-model="effectiveDate" type="datetime" clearable
                     style="width: 200px;"></DatePicker>
       </p>-->
      <p style="margin-top:20px;">
        <span>项目标题：</span>
        <Input :maxlength="16-body.memo.length" v-model="body.title" placeholder="项目名称加项目描述不超过16个汉字"
               clearable style="width: 220px; margin-left: 20px;"/>
        <span style="margin-left: 20px;">项目描述：</span>
        <Input :maxlength="16-body.title.length" v-model="body.memo" placeholder="项目名称加项目描述不超过16个汉字"
               clearable style="width: 220px; margin-left: 20px;"/>
        <span style="margin-left:50px;">
          <span style="color: red; width: 5px; position: relative; top: 2px;">*</span>
          补签云钻数
        </span>
        <InputNumber v-model="body.suppleSignNum" :step="1" clearable style="width:90px; margin-left: 20px;"
                     :min="1" :max="31" @on-change="intLimit"></InputNumber>
      </p>
      <p style="margin:20px auto;">
        <span>奖品池设置</span>
        <span style="width: 200px; margin:0 160px; text-align: center">普通签到</span>
        <span style="width: 200px; margin: 0 20px; text-align: center">宝箱签到</span>
      </p>
      <!--普通签到 和 宝箱签到-->
      <p v-for="(item, index) in prizePoolBody" :key="index">
        <span>{{item.text}}</span>
        <Select v-model="item.prize.general"
                filterable :disabled="item.selectedDisabled"
                style="width:200px; margin: 0 160px;"
                @on-change="selectSignType(item,index)">
          <!--修改对应select的值-->
          <Option v-for="(i, index) in prizePoolList" :value="i.value" :key="index + 11">{{ i.label }}</Option>
        </Select>
        <Select v-model="item.prize.box"
                filterable
                :disabled="item.selectedDisabled"
                style="width:200px; margin: 0 20px;"
                @on-change="selectSignType(item,index)">
          <Option v-for="(l, index) in prizePoolList" :value="l.value" :key="index + 12">{{ l.label }}</Option>
        </Select>
      </p>
      <!--签到图片-->
      <p style="font-size: 14px;margin:20px auto; padding-left:20px;">
        <span style="color: red; width: 5px; position: relative; top: 2px;">*</span>
        宝箱图片
        <span
          style="color: red; width: 600px; font-size: 12px; text-align: left">（注：图片格式：png、jpg、gif，尺寸比例：1:1）</span>
      </p>
      <!--打开 关闭 关闭可领取 三种状态-->
      <!--[
        {url:'',show:'',type:'',file:''}
      ]-->
      <div style="width:84%;padding-left:25px;box-sizing: border-box">
        <div class="uploadImg" style="margin-bottom: 10px;" v-for="(item, index) in coverImgObj.prizePool" :key="index">
          <span style="display: inline-block;margin-right:10px;vertical-align: top;"
                :style="{paddingLeft: index ? '10px' : ''}">{{item.label}}</span>
          <div class="uploadCoverImg" @mousemove="item.show = true" @mouseleave="item.show = false">
            <Icon type="ios-camera" size="30" v-if="!item.url" style="float: left"></Icon>
            <input type="file" :id="item.type" @change="selectFile(item,item.type)">
            <img :src="item.url" alt="" :id="item.type + index" style="min-width:100%;max-width:100%">
            <div class="mask" :style="{display: (item.url && item.show) ? 'inline-block' : 'none'}">
              <Icon size="30" type="ios-trash-outline" style="cursor: pointer"
                    @click="deleteImgUrl(item,item.type + index,item.type)"></Icon>
            </div>
          </div>
        </div>
      </div>
      <!--左文案-->
      <p style="margin-bottom: 20px;margin-top:20px;">
        <span style="width:150px;text-align: left">签到弹窗左按钮文案</span>
        <Input v-model="body.signInPrizeExt.leftButtonLable" placeholder="不超过6个汉字" :maxlength="6" clearable
               style="width:120px;"/>
      </p>
      <!--左文案 跳转地址-->
      <p style="font-size: 14px;"> (弹窗左按钮)跳转地址：<span
        style="color:red;display: inline">（注：支持锚点链接。左按钮不配置时居中显示）</span></p>
      <p v-for="(item, index) in body.leftGourlList" :key="index + 300">
        <Select v-model="item.value" style="width: 200px" @on-change="updateGoUrl(item, 'left', body, index)">
          <Option v-for="item in body.leftTypeList" :disabled="item.disabled" :value="item.value"
                  :key="item.value + 100">{{ item.label }}
          </Option>
        </Select>
        <Input v-model="item.url" clearable style="width: 490px;"/>
        <Icon style="font-size: 20px; cursor: pointer;" type="ios-add-circle-outline" v-if="!index"
              @click="addGoUrl(item,'left',body)"/>
        <Icon style="font-size: 20px; cursor: pointer; color: red;" type="ios-close" v-if="index"
              @click="removeGoUrl(item,'left',body,index)"/>
      </p>
      <!--签到左按钮图片-->
      <p style="font-size: 14px;margin:20px auto;">
        签到弹窗左按钮图片
        <span style="color: red; width: 600px; font-size: 12px; text-align: left">（注：图片格式：png、jpg、gif， 移动端签到弹窗：114x34 PC端签到弹窗：121x32）</span>
      </p>
      <div style="width:84%;padding-left:25px;box-sizing: border-box">
        <div class="uploadImg" style="margin-bottom: 10px;" v-for="(item, index) in coverImgObj.leftImgList"
             :key="index + 1">
          <span style="display: inline-block;margin-right:10px;vertical-align: top;"
                :style="{paddingLeft: index ? '10px' : '',position: 'relative',top:'4px'}">{{item.label}}</span>
          <div class="uploadCoverImg" @mousemove="item.show = true" @mouseleave="item.show = false"
               :style="{borderRadius:index === 0 ? '17.5px' : '16.5px',textAlign:'center',width: index === 0 ? '112px' :'119px',height: index === 0 ? '35px':'33px'}">
            <Icon type="ios-camera" size="28" v-if="!item.url" style="position: relative;top:2px;"></Icon>
            <input type="file" :id="item.type" @change="selectFile(item,item.type)">
            <img :src="item.url" alt="" :id="item.type + index">
            <div class="mask" :style="{display: (item.url && item.show) ? 'inline-block' : 'none'}">
              <Icon size="26" type="ios-trash-outline"
                    style="font-size: 26px;cursor: pointer;position: relative;top: -35px;left: -2px;"
                    @click="deleteImgUrl(item,item.type + index,item.type)"></Icon>
            </div>
          </div>
        </div>
      </div>
      <!--右文案-->
      <p style="margin-bottom: 20px;margin-top:20px;">
        <span style="width:150px;text-align: left">
          <span style="color:red;display: inline"></span>
          签到弹窗右按钮文案
        </span>
        <Input v-model="body.signInPrizeExt.rightButtonLable" placeholder="不超过6个汉字" :maxlength="6" clearable
               style="width:120px;"/>
      </p>
      <!--右文案 跳转地址-->
      <p style="font-size: 14px;"> (弹窗右按钮)跳转地址：<span
        style="color:red;display: inline">（注：支持锚点链接。右按钮不配置时居中显示）</span></p>
      <p v-for="(item, index) in body.rightGourlList" :key="index + 500">
        <Select v-model="item.value" style="width: 200px" @on-change="updateGoUrl(item, 'right', body, index)">
          <Option v-for="item in body.rightTypeList" :disabled="item.disabled" :value="item.value"
                  :key="item.value + 100">{{ item.label }}
          </Option>
        </Select>
        <Input v-model="item.url" clearable style="width: 490px;"/>
        <Icon style="font-size: 20px; cursor: pointer;" type="ios-add-circle-outline" v-if="!index"
              @click="addGoUrl(item,'right',body)"/>
        <Icon style="font-size: 20px; cursor: pointer; color: red;" type="ios-close" v-if="index"
              @click="removeGoUrl(item,'right',body,index)"/>
      </p>
      <!--签到右按钮图片-->
      <p style="font-size: 14px;margin:20px auto;">
        <span style="color: red; width: 5px; position: relative; top: 2px;"></span>
        签到弹窗右按钮图片
        <span style="color: red; width: 600px; font-size: 12px; text-align: left;">（注：图片格式PNG / JPG / GIF， 移动端签到弹窗：114x34   PC端签到弹窗：121x32）</span>
      </p>
      <div style="width:84%;padding-left:25px;box-sizing: border-box">
        <div class="uploadImg" style="margin-bottom: 10px;" v-for="(item, index) in coverImgObj.rightImgList"
             :key="index + 2">
          <span style="display: inline-block;margin-right:10px;vertical-align: top;"
                :style="{paddingLeft: index ? '10px' : '',position: 'relative',top:'4px'}">{{item.label}}</span>
          <div class="uploadCoverImg" @mousemove="item.show = true" @mouseleave="item.show = false"
               :style="{borderRadius:index === 0 ? '17.5px' : '16.5px',textAlign:'center',width: index === 0 ? '112px' :'119px',height: index === 0 ? '35px':'33px'}">
            <Icon type="ios-camera" size="28" v-if="!item.url" style="position: relative;top:2px;"></Icon>
            <input type="file" :id="item.type" @change="selectFile(item,item.type)">
            <img :src="item.url" alt="" :id="item.type + index">
            <div class="mask" :style="{display: (item.url && item.show) ? 'inline-block' : 'none'}">
              <Icon size="26" type="ios-trash-outline"
                    style="font-size: 26px;cursor: pointer;position: relative;top: -35px;left: -2px;"
                    @click="deleteImgUrl(item,item.type + index,item.type)"></Icon>
            </div>
          </div>
        </div>
      </div>
      <p style="text-align: center;margin:20px auto">
        <Button type="primary" @click="submit">提交</Button>
        <!--  <Button type="primary" @click="submit">同步</Button>-->
      </p>
      <p style="text-align: center;margin:40px auto">备注：奖品池配置当晚11：30生效</p>
    </Card>
  </div>
</template>

<script>
  import api from '../../libs/API'
  import utils from '../../libs/utils'

  export default {
    name: "SignManagement",
    data() {
      return {
        SelectedDisabled: null,
        options3: {
          disabledDate(date) {
            // date 时间值
            let datePickerDate = new Date(date).getTime();
            let nowDate = new Date().getTime();
            if (datePickerDate < nowDate) {
              return true
            } else {
              let weekDay = date.getDay();
              if (weekDay === 1) { // 周一
                return false
              }
              return true
            }
          }
        },
        // 签到图片
        coverImgObj: {

          leftGourl:null,
          rightGourl:null,
          prizePool: [
            {
              label: '打开状态',
              type: 'boxOpen',
              url: null,
              show: false,
              file: null
            },
            {
              label: '关闭状态',
              type: 'boxClose',
              url: null,
              show: false,
              file: null
            },
            {
              label: '关闭可领取状态（gif图）',
              type: 'boxReceiveClose',
              url: null,
              show: false,
              file: null
            }
          ],
          leftImgList: [
            {
              label: '移动端签到弹窗',
              type: 'leftPhoPrize',
              url: null,
              show: false,
              file: null
            },
            {
              label: 'PC端签到弹窗',
              type: 'leftWeb',
              url: null,
              show: false,
              file: null
            }
          ],
          rightImgList: [
            {
              label: '移动端签到弹窗',
              type: 'rightPhoPrize',
              url: null,
              show: false,
              file: null
            },
            {
              label: 'PC端签到弹窗',
              type: 'rightWeb',
              url: null,
              show: false,
              file: null
            }
          ]
        },
        body: {
          id: '', // 更新传
          title: '',
          memo: '',
          suppleSignType: 2,
          suppleSignNum: null,
          effectiveDate: '',
          monday: {
            general: '',
            box: '',
          },
          tuesday: {
            general: '',
            box: ''
          },
          wednesday: {
            general: '',
            box: ''
          },
          thursday: {
            general: '',
            box: ''
          },
          friday: {
            general: '',
            box: ''
          },
          saturday: {
            general: '',
            box: ''
          },
          sunday: {
            general: '',
            box: ''
          },
          leftGourlList: [
            {
              value: 0,
              url: null
            }
          ],
          rightGourlList: [
            {
              value: 0,
              url: null
            }
          ],
          leftTypeList: [
            {
              label: 'iPhone端',
              type: 'iph',
              value: 0,
              disabled: true
            },
            {
              label: 'Android端',
              type: 'aph',
              value: 1,
              disabled: false
            },
            {
              label: 'PC浏览器',
              type: 'web',
              value: 2,
              disabled: false
            },
            {
              label: '手机浏览器',
              type: 'wap',
              value: 3,
              disabled: false
            },
            {
              label: 'Windows客户端',
              type: 'clt',
              value: 4,
              disabled: false
            },
            {
              label: 'Mac客户端',
              type: 'mac',
              value: 5,
              disabled: false
            },
            {
              label: 'AndroidPad端',
              type: 'apd',
              value: 6,
              disabled: false
            },
            {
              label: 'iPad端',
              type: 'ipd',
              value: 7,
              disabled: false
            },
            {
              label: 'TV端',
              type: 'atv',
              value: 8,
              disabled: false
            },
            {
              label: '电视盒子',
              type: 'box',
              value: 9,
              disabled: false
            },
            {
              label: 'WinPhone端',
              type: 'wph',
              value: 10,
              disabled: false
            },
            {
              label: 'WinPad端',
              type: 'wpd',
              value: 11,
              disabled: false
            },
            {
              label: 'Flash播放器',
              type: 'flp',
              value: 12,
              disabled: false
            },
            {
              label: '其他（例如：电冰箱、投影仪、微波炉等）',
              type: 'misc',
              value: 13,
              disabled: false
            },
          ],
          rightTypeList: [
            {
              label: 'iPhone端',
              type: 'iph',
              value: 0,
              disabled: true
            },
            {
              label: 'Android端',
              type: 'aph',
              value: 1,
              disabled: false
            },
            {
              label: 'PC浏览器',
              type: 'web',
              value: 2,
              disabled: false
            },
            {
              label: '手机浏览器',
              type: 'wap',
              value: 3,
              disabled: false
            },
            {
              label: 'Windows客户端',
              type: 'clt',
              value: 4,
              disabled: false
            },
            {
              label: 'Mac客户端',
              type: 'mac',
              value: 5,
              disabled: false
            },
            {
              label: 'AndroidPad端',
              type: 'apd',
              value: 6,
              disabled: false
            },
            {
              label: 'iPad端',
              type: 'ipd',
              value: 7,
              disabled: false
            },
            {
              label: 'TV端',
              type: 'atv',
              value: 8,
              disabled: false
            },
            {
              label: '电视盒子',
              type: 'box',
              value: 9,
              disabled: false
            },
            {
              label: 'WinPhone端',
              type: 'wph',
              value: 10,
              disabled: false
            },
            {
              label: 'WinPad端',
              type: 'wpd',
              value: 11,
              disabled: false
            },
            {
              label: 'Flash播放器',
              type: 'flp',
              value: 12,
              disabled: false
            },
            {
              label: '其他（例如：电冰箱、投影仪、微波炉等）',
              type: 'misc',
              value: 13,
              disabled: false
            },
          ],
          signInPrizeExt: {
            leftButtonLable: '',
            leftGourl: {
              iph: '',
              aph: '',
              web: '',
              wap: '',
              clt: '',
              mac: '',
              apd: '',
              ipd: '',
              atv: '',
              box: '',
              wph: '',
              wpd: '',
              flp: '',
              misc: ''
            },
            rightButtonLable: '',
            rightGourl: {
              iph: '',
              aph: '',
              web: '',
              wap: '',
              clt: '',
              mac: '',
              apd: '',
              ipd: '',
              atv: '',
              box: '',
              wph: '',
              wpd: '',
              flp: '',
              misc: ''
            }
          },
          signInImageUrl: {
            leftPhoPrize: '',
            leftWeb: '',
            rightPhoPrize: '',
            rightWeb: '',
            boxOpen: '',
            boxClose: '',
            boxReceiveClose: ''
          },
        },
        prizePoolList: [],
        prizePoolBody: [
          {
            text: '周一',
            prize: {
              general: 0,
              box: 0
            },
            prizePoolList: [
              {
                label: '无奖品',
                value: 0
              }
            ],
            selectedDisabled: false,
          },
          {
            text: '周二',
            prize: {
              general: 0,
              box: 0
            },
            prizePoolList: [
              {
                label: '无奖品',
                value: 0
              }
            ],
            selectedDisabled: false,
          },
          {
            text: '周三',
            prize: {
              general: 0,
              box: 0
            },
            prizePoolList: [
              {
                label: '无奖品',
                value: 0
              }
            ],
            selectedDisabled: false,
          },
          {
            text: '周四',
            prize: {
              general: 0,
              box: 0
            },
            prizePoolList: [
              {
                label: '无奖品',
                value: 0
              }
            ],
            selectedDisabled: false,
          },
          {
            text: '周五',
            prize: {
              general: 0,
              box: 0
            },
            prizePoolList: [
              {
                label: '无奖品',
                value: 0
              }
            ],
            selectedDisabled: false,
          },
          {
            text: '周六',
            prize: {
              general: 0,
              box: 0
            },
            prizePoolList: [
              {
                label: '无奖品',
                value: 0
              }
            ],
            selectedDisabled: false,
          },
          {
            text: '周日',
            prize: {
              general: 0,
              box: 0
            },
            prizePoolList: [
              {
                label: '无奖品',
                value: 0
              }
            ],
            selectedDisabled: false,
          }
        ]
      }
    },
    methods: {
      intLimit() {
        this.body.suppleSignNum = ((this.body.suppleSignNum + '').replace(/[^\d*$]/g, '')) / 1;
        if (this.body.suppleSignNum > 31) {
          this.body.suppleSignNum = 31;
        }
      },
      toCNSTime(timestamp) {
        let d = new Date(timestamp);
        let Y = d.getFullYear();
        let M = d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : '0' + d.getMonth() + 1;
        let D = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
        let hh = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours();
        let mm = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();
        let ss = d.getSeconds() >= 10 ? d.getSeconds() : '0' + d.getSeconds();

        return Y + '-' + M + '-' + D + ' ' + hh + ':' + mm + ':' + ss
      },
      // 奖品池类型设置
      selectSignType(item, index) {
        if (item.text === '周一') {
          this.body.monday.general = item.prize.general;
          this.body.monday.box = item.prize.box;
        }
        if (item.text === '周二') {
          this.body.tuesday.general = item.prize.general;
          this.body.tuesday.box = item.prize.box;
        }
        if (item.text === '周三') {
          this.body.wednesday.general = item.prize.general;
          this.body.wednesday.box = item.prize.box;
        }
        if (item.text === '周四') {
          this.body.thursday.general = item.prize.general;
          this.body.thursday.box = item.prize.box;
        }
        if (item.text === '周五') {
          this.body.friday.general = item.prize.general;
          this.body.friday.box = item.prize.box;
        }
        if (item.text === '周六') {
          this.body.saturday.general = item.prize.general;
          this.body.saturday.box = item.prize.box;
        }
        if (item.text === '周日') {
          this.body.sunday.general = item.prize.general;
          this.body.sunday.box = item.prize.box;
        }
      },
      // 获取签到数据
      handlerQueryData() {
        const _this = this;
        this.$Spin.show();
        api.get('query_signIn_data', {type: 1})
            .then((res) => {
              if (res.code === 200) {
                this.$Spin.hide();
                let data = res.data;
                if (!data.effectiveDate) { // 根据时间的有无来渲染数据
                  return
                } else {
                  _this.body.effectiveDate = new Date(data.effectiveDate).getTime();
                  if (data.id) {
                    _this.body.id = data.id;
                    if (this.body.id) {
                      let day = new Date().getDay();
                      if (day === 0) {  // 周天
                        _this.prizePoolBody[0].selectedDisabled = true;
                        _this.prizePoolBody[1].selectedDisabled = true;
                        _this.prizePoolBody[2].selectedDisabled = true;
                        _this.prizePoolBody[3].selectedDisabled = true;
                        _this.prizePoolBody[4].selectedDisabled = true;
                        _this.prizePoolBody[5].selectedDisabled = true;
                        _this.prizePoolBody[6].selectedDisabled = true;
                      }
                      if (day === 1) {  // 周一
                        _this.prizePoolBody[0].selectedDisabled = true;
                      }
                      if (day === 2) { // 2 周二
                        _this.prizePoolBody[0].selectedDisabled = true;
                        _this.prizePoolBody[1].selectedDisabled = true;
                      }
                      if (day === 3) { // 3 周三
                        _this.prizePoolBody[0].selectedDisabled = true;
                        _this.prizePoolBody[1].selectedDisabled = true;
                        _this.prizePoolBody[2].selectedDisabled = true;
                      }
                      if (day === 4) { // 4 周四
                        _this.prizePoolBody[0].selectedDisabled = true; // 2
                        _this.prizePoolBody[1].selectedDisabled = true; // 3
                        _this.prizePoolBody[2].selectedDisabled = true; // 4
                        _this.prizePoolBody[3].selectedDisabled = true; // 4
                      }
                      if (day === 5) { // 5 周五
                        _this.prizePoolBody[0].selectedDisabled = true; // 2
                        _this.prizePoolBody[1].selectedDisabled = true; // 3
                        _this.prizePoolBody[2].selectedDisabled = true; // 4
                        _this.prizePoolBody[3].selectedDisabled = true; // 5
                        _this.prizePoolBody[4].selectedDisabled = true; // 5
                      }
                      if (day === 6) { // 6 周六
                        _this.prizePoolBody[0].selectedDisabled = true; // 2
                        _this.prizePoolBody[1].selectedDisabled = true; // 3
                        _this.prizePoolBody[2].selectedDisabled = true; // 4
                        _this.prizePoolBody[3].selectedDisabled = true; // 5
                        _this.prizePoolBody[4].selectedDisabled = true; // 6
                        _this.prizePoolBody[5].selectedDisabled = true; // 6
                      }
                    }
                  }
                  _this.body.title = data.title;
                  _this.body.memo = data.memo;
                  _this.body.suppleSignType = data.suppleSignType;
                  _this.body.suppleSignNum = data.suppleSignNum;
                  // 奖品池配置
                  if (data.monday) {
                    _this.prizePoolBody[0].prize.general = data.monday.general;
                    _this.prizePoolBody[0].prize.box = data.monday.box;
                    _this.body.monday.general = data.monday.general;
                    _this.body.monday.box = data.monday.box;
                  }
                  if (data.tuesday) {
                    _this.prizePoolBody[1].prize.general = data.tuesday.general;
                    _this.prizePoolBody[1].prize.box = data.tuesday.box;
                    _this.body.tuesday.general = data.tuesday.general;
                    _this.body.tuesday.box = data.tuesday.box;
                  }
                  if (data.wednesday) {
                    _this.prizePoolBody[2].prize.general = data.wednesday.general;
                    _this.prizePoolBody[2].prize.box = data.wednesday.box;
                    _this.body.wednesday.general = data.wednesday.general;
                    _this.body.wednesday.box = data.wednesday.box;
                  }
                  if (data.thursday) {
                    _this.prizePoolBody[3].prize.general = data.thursday.general;
                    _this.prizePoolBody[3].prize.box = data.thursday.box;
                    _this.body.thursday.general = data.thursday.general;
                    _this.body.thursday.box = data.thursday.box;
                  }
                  if (data.friday) {
                    _this.prizePoolBody[4].prize.general = data.friday.general;
                    _this.prizePoolBody[4].prize.box = data.friday.box;
                    _this.body.friday.general = data.friday.general;
                    _this.body.friday.box = data.friday.box;
                  }
                  if (data.saturday) {
                    _this.prizePoolBody[5].prize.general = data.saturday.general;
                    _this.prizePoolBody[5].prize.box = data.saturday.box;
                    _this.body.saturday.general = data.saturday.general;
                    _this.body.saturday.box = data.saturday.box;
                  }
                  if (data.sunday) {
                    _this.prizePoolBody[6].prize.general = data.sunday.general;
                    this.prizePoolBody[6].prize.box = data.sunday.box;
                    _this.body.sunday.general = data.sunday.general;
                    _this.body.sunday.box = data.sunday.box;
                  }
                  // 图片渲染
                  if (data.signInImageUrl) {
                    if (data.signInImageUrl.boxOpen) {
                      _this.coverImgObj.prizePool[0].url = data.signInImageUrl.boxOpen;
                      _this.coverImgObj.prizePool[0].show = false;
                      _this.body.signInImageUrl.boxOpen = data.signInImageUrl.boxOpen;
                    }
                    if (data.signInImageUrl.boxClose) {
                      _this.coverImgObj.prizePool[1].url = data.signInImageUrl.boxClose;
                      _this.coverImgObj.prizePool[1].show = false;
                      _this.body.signInImageUrl.boxClose = data.signInImageUrl.boxClose;
                    }
                    if (data.signInImageUrl.boxReceiveClose) {
                      _this.coverImgObj.prizePool[2].url = data.signInImageUrl.boxReceiveClose;
                      _this.coverImgObj.prizePool[2].show = false;
                      _this.body.signInImageUrl.boxReceiveClose = data.signInImageUrl.boxReceiveClose;
                    }
                    if (data.signInImageUrl.leftPhoPrize) {
                      _this.coverImgObj.leftImgList[0].url = data.signInImageUrl.leftPhoPrize;
                      _this.coverImgObj.leftImgList[0].show = false;
                      _this.body.signInImageUrl.leftPhoPrize = data.signInImageUrl.leftPhoPrize;
                    }
                    if (data.signInImageUrl.leftWeb) {
                      _this.coverImgObj.leftImgList[1].url = data.signInImageUrl.leftWeb;
                      _this.coverImgObj.leftImgList[1].show = false;
                      _this.body.signInImageUrl.leftWeb = data.signInImageUrl.leftWeb;
                    }
                    if (data.signInImageUrl.rightPhoPrize) {
                      _this.coverImgObj.rightImgList[0].url = data.signInImageUrl.rightPhoPrize;
                      _this.coverImgObj.rightImgList[0].show = false;
                      _this.body.signInImageUrl.rightPhoPrize = data.signInImageUrl.rightPhoPrize;
                    }
                    if (data.signInImageUrl.rightWeb) {
                      _this.coverImgObj.rightImgList[1].url = data.signInImageUrl.rightWeb;
                      _this.coverImgObj.rightImgList[1].show = false;
                      _this.body.signInImageUrl.rightWeb = data.signInImageUrl.rightWeb;
                    }
                  }
                  // 扩展字段
                  if (data.signInPrizeExt) {
                    let signInPrizeExt = data.signInPrizeExt;
                    // 左文案
                    if (signInPrizeExt.leftButtonLable) {
                      _this.body.signInPrizeExt.leftButtonLable = signInPrizeExt.leftButtonLable;
                    }
                    // 右文案
                    if (signInPrizeExt.rightButtonLable) {
                      _this.body.signInPrizeExt.rightButtonLable = signInPrizeExt.rightButtonLable;
                    }
                    // 左url
                    if (signInPrizeExt.leftGourl) {
                      _this.body.leftTypeList = [
                        {
                          label: 'iPhone端',
                          type: 'iph',
                          value: 0,
                          disabled: true
                        },
                        {
                          label: 'Android端',
                          type: 'aph',
                          value: 1,
                          disabled: false
                        },
                        {
                          label: 'PC浏览器',
                          type: 'web',
                          value: 2,
                          disabled: false
                        },
                        {
                          label: '手机浏览器',
                          type: 'wap',
                          value: 3,
                          disabled: false
                        },
                        {
                          label: 'Windows客户端',
                          type: 'clt',
                          value: 4,
                          disabled: false
                        },
                        {
                          label: 'Mac客户端',
                          type: 'mac',
                          value: 5,
                          disabled: false
                        },
                        {
                          label: 'AndroidPad端',
                          type: 'apd',
                          value: 6,
                          disabled: false
                        },
                        {
                          label: 'iPad端',
                          type: 'ipd',
                          value: 7,
                          disabled: false
                        },
                        {
                          label: 'TV端',
                          type: 'atv',
                          value: 8,
                          disabled: false
                        },
                        {
                          label: '电视盒子',
                          type: 'box',
                          value: 9,
                          disabled: false
                        },
                        {
                          label: 'WinPhone端',
                          type: 'wph',
                          value: 10,
                          disabled: false
                        },
                        {
                          label: 'WinPad端',
                          type: 'wpd',
                          value: 11,
                          disabled: false
                        },
                        {
                          label: 'Flash播放器',
                          type: 'flp',
                          value: 12,
                          disabled: false
                        },
                        {
                          label: '其他（例如：电冰箱、投影仪、微波炉等）',
                          type: 'misc',
                          value: 13,
                          disabled: false
                        },
                      ];
                      var count = 0;
                      for (let key in signInPrizeExt.leftGourl) {
                        let item = signInPrizeExt.leftGourl[key]; // =>url
                        if (item !== null && item !== undefined && item !== '') {
                          count = count + 1;
                        }
                      }
                      if (count !== 0) {
                        _this.body.leftGourlList = [];
                        let leftGourlList = signInPrizeExt.leftGourl;
                        let value = null
                        for (let key in leftGourlList) {
                          value = key === 'iph' ? 0 :
                              key === 'aph' ? 1 :
                                  key === 'web' ? 2 :
                                      key === 'wap' ? 3 :
                                          key === 'clt' ? 4 :
                                              key === 'mac' ? 5 :
                                                  key === 'apd' ? 6 :
                                                      key === 'ipd' ? 7 :
                                                          key === 'atv' ? 8 :
                                                              key === 'box' ? 9 :
                                                                  key === 'wph' ? 10 :
                                                                      key === 'wpd' ? 11 :
                                                                          key === 'flp' ? 12 :
                                                                              13;
                          if (leftGourlList[key]) {
                            _this.body.leftGourlList.push(
                                {
                                  value: value,
                                  url: leftGourlList[key]
                                }
                            )
                          }
                        }
                        let list = [];
                        _this.body.leftGourlList.forEach(l => {
                          if (l.value || (l.value === 0)) {
                            list.push(l.value)
                          }
                        });
                        _this.body.leftTypeList.forEach(n => {
                          n.disabled = (list.indexOf(n.value) !== -1);
                        })
                      } else {
                        _this.body.leftGourlList = [
                          {
                            value: 0,
                            url: ''
                          }
                        ];
                      }

                    }
                    // 右url
                    if (signInPrizeExt.rightGourl) { // 返回右按钮地址链接
                      _this.body.rightTypeList = [
                        {
                          label: 'iPhone端',
                          type: 'iph',
                          value: 0,
                          disabled: true
                        },
                        {
                          label: 'Android端',
                          type: 'aph',
                          value: 1,
                          disabled: false
                        },
                        {
                          label: 'PC浏览器',
                          type: 'web',
                          value: 2,
                          disabled: false
                        },
                        {
                          label: '手机浏览器',
                          type: 'wap',
                          value: 3,
                          disabled: false
                        },
                        {
                          label: 'Windows客户端',
                          type: 'clt',
                          value: 4,
                          disabled: false
                        },
                        {
                          label: 'Mac客户端',
                          type: 'mac',
                          value: 5,
                          disabled: false
                        },
                        {
                          label: 'AndroidPad端',
                          type: 'apd',
                          value: 6,
                          disabled: false
                        },
                        {
                          label: 'iPad端',
                          type: 'ipd',
                          value: 7,
                          disabled: false
                        },
                        {
                          label: 'TV端',
                          type: 'atv',
                          value: 8,
                          disabled: false
                        },
                        {
                          label: '电视盒子',
                          type: 'box',
                          value: 9,
                          disabled: false
                        },
                        {
                          label: 'WinPhone端',
                          type: 'wph',
                          value: 10,
                          disabled: false
                        },
                        {
                          label: 'WinPad端',
                          type: 'wpd',
                          value: 11,
                          disabled: false
                        },
                        {
                          label: 'Flash播放器',
                          type: 'flp',
                          value: 12,
                          disabled: false
                        },
                        {
                          label: '其他（例如：电冰箱、投影仪、微波炉等）',
                          type: 'misc',
                          value: 13,
                          disabled: false
                        },
                      ];
                      var count = 0;
                      for (let key in signInPrizeExt.rightGourl) {
                        let item = signInPrizeExt.rightGourl[key];
                        if (item !== null && item !== undefined && item !== '') {
                          count = count + 1;
                        }
                      }
                      if (count !== 0) {
                        _this.body.rightGourlList = [];
                        let rightGourlList = signInPrizeExt.rightGourl;
                        for (let key in rightGourlList) {
                          let value = key === 'iph' ? 0 :
                              key === 'aph' ? 1 :
                                  key === 'web' ? 2 :
                                      key === 'wap' ? 3 :
                                          key === 'clt' ? 4 :
                                              key === 'mac' ? 5 :
                                                  key === 'apd' ? 6 :
                                                      key === 'ipd' ? 7 :
                                                          key === 'atv' ? 8 :
                                                              key === 'box' ? 9 :
                                                                  key === 'wph' ? 10 :
                                                                      key === 'wpd' ? 11 :
                                                                          key === 'flp' ? 12 :
                                                                              13;
                          if (rightGourlList[key]) {
                            _this.body.rightGourlList.push(
                                {
                                  value: value,
                                  url: rightGourlList[key]
                                }
                            )
                          }
                        }
                        let list = [];
                        _this.body.rightGourlList.forEach(l => {
                          if (l.value || (l.value === 0)) {
                            list.push(l.value)
                          }
                        });
                        _this.body.rightTypeList.forEach(n => {
                          n.disabled = (list.indexOf(n.value) !== -1);
                        })
                      } else {
                        _this.body.rightGourlList = [
                          {
                            value: 0,
                            url: ''
                          }
                        ];
                      }
                    }
                  }
                }
              }
            })
            .catch((err) => {
              _this.$Spin.hide();
              _this.$Message.error({
                content: err.message || '数据获取失败',
                duration: 3
              });
            })
      },
      removeGoUrl(item, type, body, index) {
        if (item.value || (item.value === 0)) {
          body[type + 'TypeList'][item.value].disabled = false;
        }
        if (item.value !== null && item.value !== '') {
          let selectType = item.value === 0 ? 'iph' :
              item.value === 1 ? 'aph' :
                  item.value === 2 ? 'web' :
                      item.value === 3 ? 'wap' :
                          item.value === 4 ? 'clt' :
                              item.value === 5 ? 'mac' :
                                  item.value === 6 ? 'apd' :
                                      item.value === 7 ? 'ipd' :
                                          item.value === 8 ? 'atv' :
                                              item.value === 9 ? 'box' :
                                                  item.value === 10 ? 'wph' :
                                                      item.value === 11 ? 'wpd' :
                                                          item.value === 12 ? 'flp' :
                                                              'misc';
          body.signInPrizeExt[type + 'Gourl'][selectType] = '';
        }
        body[type + 'GourlList'].splice(index, 1);
        this.$forceUpdate();
      },
      updateGoUrl(item, type, body, index) {
        body = JSON.parse(JSON.stringify(body));
        body[type + 'GourlList'][index].url = null;
        let list = [];
        body[type + 'GourlList'].forEach(i => {
          if (i.value || (i.value === 0)) {
            list.push(i.value)
          }
        });
        body[type + 'TypeList'].forEach(j => {
          j.disabled = (list.indexOf(j.value) !== -1);
        });
        this.body = body;
      },
      addGoUrl(item, type, body) {
        if (body[type + 'GourlList'].length === 14) {
          return
        }
        if (type === 'left') {
          this.body.leftGourlList.push({
            value: null,
            url: null
          })
        } else {
          this.body.rightGourlList.push({
            value: null,
            url: null
          })
        }
        this.$forceUpdate();
      },
      // 删除图片
      deleteImgUrl(item, imgId, inputId) {
        const _this = this;
        let input = document.getElementById(inputId);
        let img = document.getElementById(imgId);
        let url = img.getAttribute('src');
        input.value = '';
        img.setAttribute('src', '');
        item.url = '';
        item.show = false;
        item.file = '';
        /*if (_this.body.id) {
          let data = {
            id: _this.body.id,
            imageType: url
          };
          api.post('signInPrize_delImage', null, data)
              .then((res) => {
                if (res.code === 200) {
                  input.value = '';
                  img.setAttribute('src', '');
                  item.url = '';
                  item.show = false;
                  _this.$Message.success({
                    content: '图片删除成功',
                    duration: 3
                  });
                }
              })
              .catch((err) => {
                _this.$Message.error({
                  content: err.message || '图片删除失败',
                  duration: 3
                });
              });
        } else {
          // 直接删除
          input.value = '';
          img.setAttribute('src', '');
          item.url = '';
          item.show = false;
        }*/
      },
      // 图片上传
      selectFile(item, id) {
        const _this = this;
        let inputFile = document.getElementById(id);
        if (inputFile.files && inputFile.files.length) {
          let file = inputFile.files[0];
          let fileType = file.type.split('/')[1].toLowerCase();
          if (['jpeg', 'jpg', 'png', 'gif'].indexOf(fileType) === -1) {
            return _this.$Message.warning({
              content: '图片格式只支持jpg/png/gif',
              duration: 3
            });
          }
          // 校验图片比例
          let imgFlag = true;
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            let img = new Image();
            img.src = reader.result;
            img.onload = function () {
              const W = img.width, H = img.height;
              const RATE = W / H;
              if (id === 'boxOpen' || id === 'boxClose' || id === 'boxReceiveClose') {
                if (RATE !== 1) {
                  _this.$Message.error({
                    content: '请上传尺寸比例为1:1的图片',
                    duration: 3
                  });
                  imgFlag = false;
                  inputFile.value = '';
                  item.url = '';
                  item.file = '';
                  return
                } else {
                  imgFlag = true;
                }
              }
              if (id === 'leftPhoPrize' || id === 'rightPhoPrize') {
                if (W !== 114 && H !== 34) {
                  _this.$Message.error({
                    content: '请上传134*34px的图片',
                    duration: 3
                  });
                  imgFlag = false;
                  inputFile.value = '';
                  item.url = '';
                  item.file = '';
                  return
                } else {
                  imgFlag = true;
                }
              }
              if (id === 'leftWeb' || id === 'rightWeb') {
                if (W !== 121 && H !== 32) {
                  _this.$Message.error({
                    content: '请上传121*32px的图片',
                    duration: 3
                  });
                  imgFlag = false;
                  inputFile.value = '';
                  item.url = '';
                  item.file = '';
                  return
                } else {
                  imgFlag = true;
                }
              }
              if (imgFlag) {
                item.url = reader.result;
                item.file = file;
                var form = new FormData();
                form.append('base64String', item.url);
                api.post('image_upload', null, form)
                    .then((res) => {
                      if (res.code === 200) {
                        item.url = res.data;
                      }
                    })
                    .catch((err) => {
                      this.$Message.error({
                        content: err.message || '图片地址获取失败',
                        duration: 3
                      });
                    })
              }
            }

          };
        }
      },
      // 获取奖品池类型
      getPrizePoolType() {
        const _this = this;
        api.get('query_prizePool_id_and_name')
            .then((res) => {
              if (res.code === 200) {
                let list = [
                  {
                    label: '无奖品',
                    value: 0
                  }
                ];
                res.data.forEach(item => {
                  list.push({
                    label: item.name,
                    value: item.id / 1
                  })
                });
                _this.prizePoolList = list;
              }
            })
            .catch((err) => {
              this.$Message.error({
                content: err.message || '获取奖品池类型失败',
                duration: 3
              });
            })
      },
      // url格式化
      /*paramsUrlFormat(gourlList, urlList) {
        console.log(gourlList)
        // 过滤空字段
        for (let i = gourlList.length - 1; i >= 0; i--) {
          let item = gourlList[i];
          if (item.value === null || item.value === undefined || item.value === '') {
            gourlList.splice(i, 1)
          }
        }
        let type = null;
        gourlList.forEach((item) => {
          type = item.value === 0 ? 'iph' :
              item.value === 1 ? 'aph' :
                  item.value === 2 ? 'web' :
                      item.value === 3 ? 'wap' :
                          item.value === 4 ? 'clt' :
                              item.value === 5 ? 'mac' :
                                  item.value === 6 ? 'apd' :
                                      item.value === 7 ? 'ipd' :
                                          item.value === 8 ? 'atv' :
                                              item.value === 9 ? 'box' :
                                                  item.value === 10 ? 'wph' :
                                                      item.value === 11 ? 'wpd' :
                                                          item.value === 12 ? 'flp' :
                                                              'misc';
          urlList[type] = item.url;
        });
      },*/

      /*paramsUrlFormat(type, gourlList, urlList) {
        // 过滤空字段
        gourlList = JSON.parse(JSON.stringify(gourlList));
        urlList = JSON.parse(JSON.stringify(urlList));
        for (let i = gourlList.length - 1; i >= 0; i--) {
          let item = gourlList[i];
          if (item.value === null || item.value === undefined || item.value === '') {
            gourlList.splice(i, 1)
          }
        }
        let _type = null;
        gourlList.forEach((item) => {
          _type = item.value === 0 ? 'iph' :
              item.value === 1 ? 'aph' :
                  item.value === 2 ? 'web' :
                      item.value === 3 ? 'wap' :
                          item.value === 4 ? 'clt' :
                              item.value === 5 ? 'mac' :
                                  item.value === 6 ? 'apd' :
                                      item.value === 7 ? 'ipd' :
                                          item.value === 8 ? 'atv' :
                                              item.value === 9 ? 'box' :
                                                  item.value === 10 ? 'wph' :
                                                      item.value === 11 ? 'wpd' :
                                                          item.value === 12 ? 'flp' :
                                                              'misc';
          urlList[_type] = item.url;
        });
        this.body[type + 'GourlList'] = gourlList;
        this.body.signInPrizeExt[type + 'Gourl'] = urlList;
        console.log(this.body.signInPrizeExt.leftGourl)
      },*/

      paramsUrlFormat(body, gourlList, gourl) {
        // 过滤空字段
        body = JSON.parse(JSON.stringify(body));
        for (let i = body[gourlList].length - 1; i >= 0; i--) {
          let item = body[gourlList][i];
          if (item.value === null || item.value === undefined || item.value === '') {
            body[gourlList].splice(i, 1)
          }
        }
        let _type = null;
        body[gourlList].forEach((item) => {
          _type = item.value === 0 ? 'iph' :
              item.value === 1 ? 'aph' :
                  item.value === 2 ? 'web' :
                      item.value === 3 ? 'wap' :
                          item.value === 4 ? 'clt' :
                              item.value === 5 ? 'mac' :
                                  item.value === 6 ? 'apd' :
                                      item.value === 7 ? 'ipd' :
                                          item.value === 8 ? 'atv' :
                                              item.value === 9 ? 'box' :
                                                  item.value === 10 ? 'wph' :
                                                      item.value === 11 ? 'wpd' :
                                                          item.value === 12 ? 'flp' :
                                                              'misc';
          body[gourl][_type] = item.url;
        });
        this.body = body;
      },
      // 提交
      handlerSubmit() {
        // 奖品池类型参数
        this.prizePoolBody.forEach((item) => {
          if (item.text === '周一') {
            this.body.monday.general = item.prize.general;
            this.body.monday.box = item.prize.box;
          }
          if (item.text === '周二') {
            this.body.tuesday.general = item.prize.general;
            this.body.tuesday.box = item.prize.box;
          }
          if (item.text === '周三') {
            this.body.wednesday.general = item.prize.general;
            this.body.wednesday.box = item.prize.box;
          }
          if (item.text === '周四') {
            this.body.thursday.general = item.prize.general;
            this.body.thursday.box = item.prize.box;
          }
          if (item.text === '周五') {
            this.body.friday.general = item.prize.general;
            this.body.friday.box = item.prize.box;
          }
          if (item.text === '周六') {
            this.body.saturday.general = item.prize.general;
            this.body.saturday.box = item.prize.box;
          }
          if (item.text === '周天') {
            this.body.sunday.general = item.prize.general;
            this.body.sunday.box = item.prize.box;
          }
        })
      },
      switchValue(value) {
        switch (value) {
          case 'iph':
            value = 0;
            break;
          case 'aph':
            value = 1;
            break;
          case 'web':
            value = 2;
            break;
          case 'wap':
            value = 3;
            break;
          case 'clt':
            value = 4;
            break;
          case 'mac':
            value = 5;
            break;
          case 'apd':
            value = 6;
            break;
          case 'ipd':
            value = 7;
            break;
          case 'atv':
            value = 8;
            break;
          case 'box':
            value = 9;
            break;
          case 'wph':
            value = 10;
            break;
          case 'wpd':
            value = 11;
            break;
          case 'flp':
            value = 12;
            break;
          default:
            value = 13;
            break;
        }
      },
      switchCNSStr(value, type) {
        switch (value) {
          case 0:
            type = 'iph';
            break;
          case 1:
            type = 'aph';
            break;
          case 2:
            type = 'web';
            break;
          case 3:
            type = 'wap';
            break;
          case 4:
            type = 'clt';
            break;
          case 5:
            type = 'mac';
            break;
          case 6:
            type = 'apd';
            break;
          case 7:
            type = 'ipd';
            break;
          case 8:
            type = 'atv';
            break;
          case 9:
            type = 'box';
            break;
          case 10:
            type = 'wph';
            break;
          case 11:
            type = 'wpd';
            break;
          case 12:
            type = 'flp';
            break;
          default:
            type = 'misc';
            break;
        }
        return type;
      },
      urlAssign(flag) {
        let body = JSON.parse(JSON.stringify(this.body));
        let gourlList = body[flag + 'GourlList'];
        let urlList = body['signInPrizeExt'][flag + 'Gourl'];
        gourlList.forEach((item) => {
          if (item.value !== null && item.value !== '' && item.value !== undefined) {
            var type = null;
            type = this.switchCNSStr(item.value, type);
            urlList[type] = item.url;
          }
        });
        return body.signInPrizeExt[flag + 'Gourl']
      },
      // 提交 同步
      submit() {
        this.body.signInImageUrl.boxOpen = this.coverImgObj.prizePool[0].url;
        this.body.signInImageUrl.boxClose = this.coverImgObj.prizePool[1].url;
        this.body.signInImageUrl.boxReceiveClose = this.coverImgObj.prizePool[2].url;
        this.body.signInImageUrl.leftPhoPrize = this.coverImgObj.leftImgList[0].url;
        this.body.signInImageUrl.leftWeb = this.coverImgObj.leftImgList[1].url;
        this.body.signInImageUrl.rightPhoPrize = this.coverImgObj.rightImgList[0].url;
        this.body.signInImageUrl.rightWeb = this.coverImgObj.rightImgList[1].url;
        if (!this.body.suppleSignNum) {
          return this.$Message.warning({
            content: '补签云钻数不能为空',
            duration: 3
          });
        }
        if (!this.body.signInImageUrl.boxOpen) {
          return this.$Message.warning({
            content: '宝箱打开状态的图片不能为空',
            duration: 3
          });
        }
        if (!this.body.signInImageUrl.boxClose) {
          return this.$Message.warning({
            content: '宝箱关闭状态的图片不能为空',
            duration: 3
          });
        }
        if (!this.body.signInImageUrl.boxReceiveClose) {
          return this.$Message.warning({
            content: '宝箱关闭可领取状态的图片不能为空',
            duration: 3
          });
        }
        /*if (!this.body.signInPrizeExt.rightButtonLable) {
          return this.$Message.warning({
            content: '签到弹窗右按钮文案不能为空',
            duration: 3
          });
        }*/
        /*this.paramsUrlFormat(this.body.leftGourlList, this.body.signInPrizeExt.leftGourl);
        this.paramsUrlFormat(this.body.rightGourlList, this.body.signInPrizeExt.rightGourl);*/
        //this.paramsUrlFormat(this.body,'leftGourlList', 'leftGourl');
        //this.paramsUrlFormat(this.body,'rightGourlList', 'rightGourl');
        /*let count = 0;
        for (let key in this.body.signInPrizeExt.rightGourl) {
          if (!this.body.signInPrizeExt.rightGourl[key]) {
            count = count + 1;
          }
        }
        if (count === 14) {
          return this.$Message.warning({
            content: '弹窗右按钮跳转地址不能为空',
            duration: 3
          });
        }*/
        /*if (!this.body.signInImageUrl.rightPhoPrize) {
          return this.$Message.warning({
            content: '移动端签到弹窗图片不能为空',
            duration: 3
          });
        }
        if (!this.body.signInImageUrl.rightWeb) {
          return this.$Message.warning({
            content: 'PC端签到弹窗图片不能为空',
            duration: 3
          });
        }*/
        this.body.monday.general = this.prizePoolBody[0].prize.general;
        this.body.monday.box = this.prizePoolBody[0].prize.box;
        this.body.tuesday.general = this.prizePoolBody[1].prize.general;
        this.body.tuesday.box = this.prizePoolBody[1].prize.box;
        this.body.wednesday.general = this.prizePoolBody[2].prize.general;
        this.body.wednesday.box = this.prizePoolBody[2].prize.box;
        this.body.thursday.general = this.prizePoolBody[3].prize.general;
        this.body.thursday.box = this.prizePoolBody[3].prize.box;
        this.body.friday.general = this.prizePoolBody[4].prize.general;
        this.body.friday.box = this.prizePoolBody[4].prize.box;
        this.body.saturday.general = this.prizePoolBody[5].prize.general;
        this.body.saturday.box = this.prizePoolBody[5].prize.box;
        this.body.sunday.general = this.prizePoolBody[6].prize.general;
        this.body.sunday.box = this.prizePoolBody[6].prize.box;
        let body = {
          id: this.body.id, // 更新传
          title: this.body.title,
          memo: this.body.memo,
          suppleSignType: 2,
          suppleSignNum: this.body.suppleSignNum,
          effectiveDate: this.body.effectiveDate,
          monday: this.body.monday,
          tuesday: this.body.tuesday,
          wednesday: this.body.wednesday,
          thursday: this.body.thursday,
          friday: this.body.friday,
          saturday: this.body.saturday,
          sunday: this.body.sunday,
          signInPrizeExt: {
            leftButtonLable: this.body.signInPrizeExt.leftButtonLable,
            leftGourl:this.urlAssign('left'),
            rightButtonLable: this.body.signInPrizeExt.rightButtonLable,
            rightGourl: this.urlAssign('right')
          },
          signInImageUrl: this.body.signInImageUrl,
        };
        console.log(body)
        this.$Spin.show();
        api.post('signInPrize_save', null, body)
            .then((res) => {
              if (res.code === 200) {
                this.$Spin.hide();
                this.$Message.success({
                  content: '提交成功',
                  duration: 3
                });
                this.handlerQueryData();
              }
            })
            .catch((err) => {
              this.$Spin.hide();
              this.$Message.error({
                content: err.message || '提交失败',
                duration: 3
              });
            })
      },
    },
    created() {
      this.$store.commit('updatePathName');
      this.getPrizePoolType();
      this.handlerSubmit();
      this.handlerQueryData();
    }
  }
</script>

