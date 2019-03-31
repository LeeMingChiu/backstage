<template>
    <div class="taskRecord">
        <div style="margin-bottom: 5px;"  @keyup.enter="query_task_record_list('init')">
            <Input v-model="taskId" clearable placeholder="任务ID" style="width: 200px; margin: 0 5px 5px 0"/>
            <Input v-model="username" clearable placeholder="PPTV用户名" style="width: 200px; margin: 0 5px 5px 0"/>
            <DatePicker v-model="beginTime" type="datetime" placeholder="开始时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top"></DatePicker>
            <DatePicker v-model="endTime" type="datetime" placeholder="结束时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top"></DatePicker>
            <Select v-model="prizeState" clearable style="width: 100px; margin: 0 5px 5px 0" placeholder="领奖状态">
                <Option v-for="item in prizeStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="havePrize" clearable style="width: 100px; margin: 0 5px 5px 0" placeholder="有无奖品">
                <Option v-for="item in havePrizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="default" @click="query_task_record_list('init')" style="margin: 0 5px 5px 0">查找</Button>
        </div>

        <!--促销列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" height="600"></Table>

        <!--分页-->
        <Page v-if="total" :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>
    </div>
</template>

<script>
    import api from '../../libs/API'
    import utils from '../../libs/utils'

    export default {
        name: "TaskRecord",
        data() {
            return {
                taskId: null,
                username: null,
                beginTime: null,
                endTime: null,
                prizeState: null,
                prizeStateList: [
                    {
                        label: '未领取',
                        value: 0
                    },
                    {
                        label: '已领取',
                        value: 1
                    }
                ],
                havePrize: null,
                havePrizeList: [
                    {
                        label: '无奖品',
                        value: 0
                    },
                    {
                        label: '有奖品',
                        value: 1
                    }
                ],
                columns: [
                    {
                        title: '序号',
                        key: 'serialNum',
                        width: 100
                    },
                    {
                        title: '任务执行记录编码',
                        key: 'id'
                    },
                    {
                        title: '任务ID',
                        key: 'taskId'
                    },
                    {
                        title: '任务执行时间',
                        key: 'executeTimeFormat'
                    },
                    {
                        title: '领奖状态',
                        key: 'prizeStateFormat'
                    },
                    {
                        title: 'PPTV用户名',
                        key: 'username'
                    },
                    {
                        title: '有无奖品',
                        key: 'havePrizeFormat'
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
            query_task_record_list(flag) {
                const _this = this;
                if (!_this.username && (_this.username !== 0)) {
                    return _this.$Message.warning({
                        content: 'PPTV用户名不能为空',
                        duration: 3
                    });
                }
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    taskId: _this.taskId,
                    username: _this.username,
                    prizeState: _this.prizeState,
                    havePrize: _this.havePrize,
                    beginTime: utils.dateFormat(_this.beginTime, 'YYYY-MM-DD hh:mm:ss'),
                    endTime: utils.dateFormat(_this.endTime, 'YYYY-MM-DD hh:mm:ss'),
                    page: _this.page,
                    pageSize: _this.pageSize,
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_task_record', null, params).then(res => {
                    console.log(res);
                    res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                        item.prizeStateFormat = item.prizeState ? '已领取' : '未领取';
                        item.havePrizeFormat = item.havePrize ? '有奖品' : '无奖品';
                        item.executeTimeFormat = utils.dateFormat(item.executeTime, 'YYYY-MM-DD hh:mm:ss');
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
                    console.error(err);
                    _this.tableLoading = false;
                    _this.$Message.error({
                        content: err.message || '任务执行日志列表查询失败',
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_task_record_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_task_record_list();
                }
            },
        },
        mounted() {
            //this.query_task_record_list('init');
        },
        created() {
            this.$store.commit('updatePathName');
        }
    }
</script>

<style scoped>

</style>
