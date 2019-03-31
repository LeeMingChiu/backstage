<template>
    <div class="LogCoupon">
        <div style="margin-bottom: 5px;" @keyup.enter="query_coupon_list('init')">
            <Select v-model="resultFlag" style="width: 100px; margin: 0 5px 5px 0" placeholder="操作结果" clearable>
                <Option v-for="item in resultFlagList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <DatePicker v-model="beginTime" type="datetime" placeholder="开始时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <DatePicker v-model="endTime" type="datetime" placeholder="结束时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <Input v-model="id" clearable placeholder="易购券日志编码" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="username" clearable placeholder="PPTV用户名" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="couponPoolId" clearable placeholder="券池编码" style="width: 150px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_coupon_list('init')" style="margin: 0 5px 5px 0; vertical-align: top;">查询</Button>
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
        name: "LogCoupon",
        data() {
            return {
                id: null,
                couponPoolId: null,
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
                        title: '易购券日志编码',
                        key: 'id',
                        width: 90
                    },
                    {
                        title: 'PPTV用户名',
                        key: 'username',
                        width: 120
                    },
                    {
                        title: '会员编码',
                        key: 'userId',
                        width: 110
                    },
                    {
                        title: '奖品记录ID',
                        key: 'prizeRecordId',
                        width: 80
                    },
                    {
                        title: '活动编码',
                        key: 'activityId',
                        width: 100
                    },
                    {
                        title: '活动秘钥',
                        key: 'activitySecretKey',
                        width: 150
                    },
                    {
                        title: '券池编码',
                        key: 'couponPoolId',
                        width: 70
                    },
                    {
                        title: '操作结果',
                        key: 'resultFlagFormat',
                        width: 70
                    },
                    {
                        title: '调用失败信息',
                        key: 'failMessage',
                        width: 200
                    },
                    {
                        title: '调用rsf发奖的失败代码',
                        key: 'failCode',
                        width: 120
                    },
                    {
                        title: '调用rsf问题描述',
                        key: 'exception',
                        width: 200
                    },
                    {
                        title: '调用时间',
                        key: 'callTimeFormat',
                        width: 100
                    },
                    {
                        title: '券号',
                        key: 'couponNo',
                        width: 80
                    },
                    {
                        title: '券面值',
                        key: 'couponAmount',
                        width: 80
                    },
                    {
                        title: '券类型',
                        key: 'couponType',
                        width: 80
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
            query_coupon_list(flag) {
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
                    couponPoolId: _this.couponPoolId,
                    resultFlag: _this.resultFlag,
                    beginTime: utils.dateFormat(_this.beginTime, 'YYYY-MM-DD hh:mm:ss'),
                    endTime: utils.dateFormat(_this.endTime, 'YYYY-MM-DD hh:mm:ss'),
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_log_coupon', null, params).then(res => {
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
                        content: err.message || '优惠券日志列表查询失败',
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_coupon_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_coupon_list();
                }
            }
        },
        mounted() {
            const _this = this;
            _this.query_coupon_list('init');
        },
        created() {
            this.$store.commit('updatePathName');
        }
    }
</script>

<style scoped lang="less">

</style>
