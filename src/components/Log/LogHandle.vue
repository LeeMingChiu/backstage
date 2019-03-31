<template>
    <div class="LogHandle">
        <div style="margin-bottom: 5px;" @keyup.enter="query_handle_list('init')">
            <Select v-model="action" style="width: 100px; margin: 0 5px 5px 0" placeholder="操作" clearable>
                <Option v-for="item in actionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <DatePicker v-model="beginTime" type="datetime" placeholder="开始时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <DatePicker v-model="endTime" type="datetime" placeholder="结束时间" clearable style="width: 160px; margin: 0 5px 5px 0; vertical-align: top;"></DatePicker>
            <Input v-model="module" clearable placeholder="操作表名" style="width: 150px; margin: 0 5px 5px 0"/>
            <br>
            <Input v-model="moduleRecordId" clearable placeholder="操作记录ID" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="operateUserName" clearable placeholder="操作人姓名" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="ext" clearable placeholder="操作记录详情" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="moduleRecordName" clearable placeholder="操作记录name" style="width: 150px; margin: 0 5px 5px 0"/>
            <Button moduleRecordName="default" @click="query_handle_list('init')" style="margin: 0 5px 5px 0; vertical-align: top;">查询</Button>
        </div>

        <!--项目列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" height="600"></Table>

        <!--分页-->
        <Page v-if="total" :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>

        <!--弹框-->
        <!--<Modal :mask-closable="false" v-model="modalInfo.isShow" width="720">
            <p slot="header">{{modalInfo.title}}</p>
            <div>{{modalInfo.content}}</div>
            <div slot="footer"></div>
        </Modal>-->
    </div>
</template>

<script>
    import api from '../../libs/API'
    import utils from '../../libs/utils'

    export default {
        name: "LogHandle",
        data() {
            return {
                /*modalInfo: {
                    title: '',
                    content: '',
                    isShow: false
                },*/
                module: null,
                moduleRecordId: null,
                operateUserName: null,
                ext: null,
                beginTime: null,
                endTime: null,
                moduleRecordName: null,
                action: null,
                actionList: [
                    {
                        label: '删除',
                        value: 'delete'
                    },
                    {
                        label: '新增',
                        value: 'add'
                    },
                    {
                        label: '更新',
                        value: 'update'
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
                        title: '日志记录编码',
                        key: 'id',
                        width: 110
                    },
                    {
                        title: '操作表名',
                        key: 'module',
                        width: 100
                    },
                    {
                        title: '操作记录ID',
                        key: 'moduleRecordId',
                        width: 100
                    },
                    {
                        title: '操作',
                        key: 'actionFormat',
                        width: 65
                    },
                    {
                        title: '操作记录name',
                        key: 'moduleRecordName',
                        width: 120
                    },
                    {
                        title: '操作人ID',
                        key: 'operateUserId',
                        width: 100
                    },
                    {
                        title: '操作人姓名',
                        key: 'operateUserName',
                        width: 100
                    },
                    {
                        title: '时间',
                        key: 'operateTimeFormat',
                        width: 100
                    },
                    {
                        title: '预留',
                        key: 'memo',
                        width: 200
                    },
                    {
                        title: '操作记录详情',
                        key: 'ext',
                        width: 1000
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
            query_handle_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    page: _this.page,
                    pageSize: _this.pageSize,
                    module: _this.module,
                    moduleRecordId: _this.moduleRecordId,
                    operateUserName: _this.operateUserName,
                    ext: _this.ext,
                    moduleRecordName: _this.moduleRecordName,
                    action: _this.action,
                    beginTime: utils.dateFormat(_this.beginTime, 'YYYY-MM-DD hh:mm:ss'),
                    endTime: utils.dateFormat(_this.endTime, 'YYYY-MM-DD hh:mm:ss'),
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_log_handle', null, params).then(res => {
                    //console.log(res);
                    res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                        item.actionFormat = (item.action === 'delete') ? '删除' : ((item.action === 'add') ? '新增' : '更新');
                        item.operateTimeFormat = utils.dateFormat(item.operateTime, 'YYYY-MM-DD hh:mm:ss');
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
                        content: err.message || '操作日志列表查询失败',
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_handle_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_handle_list();
                }
            }
        },
        mounted() {
            const _this = this;
            _this.query_handle_list('init');
        },
        created() {
            this.$store.commit('updatePathName');
        }
    }
</script>

<style scoped lang="less">

</style>
