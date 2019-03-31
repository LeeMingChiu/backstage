<template>
    <div class="taskPromotion">
        <div style="margin-bottom: 5px;" @keyup.enter="query_promotion_list('init')">
            <Input v-model="name" clearable placeholder="促销名称" style="width: 200px; margin: 0 5px 5px 0"/>
            <Input v-model="id" clearable placeholder="促销ID" style="width: 200px; margin: 0 5px 5px 0"/>
            <Input v-model="imageName" clearable placeholder="图片名称" style="width: 200px; margin: 0 5px 5px 0"/>
            <Input v-model="memo" clearable placeholder="图片描述" style="width: 200px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_promotion_list('init')" style="margin: 0 5px 5px 0">查找</Button>
            <Button type="primary" style="float: right" @click="handlePromotion('create')">新建促销</Button>
        </div>

        <!--促销列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" @on-sort-change="sort" height="600"></Table>

        <!--分页-->
        <Page v-if="total" :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>

        <!--编辑弹框-->
        <Modal :mask-closable="false" v-model="showModal" width="500" :title="(selectionItem && selectionItem.id) ? '修改促销' : '新建促销'" :styles="{top: '10px'}">
            <div class="content">
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 促销标题</span>
                    <Input v-model="selectionItem.name" clearable placeholder="长度限制1-20个汉字" :maxlength="20" style="width: 350px;"/>
                </p>
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 图片名称</span>
                    <Input v-model="selectionItem.imageName" clearable placeholder="长度限制1-20个汉字" :maxlength="20" style="width: 350px;"/>
                </p>
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 图片描述</span>
                    <Input v-model="selectionItem.memo" clearable placeholder="长度限制1-255个汉字" :maxlength="255" style="width: 350px;"/>
                </p>
                <p style="font-size: 14px;">促销图片 <span style="font-size: 12px; color: red; width: 200px;">（注：图片格式PNG / JPG / GIF）</span>
                </p>
                <div class="uploadImg" style="margin-bottom: 10px;" v-for="(item, index) in coverImgList" :key="index">
                    <span style="display: inline-block; width: 50px; margin-right: 30px; text-align: left; vertical-align: top;">{{item.label}}</span>
                    <div class="uploadCoverImg" @mousemove="item.show = true" @mouseleave="item.show = false">
                        <Icon type="ios-camera" size="30" v-if="!item.url" style="float: left"></Icon>
                        <input type="file" :id="item.type" @change="selectFile(item)">
                        <img :src="item.url" alt="">
                        <div class="mask" :style="{display: (item.url && item.show) ? 'inline-block' : 'none'}">
                            <Icon size="30" type="ios-trash-outline" style="cursor: pointer" @click.native="removeUrl(item)"></Icon>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="error" @click="showModal = false">取消</Button>
                <Button type="success" @click="confirm">{{(selectionItem && selectionItem.id) ? '修改' : '新建'}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import api from '../../libs/API'

    export default {
        name: "TaskPromotion",
        data() {
            return {
                name: null,
                id: null,
                imageName: null,
                memo: null,
                columns: [
                    {
                        title: '序号',
                        key: 'serialNum',
                        width: 100
                    },
                    {
                        title: '促销ID',
                        key: 'id',
                        sortable: true
                    },
                    {
                        title: '促销名称',
                        key: 'name'
                    },
                    {
                        title: '图片名称',
                        key: 'imageName'
                    },
                    {
                        title: '图片描述',
                        key: 'memo'
                    },
                    {
                        title: '更多操作',
                        key: 'action',
                        width: 90,
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
                                            const _this = this;
                                            _this.selectionItem = JSON.parse(JSON.stringify(params.row));
                                            _this.handlePromotion('update');
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                dataList: [],
                selectionItem: {
                    name: null,
                    memo: null,
                    imageName: null
                },

                coverImgList: [
                    {
                        type: 'web',
                        label: 'PC端',
                        url: null,
                        show: false,
                        file: null
                    },
                    {
                        type: 'iph',
                        label: '移动端',
                        url: null,
                        show: false,
                        file: null
                    },
                    {
                        type: 'atv',
                        label: 'TV端',
                        url: null,
                        show: false,
                        file: null
                    },
                    {
                        type: 'ipd',
                        label: 'Pad端',
                        url: null,
                        show: false,
                        file: null
                    }
                ],

                showModal: false,

                tableLoading: false,
                total: 0,
                page: 1,
                pageSize: 10,
                sortOrder: 'desc',
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
                this.query_promotion_list();
            },
            removeUrl(item) {
                const _this = this;
                if (item.url.indexOf('base') !== -1) {
                    document.getElementById(item.type).value = '';
                    _this.selectionItem.imageUrlBean[item.type] = '';
                    item.url = null;
                    item.file = null;
                    item.show = false;
                    return;
                }
                let params = {
                    id: _this.selectionItem.id,
                    imageType: item.type
                };
                _this.$Spin.show();
                api.post('delete_promotion_img', null, params).then(res => {
                    //console.log(res);
                    _this.$Spin.hide();
                    document.getElementById(item.type).value = '';
                    _this.selectionItem.imageUrlBean[item.type] = '';
                    item.url = null;
                    item.file = null;
                    item.show = false;
                    _this.query_promotion_list();
                }).catch(err => {
                    //console.error(err);
                    _this.$Spin.hide();
                    _this.tableLoading = false;
                    _this.$Message.error({
                        content: err.message || (item.label + '图片删除失败'),
                        duration: 3
                    });
                })
            },
            selectFile(item) {
                const _this = this;
                let inputFile = document.getElementById(item.type);
                if (inputFile.files && inputFile.files.length) {
                    let file = inputFile.files[0];
                    /*if (file.size > 300000) {
                        inputFile.value = '';
                        return _this.$Message.warning({
                            content: '图片大小必须小于300KB',
                            duration: 3
                        });
                    }*/
                    let fileType = file.type.split('/')[1].toLowerCase();
                    if (['jpeg', 'jpg', 'png', 'gif'].indexOf(fileType) === -1) {
                        return _this.$Message.warning({
                            content: '图片格式只支持jpg/png/gif',
                            duration: 3
                        });
                    } else {
                        let reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = function () {
                            item.url = reader.result;
                            item.file = reader.result;
                        };
                    }
                }
            },
            handlePromotion(type) {
                const _this = this;
                if (type === 'create') {
                    _this.selectionItem = {
                        name: null,
                        memo: null,
                        imageName: null,
                        imageUrlBean: {}
                    };
                    _this.coverImgList = [
                        {
                            type: 'web',
                            label: 'PC端',
                            url: null,
                            show: false,
                            file: null
                        },
                        {
                            type: 'iph',
                            label: '移动端',
                            url: null,
                            show: false,
                            file: null
                        },
                        {
                            type: 'atv',
                            label: 'TV端',
                            url: null,
                            show: false,
                            file: null
                        },
                        {
                            type: 'ipd',
                            label: 'Pad端',
                            url: null,
                            show: false,
                            file: null
                        }
                    ]
                } else {
                    if (_this.selectionItem.imageUrlBean) {
                        _this.coverImgList.forEach(item => {
                            item.url = _this.selectionItem.imageUrlBean[item.type];
                            item.file = null;
                        })
                    }
                }
                this.showModal = true;
            },
            confirm() {
                const _this = this;
                _this.coverImgList.forEach((item, index) => {
                    _this.selectionItem['image' + (index + 1)] = item.file;
                });

                if (!_this.selectionItem.name) {
                    return _this.$Message.error({
                        content: '促销标题不能为空',
                        duration: 3
                    });
                }
                if (_this.selectionItem.name.length > 20) {
                    return _this.$Message.error({
                        content: '约束名称长度限制1-20个汉字',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.imageName) {
                    return _this.$Message.error({
                        content: '图片名称不能为空',
                        duration: 3
                    });
                }
                if (_this.selectionItem.imageName.length > 20) {
                    return _this.$Message.error({
                        content: '图片名称长度限制1-20个汉字',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.memo) {
                    return _this.$Message.error({
                        content: '图片描述不能为空',
                        duration: 3
                    });
                }
                if (_this.selectionItem.memo.length > 255) {
                    return _this.$Message.error({
                        content: '图片描述长度限制1-255个汉字',
                        duration: 3
                    });
                }
                _this.$Spin.show();
                api.post('save_task_promotion', null, _this.selectionItem).then(res => {
                    //console.log(res);
                    _this.showModal = false;
                    _this.$Spin.hide();
                    _this.query_promotion_list();
                }).catch(err => {
                    //console.error(err);
                    _this.$Spin.hide();
                    _this.$Message.error({
                        content: err.message || (_this.selectionItem.id ? '修改促销失败' : '新建促销失败'),
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_promotion_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_promotion_list();
                }
            },
            query_promotion_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    page: _this.page,
                    pageSize: _this.pageSize,
                    memo: _this.memo,
                    imageName: _this.imageName,
                    id: _this.id,
                    name: _this.name,
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_task_promotion', null, params).then(res => {
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
                        content: err.message || '获取促销列表失败',
                        duration: 3
                    });
                })
            },
        },
        mounted: function () {
            const _this = this;
            _this.query_promotion_list('init');

            if (window.location.href.split('?')[1] === 'type=create') {
                _this.handlePromotion('create');
            }
        },
        created() {
            this.$store.commit('updatePathName');
        }
    }
</script>

<style scoped lang="less">
    .content {
        max-height: 500px;
        overflow-y: auto;
        p {
            margin-bottom: 10px;
            span {
                display: inline-block;
                width: 90px;
            }
        }
        .uploadImg {
            position: relative;
            display: inline-block;
            width: 22%;
            vertical-align: top;
        }
        .uploadCoverImg {
            display: inline-block;
            width: 100px;
            height: 100px;
            border: 1px dashed #ccc;
            position: relative;
            transition: 200ms;
            &:hover {
                border-color: dodgerblue;
            }
            b, input {
                display: inline-block;
                width: 100%;
                height: 100%;
                position: absolute;
                opacity: 0;
                z-index: 10;
                left: 0;
                top: 0;
            }
            img {
                max-width: 100%;
                max-height: 100%;
            }
            video {
                max-width: 100%;
                max-height: 100%;
            }
            .mask {
                background-color: rgba(0, 0, 0, .3);
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                z-index: 100;
                line-height: 100px;
                text-align: center;
                color: #fff;
            }
        }
    }
</style>
