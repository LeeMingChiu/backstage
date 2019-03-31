<template>
    <div class="layout">
        <Layout>
            <Sider ref="side" hide-trigger collapsible :collapsed-width="100" :width="240" v-model="isCollapsed" style="overflow: auto;" class="sider">
                <div class="layout-logo">
                    <img src="../../static/img/logo.png" style="width: 150px; height: 60px;" v-if="!isCollapsed">
                    <img src="../../static/img/PLogo.png" :style="{width: isCollapsed ? '60px' : '110px'}" v-else>
                    <Icon @click.native="collapsedSider" :class="rotateIcon" style="color: #fff; cursor: pointer; z-index: 1000" type="ios-arrow-back" size="24"></Icon>
                </div>
                <Menu :active-name="activeName" theme="dark" width="auto" :open-names="openName" :style="{textAlign: isCollapsed ? 'center' : 'left'}">
                    <MenuItem name="100-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/" title="首页">
                        <img src="../../static/img/icon/home.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                        <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">首页</span>
                    </MenuItem>
                    <Submenu name="1">
                        <template slot="title" title="任务">
                            <img src="../../static/img/icon/task.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">任务</span>
                        </template>
                        <MenuItem name="1-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/task/management" title="任务管理">
                            <img src="../../static/img/icon/task_management.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">任务管理</span>
                        </MenuItem>
                        <MenuItem name="1-2" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/task/rule" title="任务规则">
                            <img src="../../static/img/icon/task_rule.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">任务规则</span>
                        </MenuItem>
                    </Submenu>
                    <Submenu name="2">
                        <template slot="title" title="约束">
                            <img src="../../static/img/icon/constraint.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">约束</span>
                        </template>
                        <MenuItem name="2-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/constraint/management" title="约束管理">
                            <img src="../../static/img/icon/constraint_management.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">约束管理</span>
                        </MenuItem>
                        <MenuItem name="2-2" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/constraint/rule" title="约束规则类型">
                            <img src="../../static/img/icon/constraint_rule_type.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">约束规则类型</span>
                        </MenuItem>
                    </Submenu>
                    <Submenu name="3">
                        <template slot="title" title="奖品">
                            <img src="../../static/img/icon/prize.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">奖品</span>
                        </template>
                        <MenuItem name="3-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/prize/pool" title="奖品池管理">
                            <img src="../../static/img/icon/prize_pool_management.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">奖品池管理</span>
                        </MenuItem>
                        <MenuItem name="3-2" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/coupon/pool" title="券池管理">
                            <img src="../../static/img/icon/coupon_pool_management.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">券池管理</span>
                        </MenuItem>
                        <MenuItem name="3-3" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/prize/type" title="奖品类型">
                            <img src="../../static/img/icon/prize_type.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">奖品类型</span>
                        </MenuItem>
                        <MenuItem name="3-4" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/prize/compensate" title="补偿调用管理">
                            <img src="../../static/img/icon/compensate_management.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">补偿调用管理</span>
                        </MenuItem>
                    </Submenu>
                    <MenuItem name="4-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/project" title="项目管理">
                        <img src="../../static/img/icon/project_management.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                        <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">项目管理</span>
                    </MenuItem>
                    <MenuItem name="5-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/task/promotion" title="促销管理">
                        <img src="../../static/img/icon/promotion_management.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                        <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">促销管理</span>
                    </MenuItem>
                    <MenuItem name="6-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/scene" title="场景管理">
                        <img src="../../static/img/icon/scene_management.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                        <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">场景管理</span>
                    </MenuItem>
                    <Submenu name="7">
                        <template slot="title" title="统计">
                            <img src="../../static/img/icon/count.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">统计</span>
                        </template>
                        <MenuItem name="7-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/task/count" title="任务执行统计">
                            <img src="../../static/img/icon/handle_task_count.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">任务执行统计</span>
                        </MenuItem>
                        <MenuItem name="7-2" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/prize/count" title="领奖记录统计">
                            <img src="../../static/img/icon/get_prize_count.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">领奖记录统计</span>
                        </MenuItem>
                    </Submenu>
                    <Submenu name="8">
                        <template slot="title" title="日志">
                            <img src="../../static/img/icon/log.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">日志</span>
                        </template>
                        <MenuItem name="8-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/task/record" title="任务执行日志">
                            <img src="../../static/img/icon/handle_task_log.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">任务执行日志</span>
                        </MenuItem>
                        <MenuItem name="8-2" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/task/vip" title="会员任务执行日志">
                            <img src="../../static/img/icon/handle_vip_task_log.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">会员任务执行日志</span>
                        </MenuItem>
                        <MenuItem name="8-3" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/prize/real" title="实物领奖日志">
                            <img src="../../static/img/icon/real_prize_record.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">实物领奖日志</span>
                        </MenuItem>
                        <MenuItem name="8-4" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/coupon/card" title="卡密日志">
                            <img src="../../static/img/icon/card_pass_coupon.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">卡密日志</span>
                        </MenuItem>
                        <MenuItem name="8-5" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/coupon/qrcode" title="二维码日志">
                            <img src="../../static/img/icon/qrcode_coupon.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">二维码日志</span>
                        </MenuItem>
                        <MenuItem name="8-6" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/prize/record" title="领奖记录日志">
                            <img src="../../static/img/icon/get_prize_record.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">领奖记录日志</span>
                        </MenuItem>
                        <MenuItem name="8-7" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/log/handle" title="操作日志">
                            <img src="../../static/img/icon/handle_log.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">操作日志</span>
                        </MenuItem>
                        <MenuItem name="8-8" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/log/yunzuan" title="云钻调用日志">
                            <img src="../../static/img/icon/yunzuan_log.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">云钻调用日志</span>
                        </MenuItem>
                        <MenuItem name="8-9" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/log/new" title="新人礼包调用日志">
                            <img src="../../static/img/icon/new_log.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">新人礼包调用日志</span>
                        </MenuItem>
                        <MenuItem name="8-10" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/log/coupon" title="易购券调用日志">
                            <img src="../../static/img/icon/coupon_log.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">易购券调用日志</span>
                        </MenuItem>
                        <MenuItem name="8-11" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/log/star" title="球星卡调用日志">
                            <img src="../../static/img/icon/star_log.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">球星卡调用日志</span>
                        </MenuItem>
                        <MenuItem name="8-12" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/log/mail" title="站内信日志">
                            <img src="../../static/img/icon/site_log.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">站内信日志</span>
                        </MenuItem>
                        <MenuItem name="8-13" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/log/vip" title="会员发放日志">
                            <img src="../../static/img/icon/vip_log.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">会员发放日志</span>
                        </MenuItem>
                        <MenuItem name="8-14" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/log/allowance" title="购物津贴发放日志">
                            <img src="../../static/img/icon/allowance_log.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">购物津贴发放日志</span>
                        </MenuItem>
                        <MenuItem name="8-15" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/system" title="用户信息日志">
                            <img src="../../static/img/icon/userinfo.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                            <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">用户信息日志</span>
                        </MenuItem>
                    </Submenu>
                  <Submenu name="9">
                    <template slot="title" title="签到">
                      <img src="../../static/img/icon/sign.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                      <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">签到</span>
                    </template>
                    <MenuItem name="9-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/sign/management" title="签到管理">
                      <img src="../../static/img/icon/sign_management.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                      <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">签到管理</span>
                    </MenuItem>
                    <MenuItem name="9-2" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/sign/timing" title="签到定时">
                      <img src="../../static/img/icon/sign_timing.png" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}"/>
                      <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">签到定时</span>
                    </MenuItem>
                  </Submenu>
                    <MenuItem name="10-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/interface" title="第三方接口">
                        <Icon type="ios-contacts-outline" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}" style="font-size: 24px; vertical-align: baseline; color: #fff;" />
                        <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">第三方接口</span>
                    </MenuItem>
                    <MenuItem name="11-1" :style="{padding: isCollapsed ? '0 18px' : '14px 24px 14px 24px'}" to="/redis" title="管理员操作">
                        <Icon type="ios-contact-outline" class="menu-item-icon" :class="{'menu-item-icon-collapsed': isCollapsed}" style="font-size: 24px; vertical-align: baseline; color: #fff;" />
                        <span class="menu-item-span" :class="{'menu-item-span-collapsed': isCollapsed}">管理员操作</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout :style="{padding: '10px'}">
                <Content :style="{padding: '10px', background: '#fff', textAlign: 'left', borderRadius: '5px'}">
                    <router-view></router-view>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Home",
        data () {
            return {
                isCollapsed: false
            }
        },
        computed: {
            ...mapState({
                activeName: state => state.activeName,
                openName: state => state.openName,
                userInfo: state => state.userInfo,
                autoLogin: state => state.autoLogin
            }),
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            }
        },
        methods: {
            collapsedSider () {
                this.$refs.side.toggleCollapse();
            }
        },
        mounted: function () {
            /*//console.log(this.pathName);
            this.$store.commit('updatePathName', {pathName: 'aaa'});
            //console.log(this.pathName);*/
        },
        watch: {
            isCollapsed: function () {
                let list = document.getElementsByClassName('ivu-icon ivu-icon-ios-arrow-down ivu-menu-submenu-title-icon');
                for (let i = 0; i < list.length; i++) {
                    list[i].style["cssFloat" in list[i].style ? "cssFloat" : "styleFloat"]= this.isCollapsed ? 'none' : 'right';
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../static/style/index";

    .sider .ivu-layout-sider-children {
        overflow: auto;
    }

    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        height: 100%;
        .ivu-layout {
            height: 100%;
        }
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 24px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }

    .menu-icon{
        transition: all .3s;
        position: absolute;
        bottom: -20px;
        right: 3px;
        z-index: 10000;
    }
    .rotate-icon{
        transform: rotate(-180deg);
    }

    .layout-logo {
        width: 100%;
        height: 60px;
        border-radius: 3px;
        margin: 5px auto;
        position: relative;
    }

    .menu-item-icon {
        width: 20px;
        height: 20px;
        position: relative;
        top: -2px;
        transition: all .1s ease;
    }

    .menu-item-icon-collapsed {
        top: 3px;
        left: 5px;
        margin: 5px 0;
    }

    .menu-item-span {
        display: inline-block;
        overflow: hidden;
        width: 125px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: baseline;
        transition: width .2s ease .1s;
        padding-left: 10px;
    }

    .menu-item-span-collapsed {
        width: 0;
        transition: width .2s ease;
    }

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
        color: #fff;
    }
</style>
