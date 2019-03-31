<template>
    <div class="logMail">
        <div style="margin-bottom: 5px;" @keyup.enter="query_mail_list('init')">
            <DatePicker v-model="beginTime" type="datetime" placeholder="开始时间" clearable style="width: 300px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <DatePicker v-model="endTime" type="datetime" placeholder="结束时间" clearable style="width: 300px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <Input v-model="id" clearable placeholder="站内信日志ID" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="username" clearable placeholder="PPTV用户名" style="width: 150px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_mail_list('init')" style="margin: 0 5px 5px 0; vertical-align: top;">查询</Button>
        </div>

        <!--项目列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" height="600"></Table>

        <!--分页-->
        <Page v-if="total" :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>
    </div>
</template>

<script>
    import api from '../../libs/API'
    import utils from '../../libs/utils'

    export default {
        name: "logMail",
        data() {
            return {
                id: null,
                username: null,
                beginTime: null,
                endTime: null,
                columns: [
                    {
                        title: '序号',
                        key: 'serialNum',
                        width: 100,
                        fixed: 'left'
                    },
                    {
                        title: '站内信日志ID',
                        key: 'id',
                        width: 90
                    },
                    {
                        title: 'PPTV用户名',
                        key: 'username',
                        width: 120
                    },
                    {
                        title: '任务执行记录ID',
                        key: 'taskExecuteRecordId',
                        width: 90
                    },
                    {
                        title: '任务信息ID',
                        key: 'taskInfoId',
                        width: 80
                    },
                    {
                        title: '平台信息',
                        key: 'platform',
                        width: 300
                    },
                    {
                        title: '场景ID',
                        key: 'sceneId',
                        width: 80
                    },
                    {
                        title: '站内信标题',
                        key: 'siteMessageTitle',
                        width: 200
                    },
                    {
                        title: '站内信内容',
                        key: 'siteMessage',
                        width: 300
                    },
                    {
                        title: '返回结果',
                        key: 'result',
                        width: 300
                    },
                    {
                        title: '接口调用时间',
                        key: 'callTimeFormat',
                        width: 100
                    }
                ],
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
            query_mail_list(flag) {
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
                    beginTime: utils.dateFormat(_this.beginTime, 'YYYY-MM-DD hh:mm:ss'),
                    endTime: utils.dateFormat(_this.endTime, 'YYYY-MM-DD hh:mm:ss'),
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_log_message', null, params).then(res => {
                    //console.log(res);
                    res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                        item.callTimeFormat = utils.dateFormat(item.callTime, 'YYYY-MM-DD hh:mm:ss');
                        return item;
                    });
                    _this.total = res.data.total;
                    _this.dataList = res.data.rows;
                    if (!_this.dataList.length) {
                        _this.$Message.warning({
                            content: '未查到相关数据',
                            duration: 3
                        });
                    }
                    _this.tableLoading = false;
                }).catch(err => {
                    //console.error(err);
                    _this.tableLoading = false;
                    _this.$Message.error({
                        content: err.message || '站内信日志列表查询失败',
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_mail_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_mail_list();
                }
            }
        },
        mounted() {
            const _this = this;
            _this.query_mail_list('init');
        },
        created() {
            this.$store.commit('updatePathName');
        }
    }
</script>

<style scoped lang="less">

</style>
