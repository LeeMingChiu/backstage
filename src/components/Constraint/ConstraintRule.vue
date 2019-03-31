<template>
    <div class="constraintRule">
        <div style="margin-bottom: 5px;">
            <Input v-model="name" clearable placeholder="约束规则名称" style="width: 300px; margin: 0 5px 5px 0"/>
            <Input v-model="id" clearable placeholder="约束规则编码" style="width: 300px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_rule_list('init')" style="margin: 0 5px 5px 0">查询</Button>
        </div>

        <!--项目列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" height="600"></Table>

        <!--分页-->
        <Page v-if="total" :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>
    </div>
</template>

<script>
    import api from '../../libs/API'

    export default {
        name: "ConstraintRule",
        data() {
            return {
                id: null,
                name: null,
                columns: [
                    {
                        title: '序号',
                        key: 'serialNum',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '约束规则编码',
                        key: 'id',
                        width: 110,
                        align: 'center'
                    },
                    {
                        title: '约束规则名称',
                        key: 'name'
                    },
                    {
                        title: '规则内容',
                        key: 'rule'
                    },
                    {
                        title: '约束规则描述',
                        key: 'memo'
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
            query_rule_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    page: _this.page,
                    pageSize: _this.pageSize,
                    id: _this.id || null,
                    name: _this.name || null,
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_constraint_rule_list', null, params).then(res => {
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
                    _this.$Message.error({
                        content: err.message || '获取约束规则列表失败',
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_rule_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_rule_list();
                }
            }
        },
        mounted() {
            const _this = this;
            _this.query_rule_list('init');
        },
        created() {
            this.$store.commit('updatePathName');
        },
    }
</script>

<style scoped lang="less">

</style>
