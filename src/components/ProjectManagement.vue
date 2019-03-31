<template>
    <div class="projectManagement">
        <div style="margin-bottom: 5px;">
            <Input v-model="id" clearable placeholder="项目编码" style="width: 200px; margin: 0 5px 5px 0"/>
            <Input v-model="name" clearable placeholder="项目名称" style="width: 200px; margin: 0 5px 5px 0"/>
            <Select v-model="state" style="width: 100px; margin: 0 5px 5px 0" placeholder="项目状态" clearable>
                <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="hot" style="width: 100px; margin: 0 5px 5px 0" placeholder="热门标签" clearable>
                <Option v-for="item in hotList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="default" @click="query_project_list('init')" style="margin: 0 5px 5px 0">查找</Button>
            <Button type="primary" style="float: right" @click="handleProject('create')">新建项目</Button>
        </div>

        <!--项目列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" @on-sort-change="sort" height="600"></Table>

        <!--分页-->
        <Page v-if="total" :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>

        <!--修改弹框-->
        <Modal :mask-closable="false" v-model="showModal" width="800" :title="(selectionItem && selectionItem.id) ? '修改项目' : '新建项目'" :styles="{top: '10px'}">
            <div class="content">
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 项目名称</span>
                    <Input v-model="selectionItem.name" placeholder="不超过7个汉字" :maxlength="7" clearable style="width: 200px;"/>

                    <span style="margin-left: 50px">项目描述</span>
                    <Input v-model="selectionItem.memo" placeholder="不超过12个汉字" :maxlength="12" clearable style="width: 200px;"/>
                </p>
                <p style="font-size: 14px;">项目图片 <span style="color: red; font-size: 12px; width: 600px;">（注：图片格式PNG / JPG / GIF，PC端为60*60px，移动端为100*100px）</span></p>
                <div class="uploadImg" style="margin-bottom: 10px;" v-for="(item, index) in imageUrlList" :key="index + 1000">
                    <span style="display: inline-block; width: 50px; text-align: left; vertical-align: top;">{{item.label}}</span>
                    <div class="uploadCoverImg" @mousemove="item.show = true" @mouseleave="item.show = false">
                        <Icon type="ios-camera" size="30" v-if="!item.url" style="float: left"></Icon>
                        <input type="file" :id="item.type" @change="selectFile(item)">
                        <img :src="item.url" alt="">
                        <div class="mask" :style="{display: (item.url && item.show) ? 'inline-block' : 'none'}">
                            <Icon size="30" type="ios-trash-outline" style="cursor: pointer" @click.native="removeUrl(item)"></Icon>
                        </div>
                    </div>
                </div>
                <p>
                    <span>上线时间</span>
                    <DatePicker v-model="selectionItem.publishTimeFormat" type="datetime" clearable style="width: 200px;"></DatePicker>

                    <span style="margin-left: 107px;">下线时间</span>
                    <DatePicker v-model="selectionItem.downTimeFormat" type="datetime" clearable style="width: 200px;"></DatePicker>

                    <!--<span style="position: relative; top: 1px; margin-left: 4px; padding-left: 20px; width: 150px;">项目详情验证一账通</span>
                    <RadioGroup v-model="selectionItem.onOff">
                        <Radio :label="1">
                            <span style="width: 30px;">是</span>
                        </Radio>
                        <Radio :label="0">
                            <span style="width: 30px;">否</span>
                        </Radio>
                    </RadioGroup>-->
                </p>
                <p>
                    <span style="position: relative; top: 1px;"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 项目状态</span>
                    <RadioGroup v-model="selectionItem.state">
                        <Radio :label="1">
                            <span style="width: 30px;">上线</span>
                        </Radio>
                        <Radio :label="0">
                            <span style="width: 30px;">下线</span>
                        </Radio>
                    </RadioGroup>

                    <span style="position: relative; top: 1px; margin-left: 4px; padding-left: 20px;"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 热门标签</span>
                    <RadioGroup v-model="selectionItem.hot">
                        <Radio :label="1">
                            <span style="width: 30px;">是</span>
                        </Radio>
                        <Radio :label="0">
                            <span style="width: 30px;">否</span>
                        </Radio>
                    </RadioGroup>

                    <span style="width: 60px; margin-left: 50px"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 项目类型</span>
                    <Select v-model="selectionItem.collection" style="width: 140px">
                        <Option v-for="item in collectionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </p>
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 展示顺序</span>
                    <InputNumber :min="1" :max="999" v-model="selectionItem.displayOrder" clearable style="width: 160px;"></InputNumber>

                    <span style="margin-left: 25px; width: 90px;">项目详情文案</span>
                    <Input v-model="selectionItem.buttonLabel1" placeholder="不超过9个汉字" :maxlength="9" clearable style="width: 322px;"/>
                </p>
                <p v-if="selectionItem.buttonLabel1" style="font-size: 14px;">(项目详情文案)跳转地址：<span style="color: red; width: 600px; font-size: 12px;"><!--（注：如果需要打开站外APP，请填写：外部路由地址$$$正常跳转地址，优先打开外部路由地址）--></span></p>
                <p v-if="selectionItem.buttonLabel1" v-for="(item, index) in urlList" :key="index">
                    <Select v-model="item.type" style="width: 200px" @on-change="updateGoUrl">
                        <Option v-for="item in typeList" :disabled="item.disabled" :value="item.value" :key="item.value + 100">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="item.url" clearable style="width: 490px;"/>
                    <Icon style="font-size: 20px; cursor: pointer;" type="ios-add-circle-outline" v-if="!index" @click="addGoUrl" />
                    <Icon style="font-size: 20px; cursor: pointer; color: red;" type="ios-close" v-if="index" @click="removeGoUrl(index)" />
                </p>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="error" @click="showModal = false">取消</Button>
                <Button type="success" @click="confirm">{{(selectionItem && selectionItem.id) ? '修改' : '新建'}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import api from '../libs/API'
    import utils from '../libs/utils'

    export default {
        name: "projectManagement",
        data() {
            return {
                id: null,
                name: null,
                state: null,
                stateList: [
                    {
                        label: '上线',
                        value: 1
                    },
                    {
                        label: '下线',
                        value: 0
                    }
                ],
                hot: null,
                hotList: [
                    {
                        label: '是',
                        value: 1
                    },
                    {
                        label: '否',
                        value: 0
                    }
                ],
                columns: [
                    {
                        title: '序号',
                        key: 'serialNum',
                        width: 100
                    },
                    {
                        title: '项目编码',
                        key: 'id',
                        sortable: true
                    },
                    {
                        title: '项目名称',
                        key: 'name'
                    },
                    {
                        title: '项目类型',
                        key: 'collectionFormat',
                        width: 85,
                        align: 'center'
                    },
                    {
                        title: '项目状态',
                        key: 'stateFormat',
                        width: 90,
                        align: 'center'
                    },
                    {
                        title: '上线时间',
                        width: 105,
                        key: 'publishTimeFormat',
                        sortable: true
                    },
                    {
                        title: '下线时间',
                        width: 105,
                        key: 'downTimeFormat',
                        sortable: true
                    },
                    {
                        title: '热门标签',
                        key: 'hotFormat',
                        width: 85,
                        align: 'center'
                    },
                    {
                        title: '展示顺序',
                        key: 'displayOrder',
                        width: 70,
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTimeFormat',
                        sortable: true,
                        width: 105
                    },
                    {
                        title: '更多操作',
                        key: 'action',
                        width: 125,
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
                                            this.handleProject('update');
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: params.row.state ? 'error' : 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginLeft: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            const _this = this;
                                            _this.$Spin.show();
                                            api.post('switch_project_state', null, {
                                                id: params.row.id,
                                                state: params.row.state ? 0 : 1
                                            }).then(res => {
                                                //console.log(res);
                                                _this.$Spin.hide();
                                                _this.query_project_list();
                                            }).catch(err => {
                                                //console.error(err);
                                                _this.$Spin.hide();
                                                _this.$Message.error({
                                                    content: err.message || (params.row.state ? '项目下线失败' : '项目上线失败'),
                                                    duration: 3
                                                });
                                            });
                                        }
                                    }
                                }, params.row.state ? '下线' : '上线')
                            ]);
                        }
                    }
                ],
                handleType: null,
                selectionItem: {
                    id: null,
                    name: null,
                    memo: null,
                    state: null,
                    hot: null,
                    collection: null,
                    buttonLabel1: null,
                    displayOrder: null,
                    publishTime: null,
                    downTime: null,
                    goUrlBean: {}
                },
                collectionList: [
                    {
                        label: '标准',
                        value: 0
                    },
                    {
                        label: '剧集',
                        value: 1
                    }
                ],
                imageUrlList: [
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
                dataList: [],
                showModal: false,
                tableLoading: false,

                urlList: [
                    {
                        type: null,
                        url: null
                    }
                ],
                typeList: [
                    {
                        label: 'iPhone端',
                        type: 'iph',
                        value: 0,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: 'Android端',
                        type: 'aph',
                        value: 1,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: 'PC浏览器',
                        type: 'web',
                        value: 2,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: '手机浏览器',
                        type: 'wap',
                        value: 3,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: 'Windows客户端',
                        type: 'clt',
                        value: 4,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: 'Mac客户端',
                        type: 'mac',
                        value: 5,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: 'AndroidPad端',
                        type: 'apd',
                        value: 6,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: 'iPad端',
                        type: 'ipd',
                        value: 7,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: 'TV端',
                        type: 'atv',
                        value: 8,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: '电视盒子',
                        type: 'box',
                        value: 9,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: 'WinPhone端',
                        type: 'wph',
                        value: 10,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: 'WinPad端',
                        type: 'wpd',
                        value: 11,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: 'Flash播放器',
                        type: 'flp',
                        value: 12,
                        publishState: '0',
                        disabled: false
                    },
                    {
                        label: '其他（例如：电冰箱、投影仪、微波炉等）',
                        type: 'misc',
                        value: 13,
                        publishState: '0',
                        disabled: false
                    },
                ],

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
                this.query_project_list();
            },
            updateGoUrl(value) {
              //console.log(value);
                if (!value && (value !== 0)) return;
                const _this = this;
                let list = [];
                _this.urlList.forEach(item => {
                    if ((item.type === 0) || item.type) {
                        list.push(item.type);
                    }
                });
                _this.typeList.forEach(item => {
                    item.disabled = (list.indexOf(item.value) !== -1);
                });
            },
            addGoUrl() {
                const _this = this;
                _this.urlList.push({
                    type: null,
                    url: null
                })
            },
            removeGoUrl(index) {
                const _this = this;
                if (_this.urlList[index].type) {
                    _this.typeList[_this.urlList[index].type].disabled = false;
                }
                _this.urlList.splice(index, 1);
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
                api.post('delete_project_img', null, params).then(res => {
                    //console.log(res);
                    _this.$Spin.hide();
                    document.getElementById(item.type).value = '';
                    _this.selectionItem.imageUrlBean[item.type] = '';
                    item.url = null;
                    item.file = null;
                    item.show = false;
                    _this.query_project_list();
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
            query_project_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    id: _this.id,
                    name: _this.name,
                    state: _this.state,
                    hot: _this.hot,
                    page: _this.page,
                    pageSize: _this.pageSize,
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_project_list', null, params).then(res => {
                    //console.log(res);
                    res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                        item.stateFormat = item.state ? '上线' : '下线';
                        item.hotFormat = item.hot ? '是' : '否';
                        item.collectionFormat = item.collection ? '剧集' : '标准';
                        item.publishTimeFormat = utils.dateFormat(item.publishTime, 'YYYY-MM-DD hh:mm:ss');
                        item.downTimeFormat = utils.dateFormat(item.downTime, 'YYYY-MM-DD hh:mm:ss');
                        item.createTimeFormat = utils.dateFormat(item.createTime, 'YYYY-MM-DD hh:mm:ss');
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
                        content: err.message || '项目列表查询失败',
                        duration: 3
                    });
                })
            },
            switchState() {
                const _this = this;
                _this.$Spin.show();
                let params = {
                    id: _this.selectionItem.id,
                    state: _this.selectionItem.state
                };
                api.post('switch_project_state', null, params).then(res => {
                    //console.log(res);
                    _this.tableLoading = true;
                    _this.query_project_list();
                }).catch(err => {
                    //console.error(err);
                    _this.$Spin.hide();
                })
            },
            handleProject(type) {
                const _this = this;
                if (type === 'create') {
                    _this.selectionItem = {
                        name: null,
                        memo: null,
                        state: null,
                        hot: null,
                        collection: null,
                        buttonLabel1: null,
                        displayOrder: null,
                        publishTime: null,
                        downTime: null,
                        goUrlBean: {},
                        imageUrlBean: {}
                    };
                    _this.urlList = [
                        {
                            type: 0,
                            url: ''
                        }
                    ];
                    _this.imageUrlList = [
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
                    ];
                    _this.typeList = [
                        {
                            label: 'iPhone端',
                            type: 'iph',
                            value: 0,
                            disabled: true
                        },
                        {
                            label: 'Android端',
                            type: 'aph',
                            value: 1,
                            disabled: false
                        },
                        {
                            label: 'PC浏览器',
                            type: 'web',
                            value: 2,
                            disabled: false
                        },
                        {
                            label: '手机浏览器',
                            type: 'wap',
                            value: 3,
                            disabled: false
                        },
                        {
                            label: 'Windows客户端',
                            type: 'clt',
                            value: 4,
                            disabled: false
                        },
                        {
                            label: 'Mac客户端',
                            type: 'mac',
                            value: 5,
                            disabled: false
                        },
                        {
                            label: 'AndroidPad端',
                            type: 'apd',
                            value: 6,
                            disabled: false
                        },
                        {
                            label: 'iPad端',
                            type: 'ipd',
                            value: 7,
                            disabled: false
                        },
                        {
                            label: 'TV端',
                            type: 'atv',
                            value: 8,
                            disabled: false
                        },
                        {
                            label: '电视盒子',
                            type: 'box',
                            value: 9,
                            disabled: false
                        },
                        {
                            label: 'WinPhone端',
                            type: 'wph',
                            value: 10,
                            disabled: false
                        },
                        {
                            label: 'WinPad端',
                            type: 'wpd',
                            value: 11,
                            disabled: false
                        },
                        {
                            label: 'Flash播放器',
                            type: 'flp',
                            value: 12,
                            disabled: false
                        },
                        {
                            label: '其他（例如：电冰箱、投影仪、微波炉等）',
                            type: 'misc',
                            value: 13,
                            disabled: false
                        },
                    ];
                } else {
                    _this.urlList = [];
                    _this.typeList.forEach(item => {
                        if (_this.selectionItem.goUrlBean && _this.selectionItem.goUrlBean[item.type]) {
                            _this.urlList.push({
                                type: item.value,
                                url: _this.selectionItem.goUrlBean[item.type]
                            });
                            item.disabled = true;
                        } else {
                            item.disabled = false;
                        }
                    });
                    if (!_this.urlList.length) {
                        _this.urlList = [
                            {
                                type: 0,
                                url: ''
                            }
                        ];
                        _this.typeList[0].disabled = true;
                    }
                    if (_this.selectionItem.imageUrlBean) {
                        _this.imageUrlList.forEach(item => {
                            item.url = _this.selectionItem.imageUrlBean[item.type];
                            item.file = null;
                        })
                    }
                }
                this.showModal = true;
            },
            confirm() {
                const _this = this;
                let list = {};
                _this.urlList.forEach(item => {
                    if (item.type || (item.type === 0)) {
                        list[_this.typeList[item.type].type] = item.url;
                    }
                });
                for (let type in _this.selectionItem.goUrlBean) {
                    if (_this.selectionItem.goUrlBean.hasOwnProperty(type)) {
                        _this.selectionItem.goUrlBean[type] = _this.selectionItem.buttonLabel1 ? (list[type] || '') : '';
                    }
                }
                _this.typeList.forEach(item => {
                    _this.selectionItem.goUrlBean[item.type] = _this.selectionItem.goUrlBean[item.type] || '';
                });
                _this.imageUrlList.forEach((item, index) => {
                    //_this.selectionItem.imageUrl[item.type] = item.url;
                    _this.selectionItem['image' + (index + 1)] = item.file;
                });
                _this.selectionItem.publishTime = new Date(_this.selectionItem.publishTimeFormat).getTime();
                _this.selectionItem.downTime = new Date(_this.selectionItem.downTimeFormat).getTime();
                //return //console.log(_this.selectionItem);
                if (!_this.selectionItem.name) {
                    return _this.$Message.warning({
                        content: '项目名称不能为空',
                        duration: 3
                    });
                }
                if (_this.selectionItem.memo && (_this.selectionItem.memo.length > 12)) {
                    return _this.$Message.warning({
                        content: '项目描述不能超过12个字',
                        duration: 3
                    });
                }
                if (_this.selectionItem.state === null) {
                    return _this.$Message.warning({
                        content: '项目状态为必选',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.hot && (_this.selectionItem.hot !== 0)) {
                    return _this.$Message.warning({
                        content: '热门标签为必选',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.collection && (_this.selectionItem.collection !== 0)) {
                    return _this.$Message.warning({
                        content: '项目类型为必选',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.displayOrder) {
                    return _this.$Message.warning({
                        content: '展示顺序为必填',
                        duration: 3
                    });
                }
                _this.$Spin.show();
                api.post('save_project', null, _this.selectionItem).then(res => {
                    //console.log(res);
                    _this.showModal = false;
                    _this.$Spin.hide();
                    _this.query_project_list();
                }).catch(err => {
                    //console.error(err);
                    _this.$Spin.hide();
                    _this.$Message.error({
                        content: err.message || (_this.selectionItem.id ? '修改项目失败' : '新建项目失败'),
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_project_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_project_list();
                }
            }
        },
        mounted: function () {
            const _this = this;
            _this.query_project_list('init');

            if (window.location.href.split('?')[1] === 'type=create') {
                _this.handleProject('init');
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
