<template>
  <div class="clearRedis">
    <Table :columns="dataList" :data="data" border></Table>
  </div>
</template>

<script>
  export default {
    name: "ClearRedis",
    data() {
      return {
        host:'',
        loading: false,
        dataList: [
          {
            title: '类别',
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
            name: '根据key清空redis缓存',
            link: this.host + '/operation/redis/deleteByKey.do?key='
          }
        ]
      }
    },
    beforeCreate() {
      this.host = window.location.protocol + '//' + window.location.host;
    },
    created() {
      this.$store.commit('updatePathName');
    }
  }
</script>

<style scoped lang="less">

</style>
