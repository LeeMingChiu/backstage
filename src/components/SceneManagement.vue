<template>
    <div class="sceneManagement">
        <div style="margin-bottom: 5px;" @keyup.enter="query_scene_list('init')">
            <Input v-model="name" clearable placeholder="场景名称" style="width: 200px; margin: 0 5px 5px 0"/>
            <Input v-model="id" clearable placeholder="场景ID" style="width: 200px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_scene_list('init')" style="margin: 0 5px 5px 0">查找</Button>
            <!--<Button type="primary" style="float: right" @click="handleScene('create')">新建场景</Button>-->
        </div>

        <!--场景列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" @on-sort-change="sort" height="600"></Table>

        <!--分页-->
        <Page v-if="total" :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>

        <!--编辑弹框-->
        <Modal :mask-closable="false" v-model="showModal" width="520" :title="(selectionItem && selectionItem.id) ? '修改场景' : '新建场景'">
            <div class="content">
                <p>
                    <span>场景名称</span>
                    <Input v-model="selectionItem.name" :disabled="!!selectionItem.id" :clearable="!selectionItem.id" placeholder="场景名称" style="width: 300px;"/>
                </p>
                <p>
                    <span>场景描述</span>
                    <Input v-model="selectionItem.memo" :disabled="!!selectionItem.id" :clearable="!selectionItem.id" placeholder="场景描述" style="width: 300px;"/>
                </p>
                <p>
                    <span>密钥</span>
                    <Input v-model="selectionItem.secret" clearable placeholder="密钥 - 只能是10位字符" :maxlength="10" style="width: 300px;"/>
                </p>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="error" @click="showModal = false">取消</Button>
                <Button type="success" @click="confirm((selectionItem && selectionItem.id) ? 'update' : 'create')">{{selectionItem.id ? '修改' : '新建'}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import api from '../libs/API'
    import utils from '../libs/utils'

    export default {
        name: "SceneManagement",
        data() {
            return {
                id: null,
                name: null,
                columns: [
                    {
                        title: '序号',
                        key: 'serialNum',
                        width: 100
                    },
                    {
                        title: '场景ID',
                        key: 'id',
                        sortable: true
                    },
                    {
                        title: '场景名称',
                        key: 'name'
                    },
                    {
                        title: '场景描述',
                        key: 'memo'
                    },
                    {
                        title: '密钥',
                        key: 'secret'
                    },
                    {
                        title: '更多操作',
                        key: 'action',
                        width: 85,
                        align: 'center',
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
                                            this.handleScene('update');
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                dataList: [],
                showModal: false,
                selectionItem: {
                    name: '',
                    memo: '',
                    secret: ''
                },
                tableLoading: false,

                total: 0,
                page: 1,
                pageSize: 10,
                sortOrder: 'asc',
                sortName: 'id'
            }
        },
        methods: {
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
                this.query_scene_list();
            },
            handleScene(type) {
                const _this = this;
                if (type === 'create') {
                    _this.selectionItem = {
                        name: '',
                        memo: '',
                        secret: ''
                    }
                } else {
                    _this.selectionItem = {
                        id: _this.selectionItem.id,
                        name: _this.selectionItem.name,
                        memo: _this.selectionItem.memo,
                        secret: _this.selectionItem.secret
                    }
                }
                _this.showModal = true;
            },
            confirm() {
                const _this = this;
                /*if (_this.selectionItem.secret && (_this.selectionItem.secret.length !== 10)) {
                    return _this.$Message.error({
                        content: '密钥长度只能是32位',
                        duration: 3
                    });
                }
                if (_this.selectionItem.secret.indexOf('*') !== -1) {
                    return _this.$Message.error({
                        content: '密钥中不能包含*',
                        duration: 3
                    });
                }*/
                _this.$Spin.show();
                api.post('save_scene', null, _this.selectionItem).then(res => {
                    //console.log(res);
                    _this.showModal = false;
                    _this.$Spin.hide();
                    _this.query_scene_list();
                }).catch(err => {
                    //console.error(err);
                    _this.$Spin.hide();
                    _this.$Message.error({
                        content: err.message || (_this.selectionItem.id ? '修改场景失败' : '新建场景失败'),
                        duration: 3
                    });
                })
            },
            query_scene_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    id: _this.id,
                    name: _this.name,
                    pageSize: _this.pageSize,
                    page: _this.page,
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_scene_list', null, params).then(res => {
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
                        content: err.message || '获取场景列表失败',
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_scene_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_scene_list();
                }
            }
        },
        mounted: function () {
            const _this = this;
            _this.query_scene_list('init');
        },
        created() {
            this.$store.commit('updatePathName');
        }
    }
</script>

<style scoped lang="less">
    .content {
        p {
            margin-bottom: 10px;
            span {
                display: inline-block;
                width: 80px;
            }
        }
    }
</style>
