<template>
    <div class="LogYunZuan">
        <div style="margin-bottom: 5px;" @keyup.enter="query_yuanzuan_list('init')">
            <Select v-model="handleResult" style="width: 100px; margin: 0 5px 5px 0" placeholder="状态" clearable>
                <Option v-for="item in handleResultList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <DatePicker v-model="beginTime" type="datetime" placeholder="开始时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <DatePicker v-model="endTime" type="datetime" placeholder="结束时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <Input v-model="id" clearable placeholder="ID" style="width: 150px; margin: 0 5px 5px 0"/>
            <br>
            <Input v-model="userId" clearable placeholder="用户ID" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="taskId" clearable placeholder="任务ID" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="orderItemId" clearable placeholder="订单行号" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="taskExecuteId" clearable placeholder="任务执行记录ID" style="width: 150px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_yuanzuan_list('init')" style="margin: 0 5px 5px 0; vertical-align: top;">查询</Button>
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
        name: "LogYunZuan",
        data() {
            return {
                id: null,
                userId: null,
                orderItemId: null,
                taskId: null,
                taskExecuteId: null,
                beginTime: null,
                endTime: null,
                handleResult: null,
                handleResultList: [
                    {
                        label: '成功',
                        value: 'COMPLETE'
                    },
                    {
                        label: '失败',
                        value: 'FAIL'
                    },
                ],
                columns: [
                    {
                        title: '序号',
                        key: 'serialNum',
                        width: 100,
                        fixed: 'left'
                    },
                    {
                        title: 'ID',
                        key: 'id',
                        width: 100
                    },
                    {
                        title: '用户ID',
                        key: 'userId',
                        width: 120
                    },
                    {
                        title: '订单行号',
                        key: 'orderItemId',
                        width: 120
                    },
                    {
                        title: '任务执行记录id',
                        key: 'taskExecuteId',
                        width: 100
                    },
                    {
                        title: '任务ID',
                        key: 'taskId',
                        width: 100
                    },
                    {
                        title: '云钻数量',
                        key: 'addAmt',
                        width: 100
                    },
                    {
                        title: '状态',
                        key: 'statusFormat',
                        width: 70
                    },
                    {
                        title: '接口请求时间',
                        key: 'sendTimeFormat',
                        width: 100
                    },
                    {
                        title: '更新时间',
                        key: 'updateTimeFormat',
                        width: 100
                    },
                    {
                        title: '错误代码',
                        key: 'errorCode',
                        width: 100
                    },
                    {
                        title: '错误原因',
                        key: 'errorDesc',
                        width: 100
                    },
                    {
                        title: '返回信息',
                        key: 'responseContext',
                        width: 500
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
            query_yuanzuan_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    page: _this.page,
                    pageSize: _this.pageSize,
                    id: _this.id,
                    userId: _this.userId,
                    couponPoolId: _this.couponPoolId,
                    status: _this.handleResult,
                    orderItemId: _this.orderItemId,
                    taskId: _this.taskId,
                    taskExecuteId: _this.taskExecuteId,
                    beginTime: utils.dateFormat(_this.beginTime, 'YYYY-MM-DD hh:mm:ss'),
                    endTime: utils.dateFormat(_this.endTime, 'YYYY-MM-DD hh:mm:ss'),
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_log_yunzuan', null, params).then(res => {
                    //console.log(res);
                    res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                        item.statusFormat = (item.status === 'COMPLETE') ? '成功' : '失败';
                        item.updateTimeFormat = utils.dateFormat(item.updateTime, 'YYYY-MM-DD hh:mm:ss');
                        item.sendTimeFormat = utils.dateFormat(item.sendTime, 'YYYY-MM-DD hh:mm:ss');
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
                        content: err.message || '云钻日志列表查询失败',
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_yuanzuan_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_yuanzuan_list();
                }
            }
        },
        mounted() {
            const _this = this;
            _this.query_yuanzuan_list('init');
        },
        created() {
            this.$store.commit('updatePathName');
        }
    }
</script>

<style scoped lang="less">

</style>
