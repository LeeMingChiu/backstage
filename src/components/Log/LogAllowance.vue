<template>
    <div class="logAllowance">
        <div style="margin-bottom: 5px;" @keyup.enter="query_allowance_list('init')">
            <Select v-model="resultFlag" style="width: 100px; margin: 0 5px 5px 0" placeholder="操作结果" clearable>
                <Option v-for="item in resultFlagList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <DatePicker v-model="beginTime" type="datetime" placeholder="开始时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <DatePicker v-model="endTime" type="datetime" placeholder="结束时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <Input v-model="id" clearable placeholder="购物津贴日志编码" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="username" clearable placeholder="PPTV用户名" style="width: 150px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_allowance_list('init')" style="margin: 0 5px 5px 0; vertical-align: top;">查询
            </Button>
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
        name: "LogAllowance",
        data() {
            return {
                id: null,
                username: null,
                beginTime: null,
                endTime: null,
                resultFlag: null,
                resultFlagList: [
                    {
                        label: '成功',
                        value: '1'
                    },
                    {
                        label: '失败',
                        value: '0'
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
                        title: '购物津贴日志编码',
                        key: 'id',
                        width: 100
                    },
                    {
                        title: '会员编码',
                        key: 'userId',
                        width: 110
                    },
                    {
                        title: 'PPTV用户名',
                        key: 'username',
                        width: 120
                    },
                    {
                        title: '活动编码',
                        key: 'activityId',
                        width: 100
                    },
                    {
                        title: '购物津贴使用规则编号',
                        key: 'bonusRuleId',
                        width: 110
                    },
                    {
                        title: '操作结果',
                        key: 'resultFlagFormat',
                        width: 100
                    },
                    {
                        title: '购物津贴批次号',
                        key: 'bonusNo',
                        width: 110
                    },
                    {
                        title: '调用rsf发奖的失败代码',
                        key: 'failCode',
                        width: 100
                    },
                    {
                        title: '失败信息',
                        key: 'failMessage',
                        width: 200
                    },
                    {
                        title: '调用rsf问题描述',
                        key: 'exception',
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
            query_allowance_list(flag) {
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
                    resultFlag: _this.resultFlag,
                    beginTime: utils.dateFormat(_this.beginTime, 'YYYY-MM-DD hh:mm:ss'),
                    endTime: utils.dateFormat(_this.endTime, 'YYYY-MM-DD hh:mm:ss'),
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_log_allowance', null, params).then(res => {
                    //console.log(res);
                    res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                        item.resultFlagFormat = (item.resultFlag === '1') ? '成功' : '失败';
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
                        content: err.message || '购物津贴日志列表查询失败',
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_allowance_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_allowance_list();
                }
            }
        },
        mounted() {
            const _this = this;
            _this.query_allowance_list('init');
        },
        created() {
            this.$store.commit('updatePathName');
        }
    }
</script>

<style scoped lang="less">

</style>
