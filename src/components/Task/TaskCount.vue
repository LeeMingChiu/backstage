<template>
    <div class="taskCount" @keyup.enter="query_task_count_list('init')">
        <div style="margin-bottom: 5px;">
            <Select v-model="prizeState" style="width: 100px; margin: 0 5px 5px 0" placeholder="领奖状态" clearable>
                <Option v-for="item in prizeStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="havePrize" style="width: 100px; margin: 0 5px 5px 0" placeholder="有无奖品" clearable>
                <Option v-for="item in havePrizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <DatePicker v-model="beginTime" type="datetime" placeholder="任务开始执行时间" clearable style="width: 200px; margin: 0 5px 5px 0; vertical-align: top"></DatePicker>
            <DatePicker v-model="endTime" type="datetime" placeholder="任务结束执行时间" clearable style="width: 200px; margin: 0 5px 5px 0; vertical-align: top"></DatePicker>
            <Input v-model="taskId" clearable placeholder="任务ID" style="width: 200px; margin: 0 5px 5px 0"/>
            <Input v-model="username" clearable placeholder="PPTV用户名" style="width: 200px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_task_count_list('init')" style="margin: 0 5px 5px 0">查找</Button>
        </div>

        <!--促销列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" height="600"></Table>
    </div>
</template>

<script>
    import api from '../../libs/API'

    export default {
        name: "TaskCount",
        data() {
            return {
                taskId: null,
                username: null,
                beginTime: null,
                endTime: null,
                time: null,
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
                        title: '类别',
                        key: 'type'
                    },
                    {
                        title: '数值',
                        key: 'num'
                    }
                ],
                dataList: [],

                tableLoading: false
            }
        },
        methods: {
            query_task_count_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    taskId: _this.taskId,
                    username: _this.username,
                    beginTime: new Date(_this.beginTime).getTime(),
                    endTime: new Date(_this.endTime).getTime(),
                    prizeState: _this.prizeState,
                    havePrize: _this.havePrize,
                };
                _this.tableLoading = true;
                api.post('query_task_count', null, params, 60000).then(res => {
                    //console.log(res);
                    /*res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                        return item;
                    });*/
                    let index = 1;
                    res.data.rows = [];
                    for (let key in res.data) {
                        if (res.data.hasOwnProperty(key)) {
                            if ((key.indexOf('shard') !== -1) || (key.indexOf('total') !== -1)) {
                                res.data.rows.push({
                                    type: key,
                                    num: res.data[key],
                                    serialNum: index++
                                })
                            }
                        }
                    }
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
                this.query_task_count_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_task_count_list();
                }
            },
        },
        mounted() {
            this.query_task_count_list('init');
        },
        created() {
            this.$store.commit('updatePathName');
        }
    }
</script>

<style scoped>

</style>
