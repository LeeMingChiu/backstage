<template>
  <div class="prizeCompensate" style="margin-bottom: 5px;">
    <div class="header" @keyup.enter="query_fail_list('init')">
      <Input v-model="id" clearable placeholder="记录编码" style="width:65px; margin: 0 5px 5px 0"/>
      <Input v-model="userId" clearable placeholder="用户ID" style="width:55px; margin: 0 5px 5px 0"/>
      <Input v-model="prizeRecordId" clearable placeholder="奖品记录ID" style="width:80px; margin: 0 5px 5px 0"/>
      <Input v-model="username" clearable placeholder="pptv用户名" style="width:75px; margin: 0 5px 5px 0"/>
      <DatePicker
        v-model="beginTime"
        type="datetime"
        placeholder="开始时间"
        clearable
        style="width:152px; margin: 0 5px 5px 0; vertical-align: top;"
      ></DatePicker>
      <DatePicker
        v-model="endTime"
        type="datetime"
        placeholder="结束时间"
        clearable
        style="width:152px; margin: 0 5px 5px 0; vertical-align: top;"
      ></DatePicker>
      <!--  奖品项类型 -->
      <Select
        clearable
        v-model="prizeType"
        style="width: 100px; margin: 0 5px 5px 0"
        placeholder="奖品项类型">
        <Option
          v-for="item in prizeTypeList"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}
        </Option>
      </Select>
      <!--补偿调用状态-->
      <Select
        clearable
        v-model="state"
        style="width: 110px; margin: 0 5px 5px 0"
        placeholder="补偿调用状态">
        <Option
          v-for="item in stateList"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}
        </Option>
      </Select>
      <!--风险标识-->
      <Select
        clearable
        v-model="riskFlag"
        style="width:85px; margin: 0 5px 5px 0"
        placeholder="风险标识">
        <Option
          v-for="item in riskFlagList"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}
        </Option>
      </Select>
      <!--库存还原表示-->
      <Select
        clearable
        v-model="quantityState"
        style="width: 110px; margin: 0 5px 5px 0"
        placeholder="库存还原标识">
        <Option
          v-for="item in quantityStateList"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}
        </Option>
      </Select>
      <!--调用失败位置-->
      <Select
        clearable
        v-model="invokeLocation"
        style="width: 110px; margin: 0 5px 5px 0"
        placeholder="调用失败位置">
        <Option
          v-for="item in invokeLocationList"
          :value="item.value"
          :key="item.value"
        >{{ item.label }}
        </Option>
      </Select>
      <Button
        class="button-search"
        style="margin-top:-5px;"
        @click="query_fail_list('init')">查找
      </Button>
      <div style="margin-top:15px;margin-bottom:15px">
        <Button type="primary" @click="handleAllCall('batch_compensate')">批量补偿调用</Button>
        <Button type="primary" @click="handleAllCall('batch_recover')">批量库存还原</Button>
      </div>
    </div>
    <Table
      no-data-text=""
      @on-sort-change="sort"
      class="table"
      :loading="tableLoading"
      border
      :data="rows"
      height="500"
      :columns="columns">
    </Table>
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
    <Modal v-model="messageShow" title="内容详情" @on-ok="ok" @on-cancel="cancel">
      <p style="word-wrap:break-word;white-space: normal">{{infoDetails}}</p>
    </Modal>
  </div>
</template>

<script>
  import api from '../../libs/API'
  import utils from "../../libs/utils"

  export default {
    name: "PrizeCompensate",
    data() {
      return {
        messageShow: false,
        tableLoading: false,
        showDetail: false,

        tipInfo: '',


        infoDetails: '',

        total: 0,
        page: 1,
        pageSize: 10,
        sortOrder: 'DESC',
        sortName: 'id',//  true 排序字段名

        id: '',
        username: '',
        userId: '',	//选填	用户一账通id
        prizeRecordId: '',	//选填	奖品记录id


        beginTime: '',	//选填	开始时间
        endTime: '',	//选填	结束时间

        time: null,


        state: '',	//选填	状态 0未调用 1调用成功 2调用失败
        stateList: [
          {
            label: '未调用',
            value: 0
          },
          {
            label: '调用成功',
            value: 1
          },
          {
            label: '调用失败',
            value: 2
          }
        ],
        tipMessage: '',
        riskFlag: '',	//选填	风险标识 0无风险 1黑名单用户
        riskFlagList: [
          {
            label: '无风险',
            value: 0
          },
          {
            label: '黑名单',
            value: 1
          }
        ],

        successInfo: '',

        mask: '',
        stateMask: '',

        quantityState: '',	//选填	库存还原标识 0未还原 1已还原
        quantityStateList: [
          {
            label: '未还原',
            value: 0
          },
          {
            label: '已还原',
            value: 1
          }
        ],

        invokeLocation: '',	//选填	调用失败位置 0 MQ发送失败 1 MQ消费失败
        invokeLocationList: [
          {
            label: 'MQ发送失败',
            value: 0
          },
          {
            label: 'MQ消费失败',
            value: 1
          }
        ],

        prizeType: '',	//选填	奖品类型
        prizeTypeList: [
          {
            label: '全部',
            value: 999
          },
          {
            label: '球星卡',
            value: 1
          },
          {
            label: '云钻',
            value: 2
          },
          {
            label: '会员',
            value: 3
          },
          {
            label: '实物',
            value: 4
          },
          {
            label: '卡密优惠券',
            value: 5
          },
          {
            label: '易购优惠券',
            value: 6
          },
          {
            label: '二维码优惠券',
            value: 7
          },
          {
            label: '购物津贴',
            value: 11
          },
          {
            label: '新手礼包',
            value: 8
          },
          {
            label: '非任务系统自动发奖',
            value: 9
          }
        ],
        urlTip: '',
        columns: [
          {
            title: '序号',
            key: 'serialNum',
            width: 100,
            fixed: 'left'
          },
          {
            title: '记录编码',
            key: 'id',
            width: 105,
            sortable: true
          },
          {
            title: 'pptv用户名',
            key: 'username',
            width: 130
          },
          {
            title: '任务ID',
            key: 'taskId',
            width: 100
          },
          {
            title: '奖品记录ID',
            key: 'prizeRecordId',
            width: 115
          },
          {
            title: '任务执行记录ID',
            key: 'taskExecuteId',
            width: 130
          },
          {
            title: '用户ID',
            key: 'userId',
            width: 100
          },
          {
            title: '奖品项ID',
            key: 'prizeItemId',
            width: 110
          },
          {
            title: '奖品类型',
            key: 'prizeType',
            width: 90
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 100
          },
          {
            title: '补偿调用状态',
            key: 'state',
            width: 110
          },
          {
            title: '风险标识',
            key: 'riskFlag',
            width: 90
          },
          {
            title: '库存还原标识',
            key: 'quantityState',
            width: 110
          },
          {
            title: '调用失败位置',
            key: 'invokeLocation',
            width: 110
          },
          {
            title: '异常堆栈',
            key: 'failException',
            width: 400,
            render: (h, params) => {
              let texts = '';
              if (params.row.failException !== null) {
                if (params.row.failException.length > 13) {
                  texts = params.row.failException.substring(0, 200) + ".....";
                } else {
                  texts = params.row.failException;
                }
              }
              return h('div', {
                style: {
                  color: '#2d8cf0',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.messageShow = true;
                    this.infoDetails = params.row.failException;
                  }
                }
              }, texts)
            }
          },

          {
            title: '奖品项信息',
            key: 'prizeItemExt',
            width: 400,
            render: (h, params) => {
              let texts = '';
              if (params.row.prizeItemExt !== null) {
                if (params.row.prizeItemExt.length > 13) {
                  texts = params.row.prizeItemExt.substring(0, 200) + ".....";
                } else {
                  texts = params.row.prizeItemExt;
                }
              }
              return h('div', {
                style: {
                  color: '#2d8cf0',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.messageShow = true;
                    this.infoDetails = params.row.prizeItemExt;
                  }
                }
              }, texts)
            }
            /*render: (h, params) => {
              let texts = '';
              if (params.row.prizeItemExt !== null) {
                if (params.row.prizeItemExt.length > 13) {
                  texts = params.row.prizeItemExt.substring(0, 200) + ".....";
                } else {
                  texts = params.row.prizeItemExt;
                }
              }
              return h('div', [
                h('Tooltip', {
                  style: {
                    color: '#2d8cf0',
                    cursor: 'pointer'
                  },
                  props: {
                    transfer: true,
                    maxWidth: 600,
                    whiteSpace: 'normal'
                  }
                },texts, /!*[
                    texts,
                  h('div', {
                    slot: 'content',
                  }, params.row.prizeItemExt)
                ]*!/)
              ]);
            }*/
          },
          {
            title: '请求参数',
            key: 'requestExt',
            width: 400,
            render: (h, params) => {
              let texts = '';
              if (params.row.requestExt !== null) {
                if (params.row.requestExt.length > 13) {
                  texts = params.row.requestExt.substring(0, 200) + ".....";
                } else {
                  texts = params.row.requestExt;
                }
              }
              return h('div', {
                style: {
                  color: '#2d8cf0',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.messageShow = true;
                    this.infoDetails = params.row.requestExt;
                  }
                }
              }, texts)
            }
            /*render: (h, params) => {
              let texts = '';
              if (params.row.requestExt !== null) {
                if (params.row.requestExt.length > 13) {
                  texts = params.row.requestExt.substring(0, 200) + ".....";
                } else {
                  texts = params.row.requestExt;
                }
              }
              return h('div', [
                h('Tooltip', {
                  style: {
                    color: '#2d8cf0',
                    cursor: 'pointer'
                  },
                  props: {
                    transfer: true,
                    maxWidth: 600,
                    whiteSpace: 'normal'
                  }
                }, [
                  texts,
                  h('div', {
                    slot: 'content',
                  }, params.row.requestExt)
                ])
              ]);
            }*/
          },
          {
            title: '返回参数',
            key: 'responseExt',
            width: 400,
            render: (h, params) => {
              let texts = '';
              if (params.row.responseExt !== null) {
                if (params.row.responseExt.length > 13) {
                  texts = params.row.responseExt.substring(0, 200) + ".....";
                } else {
                  texts = params.row.responseExt;
                }
              }
              return h('div', {
                style: {
                  color: '#2d8cf0',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.messageShow = true;
                    this.infoDetails = params.row.responseExt;
                  }
                }
              }, texts)
            }
            /* render: (h, params) => {
               let texts = '';
               if (params.row.responseExt !== null) {
                 if (params.row.responseExt.length > 13) {
                   texts = params.row.responseExt.substring(0, 200) + ".....";
                 } else {
                   texts = params.row.responseExt;
                 }
               }
               return h('div', [
                 h('Tooltip', {
                   style: {
                     color: '#2d8cf0',
                     cursor: 'pointer'
                   },
                   props: {
                     transfer: true,
                     maxWidth: 600,
                     whiteSpace: 'normal'
                   }
                 }, [
                   texts,
                   h('div', {
                     slot: 'content',
                   }, params.row.responseExt)
                 ])
               ]);
             }*/
          },
          {
            title: '接口返回失败信息',
            key: 'failMesssage',
            width: 150
          },
          {
            title: '调用次数',
            key: 'excuteTime',
            width: 90
          },
          {
            title: '操作',
            key: 'action',
            width: 130,
            fixed: 'right',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    display: params.row.prizeType === '新手礼包' ? 'none' : 'inline-block'
                  },
                  on: {
                    click: () => {
                      this.stateMask = params.row.state;
                      this.quantityStateMask = params.row.quantityState;
                      this.handleSingleCall('single_compensate', {id: params.row.id})
                    }
                  }
                }, '补偿'),
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
                      this.quantityStateMask = params.row.quantityState;
                      this.stateMask = params.row.state;
                      this.handleSingleCall('single_recover', {id: params.row.id})
                    }
                  }
                }, '还原')
              ])
            }
          }
        ],
        rows: []
      }

    },
    methods: {
      getPrizeItemType() {
        api.get('get_prize_type_idAndName').then(res => {
          //console.log(res);
          if (res.code === 200) {
            let data = res.data;
            this.prizeTypeList.push({
              label: '全部',
              value: 999
            });
            for (let i = 0; i < data.length; i++) {
              let item = data[i];
              this.prizeTypeList.push({
                label: item.name,
                value: item.id
              })
            }
          }
        }).catch(err => {
          this.$Message.error({
            content: err.message || '奖品类型获取失败',
            duration: 3
          });
        });
      },
      cancel() {
        this.messageShow = false;
      },
      getId(id) {
        this.id = id;
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
        this.query_fail_list();
      },
      // 单个 补偿 还原
      handleSingleCall(url, params) {
        const _this = this;
        _this.$Spin.show();
        let tips = '';
        if (_this.quantityStateMask === '已还原') {
          _this.$Spin.hide();
          tips = '该记录已还原库存！';
          return _this.$Message.warning({
            content: tips,
            duration: 3
          })
        }
        if (_this.stateMask === '调用成功') {
          _this.$Spin.hide();
          tips = '该记录已补偿调用成功！';
          return _this.$Message.warning({
            content: tips,
            duration: 3
          })
        }
        if (!tips) {
          if (url === 'single_compensate') {
            _this.successInfo = '补偿调用成功，请稍后查看补偿调用状态'
          } else {
            _this.successInfo = '库存还原成功，请稍后查看库存还原状态'
          }
          api.post(url, null, params)
              .then((res) => {
                if (res.code === 200) {
                  _this.query_fail_list();
                  _this.$Spin.hide();
                  _this.$Message.success({
                    content: res.message || _this.successInfo,
                    duration: 3
                  })
                }
              }).catch((err) => {
            _this.$Spin.hide();
            _this.$Message.error({
              content: err.message || '调用失败',
              duration: 3
            })
          })
        }
      },
      ok() {
        this.messageShow = false;
      },
      /*批量库存还原 补偿*/
      handleAllCall(url) {
        const _this = this;
        const params = {
          id: _this.id,
          username: _this.username,
          userId: _this.userId,	//
          prizeType: _this.prizeType === 999 ? '' : _this.prizeType,
          prizeRecordId: _this.prizeRecordId,
          state: _this.state,
          riskFlag: _this.riskFlag,
          quantityState: _this.quantityState,
          invokeLocation: _this.invokeLocation,
          beginTime: utils.dateFormat(_this.beginTime, 'YYYY-MM-DD hh:mm:ss'),
          endTime: utils.dateFormat(_this.endTime, 'YYYY-MM-DD hh:mm:ss'),
        };
        if (url === 'batch_compensate') {
          _this.tipMessage = '批量库存还原成功,请稍后查看补偿调用状态'
        } else {
          _this.tipMessage = '批量库存补偿成功，请稍后查看补偿调用状态'
        }
        api.post(url, null, params)
            .then((res) => {
              if (res.code === 200) {
                _this.query_fail_list();
                _this.$Message.success({
                  content: res.message || _this.tipMessage,
                  duration: 3
                });
                _this.query_fail_list();
              }
            }).catch((err) => {
          _this.$Message.error({
            content: err.message || '操作失败',
            duration: 3
          })
        })
      },
      /*批量补偿调用失败*/
      query_fail_list(flag) {
        const _this = this;
        if (flag) {
          _this.page = 1;
          _this.pageSize = 10;
        }
        _this.tableLoading = true;
        api.post('query_fail_list', null, {
          page: _this.page,
          pageSize: _this.pageSize,
          sortName: _this.sortName,
          sortOrder: _this.sortOrder,

          id: _this.id,
          username: _this.username,
          userId: _this.userId,	//
          prizeType: _this.prizeType === 999 ? '' : _this.prizeType,
          prizeRecordId: _this.prizeRecordId,
          state: _this.state,
          riskFlag: _this.riskFlag,
          quantityState: _this.quantityState,
          invokeLocation: _this.invokeLocation,
          beginTime: utils.dateFormat(_this.beginTime, 'YYYY-MM-DD hh:mm:ss'),
          endTime: utils.dateFormat(_this.endTime, 'YYYY-MM-DD hh:mm:ss')
        }).then((res) => {
          if (res.code === 200) {
            _this.tableLoading = false;
            let rows = res.data.rows;
            if (rows.length === 0) {
              _this.$Message.warning({
                content: '未查到相关数据',
                duration: 3
              });
            }
            rows = rows.map((item, index) => {
              item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
              item.awardTime = utils.dateFormat(item.awardTime, 'YYYY-MM-DD hh:mm:ss');
              item.createTime = utils.dateFormat(item.createTime, 'YYYY-MM-DD hh:mm:ss');
              item.invokeLocation = item.invokeLocation === 0 ? 'MQ发送失败' : 'MQ消费失败'
              item.state = item.state === 0 ? '未调用' :
                  item.state === 1 ? '调用成功' :
                      '调用失败';
              item.riskFlag = item.riskFlag === 0 ? '无风险' : '黑名单用户';
              item.invokeLocation = item.invokeLocation === 0 ? ' MQ发送失败' : 'MQ消费失败';
              item.quantityState = item.quantityState === 0 ? '未还原' : '已还原';
              // 匹配类型列表
              /*for (let i = 0; i < _this.prizeTypeList.length; i++) {
                let prizeItem = this.prizeTypeList[i];
                if (prizeItem.value.indexOf(item.prizeType)) {
                  item.prizeType = prizeItem.label;
                }
              }*/
              item.prizeType = item.prizeType === 5 ? '卡密优惠券' :
                  item.prizeType === 6 ? '易购优惠券' :
                      item.prizeType === 7 ? '二维码优惠券' :
                          item.prizeType === 8 ? '新手礼包' :
                              item.prizeType === 9 ? '非任务系统自动发奖' :
                                  item.prizeType === 1 ? '球星卡' :
                                      item.prizeType === 2 ? '云钻' :
                                          item.prizeType === 4 ? '实物' :
                                              item.prizeType === 3 ? '会员' :
                                                  item.prizeType === 12 ? '补签卡' :
                                                      '购物津贴';
              return item;
            });
            _this.rows = rows;
            _this.total = res.data.total;
          }
        }).catch((err) => {
          _this.tableLoading = false;
          _this.$Message.error({
            content: err.message || '数据查询失败',
            duration: 3
          });
        })

      },
      changePage(n) {
        this.page = n;
        this.query_fail_list();
      },
      changePageSize(n) {
        this.pageSize = n;
        if (this.page == 1) {
          this.query_fail_list()
        }
      },
    },
    created() {
      const _this = this;
      this.$store.commit('updatePathName');
      api.get('get_prize_type_idAndName').then(res => {
        //console.log(res);
        let list = [];
        res.data.forEach(item => {
          list.push({
            value: item.id,
            label: (item.name === '不掉接口') ? '非任务系统自动发奖' : item.name
          })
        });
        _this.prizeTypeList = list;
      }).catch(err => {
        //console.error(err);
        _this.$Message.error({
          content: err.message || '奖品类型获取失败',
          duration: 3
        });
      });
    },
    mounted() {
      this.query_fail_list('init')
    }
  }
</script>

<style lang="less" scoped>
  .prizeCompensate {
    .header {
      .button {
        margin: 0 5px 5px 0;
        float: right;
      }
    }
  }
</style>
