<template>
  <div class="interface">
    <!--第三方接口列表-->
    <Table :columns="dataList" :data="data" border></Table>
  </div>
</template>

<script>
  export default {
    name: "Interface",
    data() {
      return {
        host: '',
        dataList: [
          {
            title: '接口名称',
            key: 'name',
            width: 200
          },
          {
            title: '接口地址',
            key: 'link',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  attrs: {
                    href: 'javascript:;'
                  },
                  on: {
                    click: function () {
                      window.open(params.row.link, '_blank');
                    }
                  }
                }, params.row.link)
              ]);
            }
          }
        ],
        data: [
          {
            name: '领取新人礼包',
            link: this.host + '/test/vipaa/rceivewelfare.do'
          },
          {
            name: '新人礼包权限',
            link: this.host + '/test/vipaa/validatenewpersonwelfare.do'
          },
          {
            name: '领取新人礼包',
            link: this.host + '/test/vipaa/rceivewelfare.do'
          },
          {
            name: '签到',
            link: this.host + '/test/ugs/sign.do'
          },
          {
            name: '观看5个视频',
            link: this.host + '/test/ugs/video.do'
          },
          {
            name: '升级一账通',
            link: this.host + '/test/pptv/isupgrade.do'
          },
          {
            name: 'username查userid',
            link: this.host + '/test/pptv/querypostid.do'
          },
          {
            name: '测试易购优惠券',
            link: this.host +'/test2/spes.do'
          },
          {
            name: '测试球星卡',
            link: this.host +'/test2/fscdcs.do'
          },
          {
            name: '黑名单查询接口',
            link: this.host + '/test/minos.do?userid='
          },
          {
            name: '苏宁会员中心查询绑定手机号',
            link: this.host + '/test/getBindMobile.do?userid='
          }
        ]
      }
    },
    beforeCreate() {
      this.host = window.location.protocol + '//' + window.location.host;
    },
    created() {
      this.$store.commit('updatePathName');
    },
  }
</script>

<style scoped lang="less">

</style>
