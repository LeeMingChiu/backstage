<style lang="less" scoped>
  .clockManagement {
    padding: 10px;
    .mainContent{
      width:1070px;
      margin:0 auto;
      border:1px solid #ccc;
      border-radius:4px;
      padding:50px;
    }
  }
</style>
<template>
  <div class="clockManagement">
    <Card>
      <div style="margin-bottom: 10px;"><Button style="margin: 0 5px 5px 0" type="primary">签到定时</Button></div>
      <div style="margin-bottom:50px;"><Divider/></div>
      <div class="mainContent">
        <Row>
          <Col span="4">
            <span>项目标题：</span>
            <Input
              v-model="params.id"
              clearable
              placeholder="项目名称描述不超过16个汉字"
              style="width: 200px; margin: 0 5px 5px 0"
            />
          </Col>
          <Col span="4">
            <span>项目描述：</span>
            <Input
              v-model="params.id"
              clearable
              placeholder="项目名称描述不超过16个汉字"
              style="width: 200px; margin: 0 5px 5px 0"
            />
            <InputNumber
              :min="0"
              clearable
              placeholder="补签云钻数"
              style="width: 200px; margin: 0 5px 5px 0"
            ></InputNumber>
          </Col>
          <Col span="4">
            <span>补签云钻数：</span>
            <InputNumber
              :min="0"
              clearable
              placeholder="补签云钻数"
              style="width: 200px; margin: 0 5px 5px 0"
            ></InputNumber>
          </Col>
        </Row>
        <div style="margin-left: -65px;">
          <div style="margin:20px 0;text-align: left;">
            <Row>
              <Col span="4">
                <span style="display: inline-block;width:100%;text-align: right">奖品池设置</span>
              </Col>
              <Col span="10">
                <span style="display: inline-block;width:100%;text-align: center;">普通签到</span>
              </Col>
              <Col span="10">
                <span style="display: inline-block;width:100%;text-align: center;">宝箱签到</span>
              </Col>
            </Row>
          </div>
          <Row v-for="(item,index) in weekList" :key="index">
            <Col span="4">
              <span style="display: inline-block;width:100%;text-align: right;">{{item.day}}</span>
            </Col>
            <Col span="10" :style="{'text-align':'center'}">
              <Select clearable style="width:150px; margin: 0 5px 5px 0" :style="{'text-align':'left'}"
                      placeholder="请选择类型" onchange="selectValue(index)">
                <Option v-for="item in defaultClock" :value="item.value" :key="item.value" :style="{'text-align':'left'}">
                  {{ item.label }}
                </Option>
              </Select>
            </Col>
            <Col span="10" :style="{'text-align':'center'}">
              <Select clearable style="width: 150px; margin: 0 5px 5px 0" :style="{'text-align':'left'}"
                      placeholder="请选择类型" onchange="selectValue(index)">
                <Option v-for="item in pandoraBoxClock" :value="item.value" :key="item.value"
                        :style="{'text-align':'left'}">{{ item.label }}
                </Option>
              </Select>
            </Col>
          </Row>
        </div>
        <div style="margin: 20px 0">
          <!--宝箱图片-->
          <div style="font-size: 14px;"><span style="color:red">*</span><span style="color:#BCBCBC;">（注：图片格式PNG/JPG/GIF,图片尺寸100*100px）</span>
          </div>
          <div class="uploadImg" style="margin-bottom: 10px;" v-for="(item, index) in coverImgObj.prizeItem[prizeIndex]"
               :key="index + 1000">
            <span style="display: inline-block; width: 50px; text-align: left; vertical-align: top;"
                  :style="{paddingLeft: index ? '10px' : ''}">{{item.label}}</span>
            <div class="uploadCoverImg" @mousemove="item.show = true" @mouseleave="item.show = false">
              <Icon type="ios-camera" size="30" v-if="!item.url" style="float: left"></Icon>
              <input type="file" :id="item.type + prizeIndex + 'prizeItem' + index"
                     @change="selectFile(item, (item.type + prizeIndex + 'prizeItem' + index))">
              <img :src="item.url" alt="">
              <div class="mask" :style="{display: (item.url && item.show) ? 'inline-block' : 'none'}">
                <Icon size="30" type="ios-trash-outline" style="cursor: pointer"
                      @click.native="removeUrl(item, (item.type + prizeIndex + 'prizeItem' + index), prizeItem)"></Icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  export default {
    name: "ClockManagement",
    data() {
      return {
        // 保存 or 更新 参数
        params: {
          id: '', // 更新传
          suppleSignType: '',
          suppleSignNum: '',
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
          signInPrizeExt: '',
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
          },
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
        weekList: [
          {day: '周一', defaultValue: '', pandoraValue: ''},
          {day: '周二', defaultValue: '', pandoraValue: ''},
          {day: '周三', defaultValue: '', pandoraValue: ''},
          {day: '周四', defaultValue: '', pandoraValue: ''},
          {day: '周五', defaultValue: '', pandoraValue: ''},
          {day: '周六', defaultValue: '', pandoraValue: ''},
          {day: '周日', defaultValue: '', pandoraValue: ''}
        ],
        defaultClock: [
          {
            value: 0,
            label: '周二领云钻'
          },
          {
            value: 1,
            label: '周三领云钻'
          },
          {
            value: 2,
            label: '周四领云钻'
          },
          {
            value: 3,
            label: '周五领云钻'
          }
        ],
        pandoraBoxClock: [
          {
            value: 0,
            label: '周一宝箱奖品'
          },
          {
            value: 1,
            label: '周二宝箱奖品'
          },
          {
            value: 2,
            label: '周三宝箱奖品'
          },
          {
            value: 3,
            label: '周四宝箱奖品'
          }
        ],
        coverImgObj: {
          prizePool: [
            {
              label: 'PC端',
              type: 'web',
              url: null,
              show: false,
              file: null
            },
            {
              label: '移动端',
              type: 'iph',
              url: null,
              show: false,
              file: null
            },
            {
              label: 'TV端',
              type: 'atv',
              url: null,
              show: false,
              file: null
            },
            {
              label: 'Pad端',
              type: 'ipd',
              url: null,
              show: false,
              file: null
            }
          ],
          prizeItem: [
            [
              {
                label: 'PC端',
                type: 'web',
                url: null,
                show: false,
                file: null
              },
              {
                label: '移动端',
                type: 'iph',
                url: null,
                show: false,
                file: null
              },
              {
                label: 'TV端',
                type: 'atv',
                url: null,
                show: false,
                file: null
              },
              {
                label: 'Pad端',
                type: 'ipd',
                url: null,
                show: false,
                file: null
              }
            ]
          ]
        },
        coverImgList: [
          {
            label: 'PC端',
            type: 'web',
            url: null,
            show: false,
            file: null
          },
          {
            label: '移动端',
            type: 'iph',
            url: null,
            show: false,
            file: null
          },
          {
            label: 'TV端',
            type: 'atv',
            url: null,
            show: false,
            file: null
          },
          {
            label: 'Pad端',
            type: 'ipd',
            url: null,
            show: false,
            file: null
          }
        ],
      }
    },
    methods: {
      selectValue(index) {
        console.log(index);
      }
    }
  }
</script>

