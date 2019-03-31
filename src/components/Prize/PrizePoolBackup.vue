<template>
    <div class="prizePoolBackup">
        <div style="margin-bottom: 5px; position: relative;" @keyup.enter="query_prize_pool_list('init')">
            <Select v-model="type" clearable style="width: 100px; margin: 0 5px 5px 0" placeholder="奖池类型">
                <Option v-for="item in prizeTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input v-model="name" clearable placeholder="奖池名称" style="width: 200px; margin: 0 5px 5px 0"/>
            <Input v-model="id" clearable placeholder="奖池ID" style="width: 100px; margin: 0 5px 5px 0"/>
            <Button type="default" @click="query_prize_pool_list('init')" style="margin: 0 5px 5px 0">查找</Button>
            <Button type="primary" style="float: right; margin-left: 5px;" @click="handlePrizePool('create')">新建奖品池</Button>
            <Button type="success" style="float: right" @click="openModal">我的奖品分类</Button>
        </div>

        <!--奖品池列表-->
        <Table :loading="tableLoading" border :columns="columns" :data="dataList" @on-sort-change="sort" height="600"></Table>

        <!--分页-->
        <Page v-if="total" :total="total" :current="page" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" show-sizer show-total show-elevator style="text-align: center; font-size: 12px; margin-top: 10px;"/>

        <!--奖品分类-->
        <Modal :mask-closable="false" v-model="showPrizeClassify" title="我的奖品分类设置" :styles="{top: '10px'}">
            <div class="prizeClassifyContent">
                <p>
                    <span>奖品分类</span><span>分类名称</span><span>显示顺序</span>
                </p>
                <p v-for="(item, index) in myPrizeTypeList" :key="index">
                    <span style="text-align: left; padding-left: 40px"><Checkbox :true-value="1" :false-value="0" v-model="item.displayFlag">{{item.nameFormat}}</Checkbox></span><span><Input v-model="item.name" :maxlength="4" clearable style="width: 95%;" :placeholder="'默认为: ' + item.nameFormat"/></span><span><InputNumber :min="0" v-model="item.displayOrder" style="width: 95%;"></InputNumber></span>
                </p>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="error" @click="showPrizeClassify = false">取消</Button>
                <Button type="success" @click="confirmPrizeType">确定</Button>
            </div>
        </Modal>

        <!--编辑弹框-->
        <Modal :mask-closable="false" v-model="showModal" width="800" :title="(selectionItem && selectionItem.id) ? '修改奖品池' : '新建奖品池'" :styles="{top: '10px'}">
            <div class="content">
                <p v-if="selectionItem.id">
                    <span style="margin-left: 8px;">奖品池ID</span>
                    <span>{{selectionItem.id}}</span>
                </p>
                <p>
                    <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 奖品池名称</span>
                    <Input v-model="selectionItem.name" placeholder="不超过12个汉字" :maxlength="12" clearable style="width: 200px;"/>

                    <span style="padding-left: 8px; margin-left: 100px;">奖品池描述</span>
                    <Input v-model="selectionItem.memo" placeholder="不超过255个汉字" :maxlength="255" clearable style="width: 200px;"/>
                </p>
                <p style="font-size: 14px;">领奖失败弹窗图片: <span style="color: red; width: 600px; font-size: 12px;">（注：当领奖失败时，弹窗上显示的图片，图片格式PNG / JPG / GIF）</span></p>
                <div class="uploadImg" style="margin-bottom: 10px;" v-for="(item, index) in coverImgObj.prizePool" :key="index">
                    <span style="display: inline-block; width: 50px; text-align: left; vertical-align: top;" :style="{paddingLeft: index ? '10px' : ''}">{{item.label}}</span>
                    <div class="uploadCoverImg" @mousemove="item.show = true" @mouseleave="item.show = false">
                        <Icon type="ios-camera" size="30" v-if="!item.url" style="float: left"></Icon>
                        <input type="file" :id="item.type + 'prizePool' + index" @change="selectFile(item, (item.type + 'prizePool' + index))">
                        <img :src="item.url" alt="">
                        <div class="mask" :style="{display: (item.url && item.show) ? 'inline-block' : 'none'}">
                            <Icon size="30" type="ios-trash-outline" style="cursor: pointer" @click.native="removeUrl(item, (item.type + 'prizePool' + index), selectionItem)"></Icon>
                        </div>
                    </div>
                </div>
                <p>
                    <span style="width: 198px;">领奖失败弹窗角标按钮文案</span>
                    <Input v-model="selectionItem.buttonLabel1" placeholder="不超过5个汉字" :maxlength="5" clearable style="width: 200px;"/>
                </p>
                <p style="font-size: 14px;" v-if="selectionItem.buttonLabel1">(失败角标)跳转地址</p>
                <p v-for="(item, index) in selectionItem.goUrl1List" :key="index + 2000" v-if="selectionItem.buttonLabel1">
                    <Select v-model="item.value" style="width: 200px" @on-change="updateGoUrl(item, '1', selectionItem)">
                        <Option v-for="item in selectionItem.type1List" :disabled="item.disabled" :value="item.value" :key="item.value + 100">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="item.url" clearable style="width: 490px;"/>
                    <Icon style="font-size: 20px; cursor: pointer;" type="ios-add-circle-outline" v-if="!index" @click="addGoUrl(selectionItem, '1')"/>
                    <Icon style="font-size: 20px; cursor: pointer; color: red;" type="ios-close" v-if="index" @click="removeGoUrl(item, selectionItem, '1', index)"/>
                </p>
                <p>
                    <span style="width: 198px;">领奖失败弹窗扩展按钮文案</span>
                    <Input v-model="selectionItem.buttonLabel2" placeholder="不超过5个汉字" :maxlength="5" clearable style="width: 200px;"/>
                </p>
                <p v-if="selectionItem.buttonLabel2" style="font-size: 14px;">(失败扩展)跳转地址:</p>
                <p v-if="selectionItem.buttonLabel2" v-for="(item, index) in selectionItem.goUrl2List" :key="index + 200">
                    <Select v-model="item.value" style="width: 200px" @on-change="updateGoUrl(item, '2', selectionItem)">
                        <Option v-for="item in selectionItem.type2List" :disabled="item.disabled" :value="item.value" :key="item.value + 100">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="item.url" clearable style="width: 490px;"/>
                    <Icon style="font-size: 20px; cursor: pointer;" type="ios-add-circle-outline" v-if="!index" @click="addGoUrl(selectionItem, '2')"/>
                    <Icon style="font-size: 20px; cursor: pointer; color: red;" type="ios-close" v-if="index" @click="removeGoUrl(item, selectionItem, '2', index)"/>
                </p>
                <p>
                    <span style="width: 120px;"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 领奖有效期(天)</span>
                    <InputNumber :min="1" :max="9999999999" v-model="selectionItem.timeout" clearable style="width: 150px;"></InputNumber>

                    <span style="margin-left: 120px;"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 领奖截止时间</span>
                    <DatePicker v-model="selectionItem.deadtimeFormat" :options="options3" type="datetime" clearable style="width: 200px;"></DatePicker>
                </p>
                <p>
                    <span style="width: 120px;"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 奖池类型</span>
                    <RadioGroup v-model="selectionItem.type">
                        <Radio :label="2">
                            <span style="width: 30px;">单奖品</span>
                        </Radio>
                        <Radio :label="1">
                            <span style="width: 30px;">多奖品</span>
                        </Radio>
                    </RadioGroup>
                </p>

                <p style="text-align: center; font-size: 14px;">- - - - - - 奖品项信息 - - - - - -</p>

                <Collapse v-model="collapseValue" @on-change="changePanel">
                    <Panel :name="prizeIndex + ''" v-for="(prizeItem, prizeIndex) in selectionItem.prizeItemList" :key="prizeIndex" ref="panelList">
                        {{'奖品项ID: ' + (prizeItem.id || '-')}} / {{'奖品名称: ' + (prizeItem.name || '-')}} / {{'奖品类型: ' + (prizeItem.prizeTypeFormat || '-')}} / {{'奖品概率: ' + (prizeItem.probability ? prizeItem.probability : ((prizeItem.probability === 0) ? 0 : '-'))}} / 第{{prizeIndex + 1}}项
                        <Icon style="font-size: 20px; cursor: pointer; color: red; float: right; position: relative; top: 9px;" type="ios-close" v-if="prizeIndex && !prizeItem.freezed" @click.stop="removePrizeItem(prizeIndex)"/>
                        <div slot="content" class="collapse">
                            <p style="position: relative">
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 奖品名称</span>
                                <Input v-model="prizeItem.name" placeholder="不超过12个汉字" :maxlength="12" clearable style="width: 200px;"/>

                                <span style="padding-left: 8px; margin-left: 80px" :id="'prizeItemMemoTip' + prizeIndex">奖品描述</span>
                                <textarea style="position: absolute; right: 0; top: 0;" :name="'prizeItemMemoTip' + prizeIndex" placeholder="不超过1024个汉字" :maxlength="1024"  :id="'prizeItemMemo' + prizeIndex" cols="30" rows="5" v-model="prizeItem.memo"></textarea>
                            </p>
                            <p>
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 奖品类型</span>
                                <Select v-model="prizeItem.prizeType" style="width: 200px" @on-change="changePrizeType(prizeItem.prizeType)" :disabled="prizeItem.freezed">
                                    <Option v-for="item in prizeList" :value="item.id" :key="item.id + 100">{{ item.name }}</Option>
                                </Select>
                            </p>
                            <p v-if="prizeItem.prizeType === 1">
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 掉卡位ID</span>
                                <Input v-model="prizeItem.prizeTypeExtBo.strategy" clearable style="width: 200px;"/>
                            </p>
                            <p v-if="prizeItem.prizeType === 2">
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 每次获取云钻数</span>
                                <InputNumber :min="1" :max="9999999999" :precision="0" v-model="prizeItem.prizeTypeExtBo.yuzuan_number" clearable style="width: 200px;"></InputNumber>
                            </p>
                            <p v-if="(prizeItem.prizeType === 2) && prizeItem.id">
                                <span style="padding-left: 8px;">已发放云钻数</span>
                                <span style="padding-left: 8px;">{{prizeItem.usedYunZuan || 0}}</span>
                            </p>
                            <p v-if="prizeItem.prizeType === 3">
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 会员天数</span>
                                <InputNumber :min="1" :max="9999999999" :precision="0" v-model="prizeItem.prizeTypeExtBo.member_day" clearable style="width: 150px;"></InputNumber>
                            </p>
                            <p v-if="prizeItem.prizeType === 3">
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 会员类型</span>
                                <Select v-model="prizeItem.prizeTypeExtBo.vip_type" style="width: 200px">
                                    <Option v-for="item in vipTypeList" :disabled="item.disabled" :value="item.value" :key="item.value + 100">{{ item.label }}</Option>
                                </Select>
                            </p>
                            <p v-if="prizeItem.prizeType === 3">
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 渠道号</span>
                                <Input v-model="prizeItem.prizeTypeExtBo.channel" :maxlength="12" clearable style="width: 200px;"/>
                            </p>
                            <p v-if="prizeItem.prizeType === 3">
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 密钥</span>
                                <Input v-model="prizeItem.prizeTypeExtBo.md5key" :maxlength="12" clearable style="width: 200px;"/>
                            </p>
                            <p v-if="(prizeItem.prizeType === 5) || (prizeItem.prizeType === 6) || (prizeItem.prizeType === 7) || (prizeItem.prizeType === 11) || (prizeItem.prizeType === 88)">
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 奖品券池</span>
                                <Select v-if="prizeItem.prizeType === 88" v-model="prizeItem.prizeCouponPoolId" style="width: 200px" :disabled="prizeItem.freezed">
                                    <Option v-for="item in cardPackageList" :value="item.id" :key="item.id + 100">{{ item.name }}</Option>
                                </Select>
                                <Select v-if="prizeItem.prizeType !== 88" v-model="prizeItem.prizeCouponPoolId" style="width: 200px" :disabled="prizeItem.freezed">
                                  <Option v-for="item in prizePoolList" :value="item.id" :key="item.id + 100">{{ item.name }}</Option>
                                </Select>
                                <Icon style="font-size: 25px; cursor: pointer; position: relative; top: 1px;" v-if="!prizeItem.freezed && (prizeItem.prizeType !== 88)" type="ios-refresh" @click="query_list('refresh', prizeItem.prizeType)"/>
                                <Icon style="font-size: 20px; cursor: pointer" v-if="!prizeItem.freezed && (prizeItem.prizeType !== 88)" type="ios-add-circle-outline" @click="addNewCoupon"/>
                            </p>
                            <p v-if="prizeItem.prizeType === 11">
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 每次获取津贴额</span>
                                <InputNumber :min="1" :precision="0" v-model="prizeItem.prizeTypeExtBo.yuzuan_number" :disabled="prizeItem.freezed" clearable style="width: 150px;"></InputNumber>
                            </p>
                            <p v-if="(prizeItem.prizeType === 11) && prizeItem.id">
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 已发放津贴额</span>
                                <span style="padding-left: 8px;">{{prizeItem.prizeTypeExtBo.yuzuan_number * prizeItem.usedQuantity}}</span>
                            </p>
                            <p>
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 发放总数</span>
                                <InputNumber :min="0" :max="9999999999" :precision="0" v-model="prizeItem.totalQuantity" clearable style="width: 200px;"></InputNumber>
                            </p>
                            <p v-if="prizeItem.id">
                                <span style="padding-left: 8px;">未发放数</span>
                                <span style="padding-left: 8px;">{{prizeItem.totalQuantity / 1 - prizeItem.diffQuantity / 1}}</span>

                                <span style="margin-left: 100px;">已发放数</span>
                                <span>{{prizeItem.diffQuantity || 0}}</span>
                                <Button v-if="selectionItem.id && prizeItem.id" type="primary" size="small" @click="query_prize_pool_detail(selectionItem.id, prizeIndex)">刷新已发放数</Button>
                            </p>
                            <p>
                                <span><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 掉奖概率</span>
                                <InputNumber :min="0" :max="100" v-model="prizeItem.probability" clearable style="width: 200px;"></InputNumber>

                                <span style="margin-left: 80px;"><span style="color: red; width: 5px; position: relative; top: 2px;">*</span> 展示顺序</span>
                                <InputNumber :min="1" :max="999" :precision="0" v-model="prizeItem.displayOrder" clearable style="width: 200px;"></InputNumber>
                            </p>
                            <p style="font-size: 14px;">奖品图片 <span style="color: red; font-size: 12px; width: 600px;">（注：图片格式PNG / JPG / GIF，PC端为70*96px，移动端为191*262px）</span></p>
                            <div class="uploadImg" style="margin-bottom: 10px;" v-for="(item, index) in coverImgObj.prizeItem[prizeIndex]" :key="index + 1000">
                                <span style="display: inline-block; width: 50px; text-align: left; vertical-align: top;" :style="{paddingLeft: index ? '10px' : ''}">{{item.label}}</span>
                                <div class="uploadCoverImg" @mousemove="item.show = true" @mouseleave="item.show = false">
                                    <Icon type="ios-camera" size="30" v-if="!item.url" style="float: left"></Icon>
                                    <input type="file" :id="item.type + prizeIndex + 'prizeItem' + index" @change="selectFile(item, (item.type + prizeIndex + 'prizeItem' + index))">
                                    <img :src="item.url" alt="">
                                    <div class="mask" :style="{display: (item.url && item.show) ? 'inline-block' : 'none'}">
                                        <Icon size="30" type="ios-trash-outline" style="cursor: pointer" @click.native="removeUrl(item, (item.type + prizeIndex + 'prizeItem' + index), prizeItem)"></Icon>
                                    </div>
                                </div>
                            </div>
                            <p style="font-size: 14px;">(去使用)跳转地址 <span style="color: red; width: 600px; font-size: 12px;">（注：如果需要打开站外APP，请填写：外部路由地址$$$正常跳转地址，优先打开外部路由地址）</span></p>
                            <p v-for="(item, index) in prizeItem.goUrlList" :key="index + 500">
                                <Select v-model="item.value" style="width: 200px" @on-change="updateGoUrl(item, '', prizeItem)">
                                    <Option v-for="item in prizeItem.typeList" :disabled="item.disabled" :value="item.value" :key="item.value + 100">{{ item.label }}</Option>
                                </Select>
                                <Input v-model="item.url" clearable style="width: 490px;"/>
                                <Icon style="font-size: 20px; cursor: pointer;" type="ios-add-circle-outline" v-if="!index" @click="addGoUrl(prizeItem, '')"/>
                                <Icon style="font-size: 20px; cursor: pointer; color: red;" type="ios-close" v-if="index" @click="removeGoUrl(item, prizeItem, '', index)"/>
                            </p>
                            <p>
                                <span style="width: 198px;">领奖成功弹窗角标按钮文案</span>
                                <Input v-model="prizeItem.buttonLabel1" placeholder="不超过5个汉字" :maxlength="5" clearable style="width: 400px;"/>
                            </p>
                            <p v-if="prizeItem.buttonLabel1" style="font-size: 14px;">(成功角标)跳转地址</p>
                            <p v-if="prizeItem.buttonLabel1" v-for="(item, index) in prizeItem.goUrl1List" :key="index + 300">
                                <Select v-model="item.value" style="width: 200px" @on-change="updateGoUrl(item, '1', prizeItem)">
                                    <Option v-for="item in prizeItem.type1List" :disabled="item.disabled" :value="item.value" :key="item.value + 100">{{ item.label }}</Option>
                                </Select>
                                <Input v-model="item.url" clearable style="width: 490px;"/>
                                <Icon style="font-size: 20px; cursor: pointer;" type="ios-add-circle-outline" v-if="!index" @click="addGoUrl(prizeItem, '1')"/>
                                <Icon style="font-size: 20px; cursor: pointer; color: red;" type="ios-close" v-if="index" @click="removeGoUrl(item, prizeItem, '1', index)"/>
                            </p>
                            <p>
                                <span style="width: 198px;">领奖成功弹窗扩展按钮文案</span>
                                <Input v-model="prizeItem.buttonLabel2" placeholder="不超过5个汉字" :maxlength="5" clearable style="width: 400px;"/>
                            </p>
                            <p v-if="prizeItem.buttonLabel2" style="font-size: 14px;">(成功扩展)跳转地址</p>
                            <p v-if="prizeItem.buttonLabel2" v-for="(item, index) in prizeItem.goUrl2List" :key="index + 400">
                                <Select v-model="item.value" style="width: 200px" @on-change="updateGoUrl(item, '2', prizeItem)">
                                    <Option v-for="item in prizeItem.type2List" :disabled="item.disabled" :value="item.value" :key="item.value + 100">{{ item.label }}</Option>
                                </Select>
                                <Input v-model="item.url" clearable style="width: 490px;"/>
                                <Icon style="font-size: 20px; cursor: pointer;" type="ios-add-circle-outline" v-if="!index" @click="addGoUrl(prizeItem, '2')"/>
                                <Icon style="font-size: 20px; cursor: pointer; color: red;" type="ios-close" v-if="index" @click="removeGoUrl(item, prizeItem, '2', index)"/>
                            </p>
                        </div>
                    </Panel>
                </Collapse>
                <Button type="primary" :disabled="selectionItem.prizeItemList.length >= 100" @click="addPrizeItem" long style="margin-top: 10px;">{{(selectionItem.prizeItemList.length > 100) ? '奖品项数量达到上限' : '新增奖品项'}}</Button>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="error" @click="showModal = false">取消</Button>
                <Button type="success" @click="confirm" :loading="false">{{(selectionItem && selectionItem.id) ? '修改' : '新建'}}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import api from '../../libs/API'
    import utils from '../../libs/utils'

    export default {
        name: "PrizePoolBackup",
        data() {
            return {
                cardPackageList: [
                  {
                    id: 5,
                    name: '3元无门槛优惠券'
                  },
                  {
                    id: 6,
                    name: '满58减20元优惠券'
                  }
                ],
                options3: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                showPrizeClassify: false,
                collapseValue: '0',
                id: null,
                name: null,
                type: null,
                prizeTypeList: [
                    {
                        label: '单奖品',
                        value: 2
                    },
                    {
                        label: '多奖品',
                        value: 1
                    }
                ],
                vipTypeList: [
                    {
                        value: -5,
                        label: '移动会员'
                    },
                    {
                        value: 1,
                        label: '普通会员'
                    },
                    {
                        value: 10,
                        label: '超级会员'
                    }
                ],
                prizeList: [],
                prizePoolList: [],
                myPrizeTypeList: [],
                columns: [
                    {
                        title: '序号',
                        key: 'serialNum',
                        width: 100
                    },
                    {
                        title: '奖池ID',
                        key: 'id',
                        sortable: true,
                        width: 100
                    },
                    {
                        title: '奖池名称',
                        key: 'name'
                    },
                    {
                        title: '奖池类型',
                        width: 85,
                        align: 'center',
                        key: 'typeFormat'
                    },
                    {
                        title: '有效期(天)',
                        key: 'timeout',
                        width: 100
                    },
                    {
                        title: '截止时间',
                        key: 'deadtimeFormat',
                        width: 105,
                        sortable: true
                    },
                    {
                        title: '奖项数量',
                        key: 'prizeItemLength',
                        width: 105
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
                                            this.query_prize_pool_detail(params.row.id);
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                selectionItem: {
                    id: null,
                    name: null,
                    projectId: null,
                    type: null,
                    memo: null,
                    timeout: null,
                    deadtime: null,
                    buttonLabel1: null,
                    buttonLabel2: null,
                    goUrl1: {},
                    goUrl2: {},
                    imageUrl: {},
                    prizeItemList: [
                        {
                            id: null,
                            prizePoolId: null,
                            name: null,
                            memo: null,
                            prizeType: null,
                            probability: null,
                            quantity: null,
                            totalQuantity: null,
                            usedQuantity: null,
                            displayOrder: null,
                            usedYunZuan: null,
                            buttonLabel1: null,
                            buttonLabel2: null,
                            goUrl: {},
                            goUrl1: {},
                            goUrl2: {},
                            imageUrl: {},
                            prizeTypeExtBo: {}
                        }
                    ]
                },
                coverImgObj: {
                    prizePool: [
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
                    prizeItem: [
                        [
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
                        ]
                    ]
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
                typeList: [
                    {
                        label: 'iPhone端',
                        type: 'iph',
                        value: 0,
                        disabled: false
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
                ],
                dataList: [],
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
            query_prize_pool_detail(id, index) {
                const _this = this;
                _this.$Spin.show();
                if (!index) {
                    _this.query_list();
                }
                index += 1;
                api.post('query_prize_pool_detail', null, {
                    id: id,
                    action: 'update'
                }).then(res => {
                    //console.log(res);
                    if (index) {
                        _this.selectionItem.prizeItemList[index - 1].diffQuantity = res.data.pool.prizeItemList[index - 1].totalQuantity / 1 - res.data.pool.prizeItemList[index - 1].quantity / 1;
                        _this.$Spin.hide();
                        _this.$Message.success({
                            content: '第' + index + '项奖品项已发放数更新成功',
                            duration: 3
                        });
                    } else {
                        res.data.pool.prizeItemList.forEach(item => {
                            item.diffQuantity = item.totalQuantity / 1 - item.quantity / 1;
                        });
                        _this.selectionItem = res.data.pool;
                        _this.handlePrizePool('update');
                    }
                }).catch(err => {
                    //console.error(err);
                    _this.$Spin.hide();
                    _this.$Message.error({
                        content: err.message || (index ? ('第' + index + '项奖品项已发放数更新失败') : '查询奖品池详情失败'),
                        duration: 3
                    });
                });
            },
            changePanel(panelIndexList) {
                let panelList = this.$refs.panelList;
                panelList.forEach((item, index) => {
                    item.isActive = !!(panelIndexList.indexOf(index + '') !== -1);
                });
            },
            addNewCoupon() {
                window.open('/#/coupon/pool?type=create', '_blank');
            },
            confirmPrizeType() {
                const _this = this;
                let len = _this.myPrizeTypeList.length;
                for (let i = 0; i < len; i++) {
                    let currentItem = _this.myPrizeTypeList[i];
                    if (((currentItem.displayFlag === 1) || (currentItem.displayFlag === '1')) && !currentItem.displayOrder && (currentItem.displayOrder !== 0)) {
                        if (currentItem.name.length > 4) {
                            return _this.$Message.warning({
                                content: currentItem.nameFormat + '分类勾选后名称长度不能超过4个字',
                                duration: 3
                            });
                        }
                        return _this.$Message.warning({
                            content: currentItem.nameFormat + '分类勾选后展示顺序不能为空',
                            duration: 3
                        });
                    }
                }
                _this.$Spin.show();
                api.post('update_prize_type', null, {prizeTypeDisplayBos: _this.myPrizeTypeList}).then(res => {
                    //console.log(res);
                    _this.$Spin.hide();
                    this.showPrizeClassify = false;
                    _this.$Message.success({
                        content: '我的奖品分类修改成功',
                        duration: 3
                    });
                }).catch(err => {
                    //console.error(err);
                    _this.$Spin.hide();
                    _this.$Message.error({
                        content: err.message || '获取我的奖品分类失败',
                        duration: 3
                    });
                })
            },
            openModal() {
                const _this = this;
                _this.$Spin.show();
                api.post('get_prize_type').then(res => {
                    //console.log(res);
                    _this.myPrizeTypeList = res.data.map(item => {
                        switch (item.prizeTypeId) {
                            case -1:
                                item.nameFormat = '全部';
                                break;
                            case 1:
                                item.nameFormat = '球星卡';
                                break;
                            case 3:
                                item.nameFormat = '会员';
                                break;
                            case 4:
                                item.nameFormat = '实物';
                                break;
                            case 5:
                                item.nameFormat = '优惠券';
                                break;
                        };
                        return item;
                    });
                    this.showPrizeClassify = true;
                    _this.$Spin.hide();
                }).catch(err => {
                    //console.error(err);
                    _this.$Spin.hide();
                    _this.$Message.error({
                        content: err.message || '获取我的奖品分类失败',
                        duration: 3
                    });
                })
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
                this.query_prize_pool_list();
            },
            updateGoUrl(item, typeIndex, selectionItem) {
                item.url = null;
                let list = [];
                selectionItem['goUrl' + typeIndex + 'List'].forEach(i => {
                    if (i.value || (i.value === 0)) {
                        list.push(i.value);
                    }
                });
                selectionItem['type' + typeIndex + 'List'].forEach(j => {
                    j.disabled = (list.indexOf(j.value) !== -1);
                });
                this.$forceUpdate();
            },
            addGoUrl(item, typeIndex) {
                item['goUrl' + typeIndex + 'List'].push({
                    value: null,
                    url: null
                });
                this.$forceUpdate();
            },
            removeGoUrl(item, parent, typeIndex, index) {
                if (item.value || (item.value === 0)) {
                    parent['type' + typeIndex + 'List'][item.value].disabled = false;
                }
                parent['goUrl' + typeIndex + 'List'].splice(index, 1);
                this.$forceUpdate();
            },
            removeUrl(item, eleId, selectionItem) {
                const _this = this;
                if (item.url.indexOf('base') !== -1) {
                    document.getElementById(eleId).value = '';
                    selectionItem.imageUrl[item.type] = '';
                    item.url = null;
                    item.file = null;
                    item.show = false;
                    return;
                }
                let params = {
                    id: selectionItem.id,
                    imageType: item.type
                };
                _this.$Spin.show();
                api.post((selectionItem.prizeItemList) ? 'delete_prize_pool_img' : 'delete_prize_item_img', null, params).then(res => {
                    //console.log(res);
                    _this.$Spin.hide();
                    document.getElementById(eleId).value = '';
                    selectionItem.imageUrl[item.type] = '';
                    item.url = null;
                    item.file = null;
                    item.show = false;
                    _this.query_prize_pool_list();
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
            selectFile(item, id) {
                const _this = this;
                let inputFile = document.getElementById(id);
                if (inputFile.files && inputFile.files.length) {
                    let file = inputFile.files[0];
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
            query_prize_pool_list(flag) {
                const _this = this;
                if (flag) {
                    _this.page = 1;
                    _this.pageSize = 10;
                }
                let params = {
                    id: _this.id,
                    name: _this.name,
                    type: _this.type,
                    page: _this.page,
                    pageSize: _this.pageSize,
                    sortOrder: _this.sortOrder,
                    sortName: _this.sortName
                };
                _this.tableLoading = true;
                api.post('query_prize_pool_list', null, params).then(res => {
                    //console.log(res);
                    res.data.rows = res.data.rows.map((item, index) => {
                        item.serialNum = _this.pageSize * (_this.page - 1) + index + 1;
                        item.typeFormat = (item.type === 1) ? '多奖品' : '单奖品';
                        item.deadtimeFormat = utils.dateFormat(item.deadtime, 'YYYY-MM-DD hh:mm:ss');
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
                        content: err.message || '奖品池列表查询失败',
                        duration: 3
                    });
                })
            },
            handlePrizePool(type) {
                const _this = this;
                if (type === 'create') {
                    _this.selectionItem = {
                        id: null,
                        name: null,
                        projectId: null,
                        type: null,
                        memo: null,
                        timeout: null,
                        deadtime: null,
                        deadtimeFormat: null,
                        buttonLabel1: null,
                        buttonLabel2: null,
                        goUrl1: {},
                        goUrl2: {},
                        goUrl1List: [{
                            value: 0,
                            url: null
                        }],
                        goUrl2List: [{
                            value: 0,
                            url: null
                        }],
                        type1List: JSON.parse(JSON.stringify(_this.typeList)),
                        type2List: JSON.parse(JSON.stringify(_this.typeList)),
                        imageUrl: {},
                        prizeItemList: [
                            {
                                id: null,
                                prizePoolId: null,
                                name: null,
                                memo: null,
                                prizeType: null,
                                probability: null,
                                quantity: 0,
                                totalQuantity: null,
                                diffQuantity: null,
                                usedQuantity: 0,
                                displayOrder: null,
                                usedYunZuan: null,
                                buttonLabel1: null,
                                buttonLabel2: null,
                                prizeCouponPoolId: null,
                                goUrl: {},
                                goUrl1: {},
                                goUrl2: {},
                                goUrlList: [{
                                    value: 0,
                                    url: null
                                }],
                                goUrl1List: [{
                                    value: 0,
                                    url: null
                                }],
                                goUrl2List: [{
                                    value: 0,
                                    url: null
                                }],
                                typeList: JSON.parse(JSON.stringify(_this.typeList)),
                                type1List: JSON.parse(JSON.stringify(_this.typeList)),
                                type2List: JSON.parse(JSON.stringify(_this.typeList)),
                                imageUrl: {},
                                prizeTypeExtBo: {
                                    strategy: null,
                                    yuzuan_number: null,
                                    member_day: null,
                                    vip_type: null,
                                    channel: null,
                                    md5key: null
                                }
                            }
                        ]
                    };
                    _this.selectionItem.type1List[0].disabled = true;
                    _this.selectionItem.type2List[0].disabled = true;
                    _this.selectionItem.prizeItemList[0].typeList[0].disabled = true;
                    _this.selectionItem.prizeItemList[0].type1List[0].disabled = true;
                    _this.selectionItem.prizeItemList[0].type2List[0].disabled = true;
                    _this.coverImgObj = {
                        prizePool: [
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
                        prizeItem: [
                            [
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
                            ]
                        ]
                    }
                } else {
                    console.log(_this.selectionItem);
                    _this.collapseValue = '';
                    _this.selectionItem.deadtimeFormat = utils.dateFormat(_this.selectionItem.deadtime, 'YYYY-MM-DD hh:mm:ss');
                    _this.coverImgObj = {
                        prizePool: [
                            {
                                label: 'PC端',
                                type: 'web',
                                url: _this.selectionItem.imageUrl ? (_this.selectionItem.imageUrl.web || '') : '',
                                show: false,
                                file: null
                            },
                            {
                                label: '移动端',
                                type: 'iph',
                                url: _this.selectionItem.imageUrl ? (_this.selectionItem.imageUrl.iph || '') : '',
                                show: false,
                                file: null
                            },
                            {
                                label: 'TV端',
                                type: 'atv',
                                url: _this.selectionItem.imageUrl ? (_this.selectionItem.imageUrl.atv || '') : '',
                                show: false,
                                file: null
                            },
                            {
                                label: 'Pad端',
                                type: 'ipd',
                                url: _this.selectionItem.imageUrl ? (_this.selectionItem.imageUrl.ipd || '') : '',
                                show: false,
                                file: null
                            }
                        ],
                        prizeItem: []
                    };
                    _this.selectionItem.prizeItemList.forEach(item => {
                        item.freezed = true;
                        item.probability += '';
                        item.probability = (item.probability.length > 5) ? (parseFloat(item.probability).toFixed(2) / 1) : (item.probability / 1);
                        _this.coverImgObj.prizeItem.push([
                            {
                                label: 'PC端',
                                type: 'web',
                                url: item.imageUrl ? (item.imageUrl.web || '') : '',
                                show: false,
                                file: null
                            },
                            {
                                label: '移动端',
                                type: 'iph',
                                url: item.imageUrl ? (item.imageUrl.iph || '') : '',
                                show: false,
                                file: null
                            },
                            {
                                label: 'TV端',
                                type: 'atv',
                                url: item.imageUrl ? (item.imageUrl.atv || '') : '',
                                show: false,
                                file: null
                            },
                            {
                                label: 'Pad端',
                                type: 'ipd',
                                url: item.imageUrl ? (item.imageUrl.ipd || '') : '',
                                show: false,
                                file: null
                            }
                        ]);
                        item.usedQuantity = item.totalQuantity - item.quantity;
                        item.goUrlList = [];
                        item.typeList = JSON.parse(JSON.stringify(_this.typeList));
                        item.goUrl1List = [];
                        item.type1List = JSON.parse(JSON.stringify(_this.typeList));
                        item.goUrl2List = [];
                        item.type2List = JSON.parse(JSON.stringify(_this.typeList));
                        _this.typeList.forEach(i => {
                            if (item.goUrl && item.goUrl[i.type]) {
                                item.goUrlList.push({
                                    value: i.value,
                                    url: item.goUrl[i.type]
                                });
                                item.typeList[i.value].disabled = true;
                            }
                            if (item.goUrl1 && item.goUrl1[i.type]) {
                                item.goUrl1List.push({
                                    value: i.value,
                                    url: item.goUrl1[i.type]
                                });
                                item.type1List[i.value].disabled = true;
                            }
                            if (item.goUrl2 && item.goUrl2[i.type]) {
                                item.goUrl2List.push({
                                    value: i.value,
                                    url: item.goUrl2[i.type]
                                });
                                item.type2List[i.value].disabled = true;
                            }
                        });
                        if (!item.goUrlList.length) {
                            item.goUrlList.push({
                                value: 0,
                                url: null
                            });
                            item.typeList[0].disabled = true;
                        }
                        if (!item.goUrl1List.length) {
                            item.goUrl1List.push({
                                value: 0,
                                url: null
                            });
                            item.type1List[0].disabled = true;
                        }
                        if (!item.goUrl2List.length) {
                            item.goUrl2List.push({
                                value: 0,
                                url: null
                            });
                            item.type2List[0].disabled = true;
                        }
                        _this.prizeList.forEach(i => {
                            if (i.id === item.prizeType) {
                                item.prizeTypeFormat = i.name;
                            }
                        });
                        if (item.prizeTypeExtBo.vip_type) {
                            item.prizeTypeExtBo.vip_type = item.prizeTypeExtBo.vip_type / 1;
                        }
                        if (item.prizeTypeExtBo.yuzuan_number) {
                            item.prizeTypeExtBo.yuzuan_number = item.prizeTypeExtBo.yuzuan_number / 1;
                        }
                        if (item.prizeTypeExtBo.member_day) {
                            item.prizeTypeExtBo.member_day = item.prizeTypeExtBo.member_day / 1;
                        }
                    });
                    _this.selectionItem.goUrl1List = [];
                    _this.selectionItem.type1List = JSON.parse(JSON.stringify(_this.typeList));
                    _this.selectionItem.goUrl2List = [];
                    _this.selectionItem.type2List = JSON.parse(JSON.stringify(_this.typeList));
                    _this.typeList.forEach(item => {
                        if (_this.selectionItem.goUrl1 && _this.selectionItem.goUrl1[item.type]) {
                            _this.selectionItem.goUrl1List.push({
                                value: item.value,
                                url: _this.selectionItem.goUrl1[item.type]
                            });
                            _this.selectionItem.type1List[item.value].disabled = true;
                        }
                        if (_this.selectionItem.goUrl2 && _this.selectionItem.goUrl2[item.type]) {
                            _this.selectionItem.goUrl2List.push({
                                value: item.value,
                                url: _this.selectionItem.goUrl2[item.type]
                            });
                            _this.selectionItem.type2List[item.value].disabled = true;
                        }
                    });
                    if (!_this.selectionItem.goUrl1List.length) {
                        _this.selectionItem.goUrl1List.push({
                            value: 0,
                            url: null
                        });
                        _this.selectionItem.type1List[0].disabled = true;
                    }
                    if (!_this.selectionItem.goUrl2List.length) {
                        _this.selectionItem.goUrl2List.push({
                            value: 0,
                            url: null
                        });
                        _this.selectionItem.type1List[0].disabled = true;
                    }
                }
                _this.showModal = true;

                _this.$Spin.hide();
            },
            confirm() {
                const _this = this;
                //goUrl处理
                let obj = {};
                _this.selectionItem.goUrl1List.forEach(i => {
                    obj[i.value] = i.url;
                });
                _this.selectionItem.goUrl1ListFormat = obj;
                obj = {};
                _this.selectionItem.goUrl2List.forEach(i => {
                    obj[i.value] = i.url;
                });
                _this.selectionItem.goUrl2ListFormat = obj;
                obj = {};
                _this.selectionItem.prizeItemList.forEach(i => {
                    i.goUrlList.forEach(j => {
                        obj[j.value] = j.url;
                    });
                    i.goUrlListFormat = obj;
                    obj = {};
                    i.goUrl1List.forEach(j => {
                        obj[j.value] = j.url;
                    });
                    i.goUrl1ListFormat = obj;
                    obj = {};
                    i.goUrl2List.forEach(j => {
                        obj[j.value] = j.url;
                    });
                    i.goUrl2ListFormat = obj;
                    obj = {};
                });
                _this.typeList.forEach(item => {
                    _this.selectionItem.goUrl1[item.type] = _this.selectionItem.buttonLabel1 ? (_this.selectionItem.goUrl1ListFormat[item.value] || '') : '';
                    _this.selectionItem.goUrl2[item.type] = _this.selectionItem.buttonLabel2 ? (_this.selectionItem.goUrl2ListFormat[item.value] || '') : '';
                    _this.selectionItem.prizeItemList.forEach(i => {
                        i.goUrl[item.type] = i.goUrlListFormat[item.value] || '';
                        i.goUrl1[item.type] = i.buttonLabel1 ? (i.goUrl1ListFormat[item.value] || '') : '';
                        i.goUrl2[item.type] = i.buttonLabel2 ? (i.goUrl2ListFormat[item.value] || '') : '';
                    })
                });
                //四个图片处理
                _this.coverImgObj.prizePool.forEach((item, index) => {
                    _this.selectionItem['image' + (index + 1)] = item.file;
                });
                _this.coverImgObj.prizeItem.forEach((item, index) => {
                    item.forEach((i, n) => {
                        _this.selectionItem.prizeItemList[index]['image' + (n + 1)] = i.file;
                    })
                });

                if (!_this.selectionItem.name) {
                    return _this.$Message.warning({
                        content: '奖品池名称不能为空',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.timeout) {
                    return _this.$Message.warning({
                        content: '领奖有效期不能为空',
                        duration: 3
                    });
                }
                _this.selectionItem.deadtime = new Date(_this.selectionItem.deadtimeFormat).getTime();
                if ((utils.dateFormat(_this.selectionItem.deadtime, 'YYYYMMDDhhmmss') / 1) < (utils.dateFormat(new Date().getTime(), 'YYYYMMDDhhmmss') / 1)) {
                    return _this.$Message.warning({
                        content: '领奖截止时间不能小于当前时间',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.deadtime) {
                    return _this.$Message.warning({
                        content: '领奖截止时间不能为空',
                        duration: 3
                    });
                }
                if (!_this.selectionItem.type && (_this.selectionItem.type !== 0)) {
                    return _this.$Message.warning({
                        content: '奖品池类型为必选',
                        duration: 3
                    });
                }
                let prizeItemLen = _this.selectionItem.prizeItemList.length;
                let totalProbability = 0;
                for (let i = 0; i < prizeItemLen; i++) {
                    let currentItem = _this.selectionItem.prizeItemList[i];
                    currentItem.quantity = currentItem.totalQuantity - currentItem.usedQuantity;
                    totalProbability += (currentItem.probability / 1);
                    if (!currentItem.name) {
                        return _this.$Message.warning({
                            content: '第' + (i + 1) + '项奖品的名称不能为空',
                            duration: 3
                        });
                    }
                    if (!currentItem.prizeType && (currentItem.prizeType !== 0)) {
                        return _this.$Message.warning({
                            content: '第' + (i + 1) + '项奖品的奖品类型不能为空',
                            duration: 3
                        });
                    }
                    if ((currentItem.prizeType === 1) && (!currentItem.prizeTypeExtBo.strategy)) {
                        return _this.$Message.warning({
                            content: '第' + (i + 1) + '项奖品的掉卡位ID不能为空',
                            duration: 3
                        });
                    }
                    if ((currentItem.prizeType === 2) && (!currentItem.prizeTypeExtBo.yuzuan_number)) {
                        return _this.$Message.warning({
                            content: '第' + (i + 1) + '项奖品的每次获取云钻不能为空',
                            duration: 3
                        });
                    }
                    if (currentItem.prizeType === 3) {
                        if (!currentItem.prizeTypeExtBo.member_day) {
                            return _this.$Message.warning({
                                content: '第' + (i + 1) + '项奖品的会员天数不能为空',
                                duration: 3
                            });
                        }
                        if (!currentItem.prizeTypeExtBo.vip_type && (currentItem.prizeTypeExtBo.vip_type !== 0)) {
                            return _this.$Message.warning({
                                content: '第' + (i + 1) + '项奖品的会员类型不能为空',
                                duration: 3
                            });
                        }
                        if (!currentItem.prizeTypeExtBo.channel) {
                            return _this.$Message.warning({
                                content: '第' + (i + 1) + '项奖品的渠道不能为空',
                                duration: 3
                            });
                        }
                        if (!currentItem.prizeTypeExtBo.md5key) {
                            return _this.$Message.warning({
                                content: '第' + (i + 1) + '项奖品的密钥不能为空',
                                duration: 3
                            });
                        }
                    }
                    if ((currentItem.prizeType === 5) || (currentItem.prizeType === 6) || (currentItem.prizeType === 7) || (currentItem.prizeType === 11) || (currentItem.prizeType === 88)) {
                        if (!currentItem.prizeCouponPoolId && (currentItem.prizeCouponPoolId !== 0)) {
                            return _this.$Message.warning({
                                content: '第' + (i + 1) + '项奖品的券池不能为空',
                                duration: 3
                            });
                        }
                    }
                    if ((currentItem.prizeType === 11) && (!currentItem.prizeTypeExtBo.yuzuan_number)) {
                        return _this.$Message.warning({
                            content: '第' + (i + 1) + '项奖品的津贴额不能为空',
                            duration: 3
                        });
                    }
                    if (!currentItem.totalQuantity && (currentItem.totalQuantity !== 0)) {
                        return _this.$Message.warning({
                            content: '第' + (i + 1) + '项奖品的发放总数不能为空',
                            duration: 3
                        });
                    }
                    if ((currentItem.totalQuantity - currentItem.diffQuantity) < 0) {
                        return _this.$Message.warning({
                            content: '第' + (i + 1) + '项奖品的发放总数不能低于已发放量',
                            duration: 3
                        });
                    }
                    if (!currentItem.probability && (currentItem.probability !== 0)) {
                        return _this.$Message.warning({
                            content: '第' + (i + 1) + '项奖品的掉奖概率不能为空',
                            duration: 3
                        });
                    }
                    if (!currentItem.displayOrder && (currentItem.displayOrder !== 0)) {
                        return _this.$Message.warning({
                            content: '第' + (i + 1) + '项奖品的展示顺序不能为空',
                            duration: 3
                        });
                    }
                }
                if ((_this.selectionItem.type === 2) && (totalProbability > 100)) {
                    return _this.$Message.warning({
                        content: '当前选择的单奖品总概率为' + totalProbability + '，不能大于100',
                        duration: 3
                    });
                }
                //关联项目ID取消，默认传1
                _this.selectionItem.projectId = 1;
                _this.$Spin.show();
                api.post(_this.selectionItem.id ? 'update_prize_pool' : 'create_prize_pool', null, _this.selectionItem).then(res => {
                    //console.log(res);
                    _this.showModal = false;
                    _this.$Spin.hide();
                    _this.query_prize_pool_list();
                }).catch(err => {
                    //console.error(err);
                    _this.$Spin.hide();
                    _this.$Message.error({
                        content: err.message || (_this.selectionItem.id ? '修改奖品池失败' : '新建奖品池失败'),
                        duration: 3
                    });
                })
            },
            addPrizeItem() {
                if (this.selectionItem.prizeItemList.length >= 100) {
                    return;
                }
                this.coverImgObj.prizeItem.push(JSON.parse(JSON.stringify(this.coverImgList)));
                this.selectionItem.prizeItemList.push({
                    id: null,
                    prizePoolId: null,
                    name: null,
                    memo: null,
                    prizeType: null,
                    probability: null,
                    quantity: 0,
                    totalQuantity: null,
                    diffQuantity: null,
                    usedQuantity: 0,
                    displayOrder: null,
                    usedYunZuan: null,
                    buttonLabel1: null,
                    buttonLabel2: null,
                    prizeCouponPoolId: null,
                    goUrl: {},
                    goUrl1: {},
                    goUrl2: {},
                    goUrlList: [{
                        value: 0,
                        url: null
                    }],
                    goUrl1List: [{
                        value: 0,
                        url: null
                    }],
                    goUrl2List: [{
                        value: 0,
                        url: null
                    }],
                    typeList: JSON.parse(JSON.stringify(this.typeList)),
                    type1List: JSON.parse(JSON.stringify(this.typeList)),
                    type2List: JSON.parse(JSON.stringify(this.typeList)),
                    imageUrl: {},
                    prizeTypeExtBo: {
                        strategy: null,
                        yuzuan_number: null,
                        member_day: null,
                        vip_type: null,
                        channel: null,
                        md5key: null
                    }
                });
                let n = this.selectionItem.prizeItemList.length - 1;
                this.selectionItem.prizeItemList[n].typeList[0].disabled = true;
                this.selectionItem.prizeItemList[n].type1List[0].disabled = true;
                this.selectionItem.prizeItemList[n].type2List[0].disabled = true;
            },
            removePrizeItem(index) {
                this.selectionItem.prizeItemList.splice(index, 1);
                this.coverImgObj.prizeItem.splice(index, 1);
            },
            changePrizeType(prizeType) {
                if ((prizeType === 5) || (prizeType === 6) || (prizeType === 7) || (prizeType === 11)) {
                    this.query_list(null, prizeType);
                }
            },
            query_list(type, prizeType) {
                const _this = this;
                if (!prizeType) {
                    api.get('get_prize_type_idAndName').then(res => {
                        //console.log(res);
                        _this.prizeList = res.data;
                        _this.prizeList.push({
                          id: 88,
                          name: '影视会员优惠券'
                        })
                    }).catch(err => {
                        //console.error(err);
                        _this.$Message.error({
                            content: err.message || '奖品类型获取失败',
                            duration: 3
                        });
                    });
                } else {
                    _this.$Spin.show();
                }
                api.get('get_pool_type', {
                    prizeType: prizeType || ''
                }).then(res => {
                    //console.log(res);
                    _this.prizePoolList = res.data;
                    if (type) {
                        _this.$Message.success({
                            content: '券池列表刷新成功',
                            duration: 3
                        });
                    }
                    if (prizeType) {
                        _this.$Spin.hide();
                    }
                }).catch(err => {
                    //console.error(err);
                    _this.$Message.error({
                        content: err.message || '奖品列表获取失败',
                        duration: 3
                    });
                    if (prizeType) {
                        _this.$Spin.hide();
                    }
                })
            },
            changePage(n) {
                this.page = n;
                this.query_prize_pool_list();
            },
            changePageSize(n) {
                this.pageSize = n;
                if (this.page === 1) {
                    this.query_prize_pool_list();
                }
            }
        },
        mounted() {
            //this.query_task_record_list('init');
            const _this = this;
            _this.query_prize_pool_list('init');

            if (window.location.href.split('?')[1] === 'type=create') {
                _this.handlePrizePool('create');
            }
        },
        created() {
            this.$store.commit('updatePathName');
            this.query_list();
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
        .collapse {
            span {
                width: 100px;
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
    .prizeClassifyContent {
        p {
            font-size: 14px;
            margin-bottom: 5px;
            span {
                display: inline-block;
                text-align: center;
                width: 35%;
                &:nth-child(1) {
                    width: 25%;
                }
            }
        }
    }
</style>
