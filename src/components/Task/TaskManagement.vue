<template>
    <div class="taskManagement">
        <div style="margin-bottom: 5px; position: relative;" @keyup.enter="query_task_list('init')">
            <Select v-model="projectId" clearable style="width: 200px; margin: 0 5px 5px 0" placeholder="所属项目">
                <Option v-for="item in allProjectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="hot" clearable style="width: 100px; margin: 0 5px 5px 0" placeholder="热门标签">
                <Option v-for="item in hotList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="onOff" clearable style="width: 100px; margin: 0 5px 5px 0" placeholder="任务状态">
                <Option v-for="item in onOffList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input v-model="id" clearable placeholder="任务ID" style="width: 100px; margin: 0 5px 5px 0"/>
            <Input v-model="name" clearable placeholder="任务名称" style="width: 200px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_task_list('init')" style="margin: 0 5px 5px 0">查找</Button>
            <Button type="primary" style="float: right" @click="handleTask('create')">新建任务</Button>
        </div>

        <!--任务列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" @on-sort-change="sort" height="600"></Table>

        <!--分页-->
        <Page v-if="total" :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>

        <!--编辑弹框-->
        <Modal :mask-closable="false" v-model="showModal" width="800" :title="(selectionItem && selectionItem.id) ? '修改任务' : '新建任务'" :styles="{top: '10px'}">
            <div class="content">
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 选择场景</span>
                    <Select v-model="selectionItem.sceneId" style="width: 200px">
                        <Option v-for="item in sceneList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                </p>
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 选择项目</span>
                    <Select v-model="selectionItem.projectId" style="width: 200px">
                        <Option v-for="item in projectList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                    </Select>
                    <Icon style="font-size: 25px; cursor: pointer; position: relative; top: 1px;" type="ios-refresh" @click="refreshList('project')"/>
                    <Icon style="font-size: 20px; cursor: pointer" type="ios-add-circle-outline" @click="addNew('project')"/>

                    <span style="margin-left: 48px;"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 选择约束</span>
                    <Select v-model="selectionItem.constraintId" style="width: 200px">
                        <Option v-for="item in constraintList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Icon style="font-size: 25px; cursor: pointer; position: relative; top: 1px;" type="ios-refresh" @click="refreshList('constraint')"/>
                    <Icon style="font-size: 20px; cursor: pointer" type="ios-add-circle-outline" @click="addNew('constraint')"/>
                </p>
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 选择奖池</span>
                    <Select v-model="selectionItem.prizePoolId" style="width: 200px">
                        <Option v-for="item in prizePoolList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Icon style="font-size: 25px; cursor: pointer; position: relative; top: 1px;" type="ios-refresh" @click="refreshList('prizePool')"/>
                    <Icon style="font-size: 20px; cursor: pointer" type="ios-add-circle-outline" @click="addNew('prizePool')"/>

                    <!--<span style="margin-left: 56px; width: 82px">&lt;!&ndash;<span style="color: red; width: 5px; position: relative; top: 2px;">*</span>&ndash;&gt; 选择促销</span>
                    <Select v-model="selectionItem.salePromotionId" style="width: 200px" clearable>
                        <Option v-for="item in promotionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>-->
                    <!--<Icon style="font-size: 25px; cursor: pointer; position: relative; top: 1px;" type="ios-refresh" @click="refreshList('promotion')"/>
                    <Icon style="font-size: 20px; cursor: pointer" type="ios-add-circle-outline" @click="addNew('promotion')"/>-->
                </p>
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 任务名称</span>
                    <Input v-model="selectionItem.name" placeholder="不超过12个汉字，剧集任务标题超过9个汉字播放器里会换行显示" :maxlength="12" clearable style="width: 400px;"/>
                </p>
                <p>
                    <span style="vertical-align: top"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 任务描述</span>
                    <textarea name="memo" id="taskMemo" cols="95" rows="5" v-model="selectionItem.memo" :maxlength="1024" placeholder="不超过1024个汉字，支持换行"></textarea>
                </p>
                <div class="uploadImg" style="margin-bottom: 10px;" v-for="(item, index) in coverImgList" :key="index">
                    <span style="display: inline-block; width: 50px; text-align: left; vertical-align: top;" :style="{paddingLeft: index ? '10px' : ''}">{{item.label}}</span>
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
                    <span style="width: 60px; position: relative; top: 1px;"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 任务状态</span>
                    <RadioGroup v-model="selectionItem.onOff">
                        <Radio :label="1">
                            <span style="width: 30px;">开</span>
                        </Radio>
                        <Radio :label="0">
                            <span style="width: 30px;">关</span>
                        </Radio>
                    </RadioGroup>

                    <span style="width: 70px; position: relative; top: 1px; margin-left: 50px;"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 热门标签</span>
                    <RadioGroup v-model="selectionItem.hot">
                        <Radio :label="1">
                            <span style="width: 30px;">是</span>
                        </Radio>
                        <Radio :label="0">
                            <span style="width: 30px;">否</span>
                        </Radio>
                    </RadioGroup>

                    <span style="width: 60px; position: relative; top: 1px; margin-left: 50px;"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 自动发奖</span>
                    <RadioGroup v-model="selectionItem.autoSendPrize">
                        <Radio :label="1">
                            <span style="width: 30px;">是</span>
                        </Radio>
                        <Radio :label="0">
                            <span style="width: 30px;">否</span>
                        </Radio>
                    </RadioGroup>
                </p>
                <!--<p>
                    <span style="width: 60px; position: relative; top: 2px;">触达任务</span>
                    <RadioGroup v-model="selectionItem.do">
                        <Radio label="yes">
                            <span style="width: 30px;">是</span>
                        </Radio>
                        <Radio label="no">
                            <span style="width: 30px;">否</span>
                        </Radio>
                    </RadioGroup>

                    <span style="width: 100px; margin-left: 50px; position: relative; top: 2px;">在任务中心隐藏</span>
                    <RadioGroup v-model="selectionItem.hide">
                        <Radio label="yes">
                            <span style="width: 30px;">隐藏</span>
                        </Radio>
                        <Radio label="no">
                            <span style="width: 30px;">显示</span>
                        </Radio>
                    </RadioGroup>
                </p>-->
                <p>
                    <!--<span style="width: 90px;">剧集标题集数</span>
                    <Input v-model="selectionItem.index" clearable placeholder="剧集集数" style="width: 150px;"/>-->
                    <span>上线时间</span>
                    <DatePicker v-model="selectionItem.publishTimeFormat" type="datetime" clearable style="width: 200px;"></DatePicker>

                    <span style="margin-left: 100px;">下线时间</span>
                    <DatePicker v-model="selectionItem.downTimeFormat" type="datetime" clearable style="width: 200px;"></DatePicker>

                    <!--<span style="margin-left: 25px; width: 90px;">任务详情文案</span>
                    <Input v-model="selectionItem.detail" clearable placeholder="任务详情文案" style="width: 210px;"/>-->
                </p>
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 展示顺序</span>
                    <InputNumber :min="1" :max="999" v-model="selectionItem.displayOrder" clearable style="width: 150px;"></InputNumber>

                    <span style="margin-left: 25px;">按钮文案1</span>
                    <Input v-model="selectionItem.buttonLabel1" placeholder="默认显示去完成" :maxlength="4" clearable style="width: 100px;"/>

                    <span style="width: 90px; margin-left: 25px;">按钮文案2</span>
                    <Input v-model="selectionItem.buttonLabel2" clearable placeholder="默认显示领奖" :maxlength="4" style="width: 100px;"/>
                </p>
                <p>
                    <span>按钮文案3</span>
                    <Input v-model="selectionItem.buttonLabel3" placeholder="默认显示已完成" :maxlength="4" clearable style="width: 150px;"/>

                    <span style="margin-left: 25px;">按钮文案4</span>
                    <Input v-model="selectionItem.buttonLabel4" clearable :maxlength="4" style="width: 100px;"/>

                    <span style="margin-left: 25px;">按钮文案5</span>
                    <Input v-model="selectionItem.buttonLabel5" clearable :maxlength="4" style="width: 100px;"/>
                </p>
                <!--<p>
                    <span style="width: 90px;">发布平台</span>
                    <Select v-model="selectionItem.typeList" multiple style="width: 600px">
                        <Option v-for="(item, index) in typeList" :value="item.value" :key="100 - index">{{ item.label }}</Option>
                    </Select>
                </p>-->
                <p style="font-size: 14px;">(去完成)跳转地址: <span style="color: red; width: 600px; font-size: 12px;"><!--（注：如果需要打开站外APP，请填写：外部路由地址$$$正常跳转地址，优先打开外部路由地址）--></span>
                </p>
                <p v-for="(item, index) in urlList" :key="index + 200">
                    <Select v-model="item.type" style="width: 200px" @on-change="updateGoUrl">
                        <Option v-for="item in typeList" :disabled="item.disabled" :value="item.value" :key="item.value + 100">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="item.url" clearable style="width: 490px;"/>
                    <Icon style="font-size: 20px; cursor: pointer;" type="ios-add-circle-outline" v-if="!index" @click="addGoUrl"/>
                    <Icon style="font-size: 20px; cursor: pointer; color: red;" type="ios-close" v-if="index" @click="removeGoUrl(index)"/>
                </p>
                <p style="font-size: 14px;"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 发布平台 <span style="font-size: 12px; color: red; width: 500px;">（注：至少选一个要发布的平台）</span></p>
                <p style="padding-left: 20px;">
                    <Checkbox true-value="1" false-value="0" style="margin-bottom: 10px;" :style="{width: (index === (typeList.length - 1)) ? '70%' : '23%'}" v-model="item.publishState" v-for="(item, index) in typeList" :key="index">{{item.label}}</Checkbox>
                </p>
                <p style="font-size: 14px;">消息通知</p>
                <p style="position: relative; padding-left: 20px;">
                    <span style="width: 100px; vertical-align: top;"><Checkbox v-model="selectionItem.sendSiteMessage" :true-value="1" :false-value="0" @on-change="siteStateChange">站内信</Checkbox></span>
                    <Input v-model="selectionItem.siteMessageTitle" :disabled="!selectionItem.sendSiteMessage" :clearable="!!selectionItem.sendSiteMessage" placeholder="标题，长度限制1-64个汉字" :maxlength="64" style="width: 408px; position: absolute; left: 123px; top: -8px;"/>
                    <textarea v-model="selectionItem.siteMessage" style="margin-top: 30px; transition: 200ms" :disabled="!selectionItem.sendSiteMessage" name="message" id="message" cols="63" rows="5" :maxlength="128" placeholder="内容，长度限制1-128个汉字" :style="{backgroundColor: (selectionItem.sendSiteMessage ? '#ffffff' : '#F3F3F3')}"></textarea>
                </p>
                <p style="padding-left: 20px;">
                    <span style="width: 100px; vertical-align: top;"><Checkbox v-model="selectionItem.sendPushMessage" :true-value="1" :false-value="0" @on-change="pushStateChange">PUSH</Checkbox></span>
                    <textarea v-model="selectionItem.pushMessage" placeholder="长度限制1-128个汉字" :maxlength="128" :disabled="!selectionItem.sendPushMessage" name="push" id="push" cols="30" rows="5" style="width: 408px;" :style="{backgroundColor: (selectionItem.sendPushMessage ? '#FFFFFF' : '#F3F3F3')}"></textarea>
                </p>
                <p style="padding-left: 20px;">
                    <span style="width: 100px; vertical-align: top;"><Checkbox v-model="selectionItem.sendShortMessage" :true-value="1" :false-value="0" @on-change="shortStateChange">短信通知</Checkbox></span>
                    <textarea v-model="selectionItem.shortMessage" placeholder="长度限制1-70个汉字" :maxlength="70" :disabled="!selectionItem.sendShortMessage" name="sms" id="sms" cols="30" rows="5" style="width: 408px;" :style="{backgroundColor: (selectionItem.sendShortMessage ? '#FFFFFF' : '#F3F3F3')}"></textarea>
                </p>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="error" @click="showModal = false">取消</Button>
                <Button type="success" @click="confirm">{{(selectionItem && selectionItem.id) ? '修改' : '新建'}}</Button>
              <!--<Button type="success" @click="confirm" :loading="refreshCount !== 5">{{(selectionItem && selectionItem.id) ? '修改' : '新建'}}</Button>-->
            </div>
        </Modal>
    </div>
</template>

<script>
    import api from '../../libs/API'
    import utils from '../../libs/utils'
    import async from 'async'

    export default {
        name: "TaskManagement",
        data() {
            return {
                id: null,
                name: null,
                projectId: null,
                allProjectList: [],
                projectList: [],
                sceneList: [],
                prizePoolList: [],
             /*   constraintList: [],*/
                promotionList: [],
                onOff: null,
                onOffList: [
                    {
                        label: '开',
                        value: 1
                    },
                    {
                        label: '关',
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
                        title: '任务ID',
                        key: 'id',
                        sortable: true
                    },
                    {
                        title: '任务名称',
                        key: 'name'
                    },
                    {
                        title: '所属项目',
                        key: 'projectName'
                    },
                    {
                        title: '任务状态',
                        key: 'onOffFormat',
                        width: 65,
                        align: 'center'
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
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '创建时间',
                        key: 'createTimeFormat',
                        width: 105,
                        sortable: true
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
                                            const _this = this;
                                            _this.$Spin.show();
                                            api.post('query_task_detail', null, {
                                                id: params.row.id
                                            }).then(res => {
                                                //console.log(res);
                                                _this.$Spin.hide();
                                                res.data.publishTimeFormat = utils.dateFormat(res.data.publishTime, 'YYYY-MM-DD hh:mm:ss');
                                                res.data.downTimeFormat = utils.dateFormat(res.data.downTime, 'YYYY-MM-DD hh:mm:ss');
                                                _this.selectionItem = res.data;
                                                _this.coverImgList[0].url = _this.selectionItem.imageUrl.web;
                                                _this.coverImgList[1].url = _this.selectionItem.imageUrl.wap;
                                                _this.coverImgList[2].url = _this.selectionItem.imageUrl.atv;
                                                _this.coverImgList[3].url = _this.selectionItem.imageUrl.ipd;
                                                _this.handleTask('update');
                                            }).catch(err => {
                                                //console.error(err);
                                                _this.$Spin.hide();
                                                _this.$Message.error({
                                                    content: err.message || '查询任务详情失败',
                                                    duration: 3
                                                });
                                            });
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: params.row.onOff ? 'error' : 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginLeft: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            const _this = this;
                                            _this.$Spin.show();
                                            api.post('switch_task_state', null, {
                                                id: params.row.id,
                                                onOff: params.row.onOff ? 0 : 1
                                            }).then(res => {
                                                //console.log(res);
                                                _this.$Spin.hide();
                                                _this.query_task_list();
                                            }).catch(err => {
                                                //console.error(err);
                                                _this.$Spin.hide();
                                                _this.$Message.error({
                                                    content: err.message || (params.row.onOff ? '任务关闭失败' : '任务开启失败'),
                                                    duration: 3
                                                });
                                            });
                                        }
                                    }
                                }, params.row.onOff ? '关闭' : '开启')
                            ]);
                        }
                    }
                ],
                selectionItem: {
                    id: null,
                    name: null,
                    memo: null,
                    onOff: null,
                    hot: null,
                    sendShortMessage: null,
                    sendPushMessage: null,
                    sendSiteMessage: null,
                    publishTime: null,
                    downTime: null,
                    createTime: null,
                    shortMessage: null,
                    pushMessage: null,
                    siteMessageTitle: null,
                    siteMessage: null,
                    sceneId: null,
               /*     constraintId: null,*/
                    projectId: null,
                   /* salePromotionId: null,*/
                    prizePoolId: null,
                    displayOrder: null,
                    buttonLabel1: null,
                    buttonLabel2: null,
                    buttonLabel3: null,
                    buttonLabel4: null,
                    buttonLabel5: null,
/*                    autoSendPrize: null,*/
                    goUrl: {},
                    imageUrl: {},
                    platformBean: {}
                },

                coverImgList: [
                    {
                        label: 'PC端',
                        type: 'web',
                        url: null,
                        show: false,
                        file: null
                    },
                    {
                        label: '移动端',
                        type: 'iph',
                        url: null,
                        show: false,
                        file: null
                    },
                    {
                        label: 'TV端',
                        type: 'atv',
                        url: null,
                        show: false,
                        file: null
                    },
                    {
                        label: 'Pad端',
                        type: 'ipd',
                        url: null,
                        show: false,
                        file: null
                    }
                ],
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
                dataList: [],
                showModal: false,
                tableLoading: false,
                refreshCount: 0,

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
                this.query_task_list();
            },
            updateGoUrl(value) {
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
                    _this.selectionItem.imageUrl[item.type] = '';
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
                api.post('delete_task_img', null, params).then(res => {
                    //console.log(res);
                    _this.$Spin.hide();
                    document.getElementById(item.type).value = '';
                    _this.selectionItem.imageUrl[item.type] = '';
                    item.url = null;
                    item.file = null;
                    item.show = false;
                    _this.query_task_list();
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
            query_task_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    id: _this.id,
                    name: _this.name,
                    onOff: _this.onOff,
                    projectId: _this.projectId,
                    hot: _this.hot,
                    page: _this.page,
                    pageSize: _this.pageSize,
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_task_list', null, params).then(res => {
                    console.log(res);
                    res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                        item.onOffFormat = item.onOff ? '开' : '关';
                        item.hotFormat = item.hot ? '是' : '否';
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
                        content: err.message || '任务列表查询失败',
                        duration: 3
                    });
                })
            },
            handleTask(type) {
                const _this = this;
                _this.refreshList('all');
                if (type === 'create') {
                    _this.selectionItem = {
                        id: null,
                        name: null,
                        memo: null,
                        onOff: null,
                        hot: null,
                        sendShortMessage: 0,
                        sendPushMessage: 0,
                        sendSiteMessage: 0,
                        publishTime: null,
                        downTime: null,
                        createTime: null,
                        shortMessage: null,
                        pushMessage: null,
                        siteMessageTitle: null,
                        siteMessage: null,
                        sceneId: null,
                        constraintId: null,
                        projectId: null,
                        salePromotionId: null,
                        prizePoolId: null,
                        displayOrder: null,
                        buttonLabel1: null,
                        buttonLabel2: null,
                        buttonLabel3: null,
                       /* buttonLabel4: null,*/
                       /* buttonLabel5: null,*/
                        autoSendPrize: null,
                        goUrl: {},
                        imageUrl: {},
                        platformBean: {}
                    };
                    _this.urlList = [
                        {
                            type: 0,
                            url: ''
                        }
                    ];
                    _this.typeList = [
                        {
                            label: 'iPhone端',
                            type: 'iph',
                            value: 0,
                            publishState: '0',
                            disabled: true
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
                    ];
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
                    ];
                } else {
                    _this.urlList = [];
                    _this.typeList.forEach(item => {
                        item.publishState = _this.selectionItem.platformBean[item.type];
                        if (_this.selectionItem.goUrl[item.type]) {
                            _this.urlList.push({
                                type: item.value,
                                url: _this.selectionItem.goUrl[item.type]
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
                    if (_this.selectionItem.imageUrl) {
                        _this.coverImgList.forEach(item => {
                            item.url = _this.selectionItem.imageUrl[item.type];
                            item.file = null;
                        })
                    }
                }
                _this.showModal = true;
            },
            confirm() {
                const _this = this;
                let publish_platform_flag = true;
                let list = {};
                _this.urlList.forEach(item => {
                    if (item.type || (item.type === 0)) {
                        list[_this.typeList[item.type].type] = item.url;
                    }
                });
                for (let type in _this.selectionItem.goUrl) {
                    _this.selectionItem.goUrl[type] = list[type] || '';
                }
                _this.typeList.forEach(item => {
                    _this.selectionItem.goUrl[item.type] = _this.selectionItem.goUrl[item.type] || '';
                });
                _this.typeList.forEach(item => {
                    _this.selectionItem.platformBean[item.type] = item.publishState;
                    if (item.publishState === '1') {
                        publish_platform_flag = false;
                    }
                    _this.selectionItem.goUrl[item.type] = _this.selectionItem.goUrl[item.type] || '';
                });
                _this.coverImgList.forEach((item, index) => {
                    //_this.selectionItem.imageUrl[item.type] = item.url;
                    _this.selectionItem['image' + (index + 1)] = item.file;
                });
                _this.selectionItem.publishTime = new Date(_this.selectionItem.publishTimeFormat).getTime();
                _this.selectionItem.downTime = new Date(_this.selectionItem.downTimeFormat).getTime();
                if (!_this.selectionItem.sceneId) {
                    return _this.$Message.warning({
                        content: '场景不能为空',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.projectId) {
                    return _this.$Message.warning({
                        content: '项目不能为空',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.constraintId) {
                    return _this.$Message.warning({
                        content: '约束不能为空',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.prizePoolId) {
                    return _this.$Message.warning({
                        content: '奖池不能为空',
                        duration: 3
                    });
                }
                /*if (!_this.selectionItem.salePromotionId) {
                    return _this.$Message.warning({
                        content: '促销不能为空',
                        duration: 3
                    });
                }*/
                if (!_this.selectionItem.name) {
                    return _this.$Message.warning({
                        content: '任务名称不能为空',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.memo) {
                    return _this.$Message.warning({
                        content: '任务描述不能为空',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.onOff && (_this.selectionItem.onOff !== 0)) {
                    return _this.$Message.warning({
                        content: '任务状态为必选',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.hot && (_this.selectionItem.hot !== 0)) {
                    return _this.$Message.warning({
                        content: '热门标签为必选',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.autoSendPrize && (_this.selectionItem.autoSendPrize !== 0)) {
                    return _this.$Message.warning({
                        content: '自动发奖为必选',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.displayOrder) {
                    return _this.$Message.warning({
                        content: '展示顺序不能为空',
                        duration: 3
                    });
                }
                if (publish_platform_flag) {
                    return _this.$Message.warning({
                        content: '发布平台至少选择一项',
                        duration: 3
                    });
                }
                if (_this.selectionItem.sendSiteMessage) {
                    if (!_this.selectionItem.siteMessageTitle) {
                        return _this.$Message.warning({
                            content: '选择站内信后标题不能为空',
                            duration: 3
                        });
                    }
                    if (!_this.selectionItem.siteMessage) {
                        return _this.$Message.warning({
                            content: '选择站内信后内容不能为空',
                            duration: 3
                        });
                    }
                }
                if (_this.selectionItem.sendPushMessage && !_this.selectionItem.pushMessage) {
                    return _this.$Message.warning({
                        content: '选择PUSH后内容不能为空',
                        duration: 3
                    });
                }
                if (_this.selectionItem.sendShortMessage && !_this.selectionItem.shortMessage) {
                    return _this.$Message.warning({
                        content: '选择短信通知后内容不能为空',
                        duration: 3
                    });
                }
                console.log(_this.selectionItem)
                _this.$Spin.show();
                api.post('save_task', null, _this.selectionItem).then(res => {
                    //console.log(res);
                    _this.showModal = false;
                    _this.$Spin.hide();
                    _this.query_task_list();
                }).catch(err => {
                    //console.error(err);
                    _this.$Spin.hide();
                    _this.$Message.error({
                        content: err.message || (_this.selectionItem.id ? '修改任务失败' : '新建任务失败'),
                        duration: 3
                    });
                })
            },
            changePage(n) {
                this.page = n;
                this.query_task_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_task_list();
                }
            },
            refreshList(type) {
                const _this = this;
                if (type === 'all') {
                    _this.refreshCount = 0;
                }
                if ((type === 'all')) {
                    api.get('query_project_id_and_name').then(res => {
                        _this.allProjectList = [];
                        res.data.forEach(item => {
                            _this.allProjectList.push({
                                label: item.name,
                                value: item.id
                            })
                        });
                    }).catch(err => {
                        //console.error(err);
                        _this.$Message.error({
                            content: err.message || '项目列表查询失败',
                            duration: 3
                        });
                    })
                } else {
                    _this.$Spin.show();
                }
                if ((type === 'project') || (type === 'all')) {
                    if (type === 'project') {
                        _this.selectionItem.projectId = null;
                    }
                    api.get('query_project_id_and_name', {
                        state: 1
                    }).then(res => {
                        _this.projectList = [];
                        res.data.forEach(item => {
                            _this.projectList.push({
                                label: item.name,
                                value: item.id
                            })
                        });
                        if (type === 'project') {
                            _this.$Message.success({
                                content: '项目列表刷新成功',
                                duration: 3
                            });
                            _this.$Spin.hide();
                        } else {
                            _this.refreshCount++;
                        }
                    }).catch(err => {
                        //console.error(err);
                        _this.$Message.error({
                            content: err.message || '项目列表查询失败',
                            duration: 3
                        });
                        if (type !== 'all') {
                            _this.$Spin.hide();
                        }
                    })
                }

                if ((type === 'scene') || (type === 'all')) {
                    if (type === 'scene') {
                        _this.selectionItem.sceneId = null;
                    }
                    api.get('query_scene_id_and_name').then(res => {
                        _this.sceneList = [];
                        console.log(res.data)
                        res.data.forEach(item => {
                            _this.sceneList.push({
                                label: item.name,
                                value: item.id
                            })
                        });
                        if (type === 'scene') {
                            _this.$Message.success({
                                content: '场景列表刷新成功',
                                duration: 3
                            });
                            _this.$Spin.hide();
                        } else {
                            _this.refreshCount++;
                        }
                    }).catch(err => {
                        //console.error(err);
                        _this.$Message.error({
                            content: err.message || '场景列表查询失败',
                            duration: 3
                        });
                        if (type !== 'all') {
                            _this.$Spin.hide();
                        }
                    })
                }

                if ((type === 'prizePool') || (type === 'all')) {
                    if (type === 'prizePool') {
                        _this.selectionItem.prizePoolId = null;
                    }
                    api.get('query_prizePool_id_and_name').then(res => {
                        _this.prizePoolList = [];
                        res.data.forEach(item => {
                            _this.prizePoolList.push({
                                label: item.name,
                                value: item.id
                            })
                        });
                        if (type === 'prizePool') {
                            _this.$Message.success({
                                content: '奖品池列表刷新成功',
                                duration: 3
                            });
                            _this.$Spin.hide();
                        } else {
                            _this.refreshCount++;
                        }
                    }).catch(err => {
                        //console.error(err);
                        _this.$Message.error({
                            content: err.message || '奖品池列表查询失败',
                            duration: 3
                        });
                        if (type !== 'all') {
                            _this.$Spin.hide();
                        }
                    })
                }

                if ((type === 'promotion') || (type === 'all')) {
                    if (type === 'promotion') {
                        _this.selectionItem.salePromotionId = null;
                    }
                    /*api.get('query_task_promotion_id_and_name').then(res => {
                        _this.promotionList = [];
                        res.data.forEach(item => {
                            _this.promotionList.push({
                                label: item.name,
                                value: item.id
                            })
                        });
                        if (type === 'promotion') {
                            _this.$Message.success({
                                content: '促销列表刷新成功',
                                duration: 3
                            });
                            _this.$Spin.hide();
                        } else {
                            _this.refreshCount++;
                        }
                    }).catch(err => {
                        //console.error(err);
                        _this.$Message.error({
                            content: err.message || '促销列表查询失败',
                            duration: 3
                        });
                        if (type !== 'all') {
                            _this.$Spin.hide();
                        }
                    })*/
                }

                if ((type === 'constraint') || (type === 'all')) {
                    if (type === 'constraint') {
                        _this.selectionItem.constraintId = null;
                    }
                    api.get('query_all_constraint').then(res => {
                        _this.constraintList = [];
                        res.data.forEach(item => {
                            _this.constraintList.push({
                                label: item.name,
                                value: item.id
                            })
                        });
                        if (type === 'constraint') {
                            _this.$Message.success({
                                content: '约束列表刷新成功',
                                duration: 3
                            });
                            _this.$Spin.hide();
                        } else {
                            _this.refreshCount++;
                        }
                    }).catch(err => {
                        //console.error(err);
                        _this.$Message.error({
                            content: err.message || '约束列表查询失败',
                            duration: 3
                        });
                        if (type !== 'all') {
                            _this.$Spin.hide();
                        }
                    })
                }
            },
            addNew(type) {
                if (type === 'project') {
                    window.open('/#/project?type=create', '_blank');
                } else if (type === 'constraint') {
                    window.open('/#/constraint/management?type=create', '_blank');
                } else if (type === 'prizePool') {
                    window.open('/#/prize/pool?type=create', '_blank');
                } else if (type === 'promotion') {
                    window.open('/#/task/promotion?type=create', '_blank');
                }
            },
            siteStateChange(state) {
                const _this = this;
                if (!state) {
                    _this.selectionItem.siteMessageTitle = null;
                    _this.selectionItem.siteMessage = null;
                }
            },
            pushStateChange(state) {
                const _this = this;
                if (!state) {
                    _this.selectionItem.pushMessage = null;
                }
            },
            shortStateChange(state) {
                const _this = this;
                if (!state) {
                    _this.selectionItem.shortMessage = null;
                }
            }
        },
        mounted: function () {
            const _this = this;
            _this.query_task_list('init');

            if (window.location.href.split('?')[1] === 'type=create') {
                _this.handleTask('create');
            }
        },
        created() {
            this.$store.commit('updatePathName');

            if (window.location.href.split('?')[1] !== 'type=create') {
                this.refreshList('all');
            }
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
        textarea {
            padding: 5px 7px;
            border-radius: 5px;
            border-color: #ddd;
            color: #515a6e;
        }
        textarea::-webkit-input-placeholder {
            color: #c5c8ce;
        }
        textarea:-moz-placeholder {
            color: #c5c8ce;
        }
        textarea::-moz-placeholder {
            color: #c5c8ce;
        }
        textarea:-ms-input-placeholder {
            color: #c5c8ce;
        }
    }
</style>
