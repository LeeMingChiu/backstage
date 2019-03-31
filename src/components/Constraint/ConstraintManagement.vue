<template>
    <div class="constraintManagement">
        <div style="margin-bottom: 5px;" @keyup.enter="query_constraint_list('init')">
            <Select v-model="ruleType" style="width: 150px; margin: 0 0 5px;" placeholder="约束规则" clearable>
                <Option v-for="(item, index) in ruleTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
            <Select v-model="cycle" style="width: 150px; margin: 0 5px 5px;" placeholder="约束周期" clearable>
                <Option v-for="(item, index) in cycleList" :value="item.value" :key="index">{{ item.label }}</Option>
            </Select>
            <Input v-model="name" clearable placeholder="约束名称" style="width: 150px; margin: 0 5px 5px 0"/>
            <Input v-model="id" clearable placeholder="约束ID" style="width: 150px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_constraint_list('init')" style="margin: 0 5px 5px 0">查询</Button>
            <Button type="primary" @click="handleConstraint('create')" style="margin: 0 5px 5px 0; float: right">新建约束</Button>
        </div>

        <!--项目列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" height="600" @on-sort-change="sort"></Table>

        <!--分页-->
        <Page v-if="total" :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>

        <!--新建/修改约束-->
        <Modal :mask-closable="false" v-model="showModal" width="500" :title="(selectionItem && selectionItem.id) ? '修改约束' : '新建约束'" :styles="{top: '10px'}">
            <div class="content">
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 约束名称</span>
                    <Input v-model="selectionItem.name" placeholder="长度限制1-64个汉字" :maxlength="64" clearable style="width: 300px; margin-left: 20px;"/>
                </p>
                <p>
                    <span style="padding-left: 8px;">约束描述</span>
                    <Input v-model="selectionItem.memo" placeholder="长度限制1-255个汉字" :maxlength="255" clearable style="width: 300px; margin-left: 20px;"/>
                </p>
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 约束周期</span>
                    <Select v-model="selectionItem.cycle" style="width: 300px; margin: 0 20px;" clearable @on-change="changeConstraintType">
                        <Option v-for="(item, index) in cycleList" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </p>
                <p v-if="selectionItem.cycle === 2">
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 限定次数</span>
                    <InputNumber :min="1" v-model="selectionItem.completionTimes" clearable style="width: 300px; margin-left: 20px;"></InputNumber>
                </p>
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 约束规则</span>
                    <Select v-model="selectionItem.ruleType" style="width: 300px; margin: 0 20px;" clearable @on-change="changeRuleType">
                        <Option v-for="(item, index) in ruleTypeList" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </p>
                <!--观看视频个数-->
                <p v-if="selectionItem.ruleType === 5">
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 观看个数</span>
                    <InputNumber :min="1" v-model="rule.count" clearable style="width: 300px; margin-left: 20px;"></InputNumber>
                </p>
                <!--观看视频时长-->
                <p v-if="selectionItem.ruleType === 6">
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 观看时长（秒）</span>
                    <InputNumber :min="1" v-model="rule.second" clearable style="width: 300px; margin-left: 20px;"></InputNumber>
                </p>
                <p v-if="selectionItem.ruleType === 6">
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 正/反向</span>
                    <Select v-model="rule.direction" style="width: 300px; margin: 0 20px;" placeholder="正/反向" clearable>
                        <Option v-for="(item, index) in directionList" :value="item.value" :key="index">{{ item.label }}</Option>
                    </Select>
                </p>
                <p v-if="selectionItem.ruleType === 6">
                    <span style="padding-left: 9px;">剧集ID(英文,分割)</span>
                    <Input v-model="rule.sid" clearable placeholder="sid" style="width: 300px; margin-left: 20px;"/>
                </p>
                <p v-if="selectionItem.ruleType === 6">
                    <span style="padding-left: 9px;">视频ID(英文,分割)</span>
                    <Input v-model="rule.vid" clearable placeholder="vid" style="width: 300px; margin-left: 20px;"/>
                </p>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="error" @click="showModal = false">取消</Button>
                <Button type="success" @click="confirm">{{(selectionItem && selectionItem.id) ? '修改' : '创建'}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import api from '../../libs/API'

    export default {
        name: "ConstraintManagement",
        data() {
            return {
                id: null,
                name: null,
                ruleType: null,
                cycle: null,
                cycleList: [
                    {
                        label: '不限次',
                        value: 0
                    },
                    {
                        label: '一次性',
                        value: 1
                    },
                    {
                        label: '每日',
                        value: 2
                    }
                ],
                rule: {},
                ruleTypeList: [],
                ruleTypeObj: {},
                columns: [
                    {
                        title: '序号',
                        key: 'serialNum',
                        width: 100,
                        fixed: 'left'
                    },
                    {
                        title: '约束ID',
                        key: 'id',
                        width: 100,
                        sortable: true,
                    },
                    {
                        title: '约束名称',
                        key: 'name',
                        width: 300
                    },
                    {
                        title: '约束描述',
                        key: 'memo',
                        width: 500
                    },
                    {
                        title: '约束周期',
                        key: 'cycleFormat',
                        width: 90
                    },
                    {
                        title: '约束规则',
                        key: 'ruleTypeFormat',
                        width: 110
                    },
                    {
                        title: '限定次数',
                        key: 'completionTimesFormat',
                        width: 110
                    },
                    {
                        title: '更多操作',
                        key: 'detail',
                        align: 'center',
                        width: 90,
                        fixed: 'right',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.selectionItem = JSON.parse(JSON.stringify(params.row));
                                            this.rule = JSON.parse(this.selectionItem.rule);
                                            if (typeof this.rule.sid === 'object') {
                                                this.rule.sid = this.rule.sid.join(',');
                                            }
                                            if (typeof this.rule.vid === 'object') {
                                                this.rule.vid = this.rule.vid.join(',');
                                            }
                                            this.handleConstraint('update');
                                        }
                                    }
                                }, '修改')
                            ])
                        }
                    }
                ],
                dataList: [],
                tableLoading: false,

                directionList: [
                    {
                        label: '反向',
                        value: 0
                    },
                    {
                        label: '正向',
                        value: 1
                    }
                ],

                selectionItem: {
                    id: null,
                    name: null,
                    memo: null,
                    cycle: null,
                    completionTimes: null,
                    ruleType: null,
                    count: null,
                    time: null,
                    direction: null,
                    sid: null,
                    vid: null
                },

                showModal: false,

                total: 0,
                page: 1,
                pageSize: 10,
                sortOrder: 'desc',
                sortName: 'id'
            }
        },
        methods: {
            changeConstraintType() {
                this.selectionItem.completionTimes = null;
            },
            changeRuleType(value) {
                if (value === 5) {
                    this.selectionItem.count = null;
                } else if (value === 6) {
                    this.selectionItem.time = null;
                    this.selectionItem.direction = null;
                    this.selectionItem.sid = null;
                    this.selectionItem.vid = null;
                }
            },
            sort(col) {
                this.page = 1;
                this.pageSize = 10;
                if (col.order.toUpperCase() === 'NORMAL') {
                    this.sortOrder = 'DESC';
                    this.sortName = 'id';
                } else {
                    this.sortOrder = col.order.toUpperCase();
                    this.sortName = col.key.replace('Format', '');
                }
                this.query_constraint_list();
            },
            query_constraint_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    page: _this.page,
                    pageSize: _this.pageSize,
                    id: _this.id,
                    cycle: _this.cycle,
                    name: _this.name,
                    ruleType: _this.ruleType,
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_constraint_list', null, params).then(res => {
                    //console.log(res);
                    res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                        item.cycleFormat = item.cycle ? ((item.cycle === 1) ? '一次性' : '每日') : '不限次';
                        item.ruleTypeFormat = _this.ruleTypeObj[item.ruleType];
                        item.completionTimesFormat = (item.completionTimes === 2147483647) ? '-' : item.completionTimes;
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
                        content: err.message || '约束列表查询失败',
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_constraint_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_constraint_list();
                }
            },
            query_constraint_rule_id_name() {
                const _this = this;
                api.get('query_constraint_rule_id_name').then(res => {
                    //console.log(res);
                    _this.ruleTypeList = [];
                    res.data.forEach(item => {
                        _this.ruleTypeList.push({
                            label: item.name,
                            value: item.id
                        });
                        _this.ruleTypeObj[item.id] = item.name;
                    });
                }).catch(err => {
                    //console.error(err);
                    _this.$Message.error({
                        content: err.message || '获取约束规则列表失败',
                        duration: 3
                    });
                });
            },
            handleConstraint(type) {
                const _this = this;
                _this.query_constraint_rule_id_name();
                if (type === 'create') {
                    _this.selectionItem = {
                        id: null,
                        name: null,
                        description: null,
                        cycle: null,
                        completionTimes: null,
                        ruleType: null,
                        rule: null
                    };
                    _this.rule = {
                        name: null,
                        memo: null,
                        rule: null,
                        ruleType: null,
                        second: null,
                        direction: null,
                        sid: null,
                        vid: null,
                        count: null
                    }
                }
                _this.showModal = true;
            },
            confirm() {
                const _this = this;
                if (!_this.selectionItem.name) {
                    return _this.$Message.error({
                        content: '约束名称不能为空',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.cycle && (_this.selectionItem.cycle !== 0)) {
                    return _this.$Message.error({
                        content: '约束周期不能为空',
                        duration: 3
                    });
                }
                if (_this.selectionItem.cycle === 0) {
                    _this.selectionItem.completionTimes = 1;
                }
                if (_this.selectionItem.cycle === 1) {
                    _this.selectionItem.completionTimes = 1;
                }
                if ((_this.selectionItem.cycle === 2) && !_this.selectionItem.completionTimes) {
                    return _this.$Message.error({
                        content: '限定次数不能为空',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.ruleType) {
                    return _this.$Message.error({
                        content: '约束规则不能为空',
                        duration: 3
                    });
                }
                if ((_this.selectionItem.ruleType === 5) && !_this.rule.count) {
                    return _this.$Message.error({
                        content: '观看个数不能为空',
                        duration: 3
                    });
                }
                if (_this.selectionItem.ruleType === 6) {
                    if (!_this.rule.second && (_this.rule.second !== 0)) {
                        return _this.$Message.error({
                            content: '观看时长（秒）不能为空',
                            duration: 3
                        });
                    }
                    if (!_this.rule.direction && (_this.rule.direction !== 0)) {
                        return _this.$Message.error({
                            content: '正/反向不能为空',
                            duration: 3
                        });
                    }
                    if (_this.rule.sid && _this.rule.sid.indexOf('，') !== -1) {
                        return _this.$Message.error({
                            content: '剧集ID不能用中文逗号分割',
                            duration: 3
                        });
                    }
                    if (_this.rule.vid && _this.rule.vid.indexOf('，') !== -1) {
                        return _this.$Message.error({
                            content: '视频ID不能用中文逗号分割',
                            duration: 3
                        });
                    }
                }
                let rule = JSON.parse(JSON.stringify(_this.rule));
                rule.sid = rule.sid ? rule.sid.split(',') : [];
                rule.vid = rule.vid ? rule.vid.split(',') : [];
                _this.selectionItem.rule = JSON.stringify(rule);
                _this.$Spin.show();
                api.post('save_constraint', null, _this.selectionItem).then(res => {
                    //console.log(res);
                    _this.showModal = false;
                    _this.$Spin.hide();
                    _this.query_constraint_list();
                }).catch(err => {
                    //console.error(err);
                    _this.showModal = false;
                    _this.$Spin.hide();
                    _this.$Message.error({
                        content: err.message || (_this.selectionItem.id ? '修改约束失败' : '新建约束失败'),
                        duration: 3
                    });
                })
            }
        },
        mounted() {
            const _this = this;
            _this.query_constraint_list('init');

            if (window.location.href.split('?')[1] === 'type=create') {
                _this.handleConstraint('create');
            }
        },
        created() {
            this.$store.commit('updatePathName');
            this.query_constraint_rule_id_name();
        }
    }
</script>

<style scoped lang="less">
    .constraintManagement {
        position: relative;
    }

    .content {
        p {
            margin-bottom: 5px;
            &:last-child {
                margin-bottom: 0;
            }
            span {
                display: inline-block;
                width: 120px;
            }
        }
    }
</style>
