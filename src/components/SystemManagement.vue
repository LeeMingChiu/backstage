<template>
    <div class="userinfoManagement">
        <div style="margin-bottom: 5px;" @keyup.enter="query_userinfo_list('init')">
            <Input v-model="id" clearable placeholder="流水编码" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="username" clearable placeholder="PPTV用户名" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="userId" clearable placeholder="用户ID" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="redisShardName" clearable placeholder="存储在redis上的分片名称" style="width: 150px; margin: 0 5px 5px 0"/>
            <DatePicker v-model="beginTime" type="datetime" placeholder="开始时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <DatePicker v-model="endTime" type="datetime" placeholder="结束时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <Button type="default" @click="query_userinfo_list('init')" style="margin: 0 5px 5px 0; vertical-align: top;">查询</Button>
        </div>

        <!--项目列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList"></Table>

        <!--分页-->
        <Page :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>
    </div>
</template>

<script>
    import api from '../libs/API'
    import utils from '../libs/utils'

    export default {
        name: "SystemManagement",
        data() {
            return {
                id: null,
                username: null,
                userId: null,
                redisShardName: null,
                beginTime: null,
                endTime: null,
                columns: [
                    {
                        title: '序号',
                        key: 'serialNum',
                        width: 100
                    },
                    {
                        title: '流水编码',
                        key: 'id'
                    },
                    {
                        title: 'PPTV用户名',
                        key: 'username'
                    },
                    {
                        title: '用户ID',
                        key: 'userId'
                    },
                    {
                        title: '存储在redis上的分片名称',
                        key: 'redisShardName'
                    },
                    {
                        title: '更新时间',
                        key: 'updateTimeFormat'
                    }
                ],
                handleType: null,
                dataList: [],
                tableLoading: false,

                total: 0,
                page: 1,
                pageSize: 10,
                sortOrder: 'desc',
                sortName: 'id'
            }
        },
        methods: {
            query_userinfo_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    page: _this.page,
                    pageSize: _this.pageSize,
                    id: _this.id,
                    username: _this.username,
                    userId: _this.userId,
                    redisShardName: _this.redisShardName,
                    beginTime: utils.dateFormat(_this.beginTime, 'YYYY-MM-DD hh:mm:ss'),
                    endTime: utils.dateFormat(_this.endTime, 'YYYY-MM-DD hh:mm:ss'),
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_userinfo_list', null, params).then(res => {
                    //console.log(res);
                    res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                        item.updateTimeFormat = utils.dateFormat(item.updateTime, 'YYYY-MM-DD hh:mm:ss');
                        return item;
                    });
                    _this.total = res.data.total;
                    _this.dataList = res.data.rows;
                    _this.tableLoading = false;
                }).catch(err => {
                    //console.error(err);
                    _this.tableLoading = false;
                    _this.$Message.error({
                        content: err.message || '用户信息列表查询失败',
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_userinfo_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_userinfo_list();
                }
            }
        },
        mounted() {
            const _this = this;
            _this.query_userinfo_list('init');
        },
        created() {
            this.$store.commit('updatePathName');
        }
    }
</script>

<style scoped lang="less">
    .content {
        p {
            margin-bottom: 10px;
            span {
                display: inline-block;
                width: 80px;
            }
        }
    }
</style>
