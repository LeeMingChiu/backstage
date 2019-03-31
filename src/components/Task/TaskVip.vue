<template>
    <div class="taskVip">
        <div style="margin-bottom: 5px;" @keyup.enter="query_task_vip_list('init')">
            <Input v-model="id" clearable placeholder="任务执行成功记录订单编码" style="width: 180px; margin: 0 5px 5px 0"/>
            <Input v-model="username" clearable placeholder="PPTV用户名" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="orderId" clearable placeholder="订单编码" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="taskId" clearable placeholder="任务ID" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="taskExecuteId" clearable placeholder="任务执行记录ID" style="width: 150px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_task_vip_list('init')" style="margin: 0 5px 5px 0">查找</Button>
        </div>

        <!--促销列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" height="600"></Table>

        <!--分页-->
        <Page v-if="total" :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>
    </div>
</template>

<script>
    import api from '../../libs/API'

    export default {
        name: "TaskVip",
        data() {
            return {
                id: null,
                username: null,
                orderId: null,
                taskId: null,
                taskExecuteId: null,
                columns: [
                    {
                        title: '序号',
                        key: 'serialNum',
                        width: 100
                    },
                    {
                        title: '任务执行成功记录订单编码',
                        key: 'id'
                    },
                    {
                        title: '订单编码',
                        key: 'orderId'
                    },
                    {
                        title: 'PPTV用户名',
                        key: 'username'
                    },
                    {
                        title: '任务ID',
                        key: 'taskId'
                    },
                    {
                        title: '任务执行记录ID',
                        key: 'taskExecuteId'
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
            query_task_vip_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    id: _this.id,
                    username: _this.username,
                    orderId: _this.orderId,
                    taskId: _this.taskId,
                    taskExecuteId: _this.taskExecuteId,
                    pageSize: _this.pageSize,
                    page: _this.page,
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_task_vip_list', null, params).then(res => {
                    //console.log(res);
                    res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
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
                })
            },
            changePage(n) {
                this.page = n;
                this.query_task_vip_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_task_vip_list();
                }
            },
        },
        mounted() {
            this.query_task_vip_list('init');
        },
        created() {
            this.$store.commit('updatePathName');
        }
    }
</script>

<style scoped>

</style>
