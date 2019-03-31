<template>
    <div class="index">
        <p class="basic_info">
            <img :src="'../../static/img/pic/' + pic" alt="">
            <span>{{timeText}}，欢迎登录 <br> 任务系统管理后台(PPMS)</span>
            <Button style="position: absolute; bottom: 10px; left: 220px;" @click="logout">退出登录</Button>
        </p>
        <Divider style="color: #5D6B77;">快捷操作</Divider>
        <p class="quick_list">
            <router-link to="/task/management?type=create">
                <Icon type="ios-list-box" style="font-size: 50px;"/>
                <span>新建任务</span>
            </router-link>
            <router-link to="/project?type=create">
                <Icon type="ios-list-box" style="font-size: 50px;"/>
                <span>新建项目</span>
            </router-link>
            <router-link to="/constraint/management?type=create">
                <Icon type="ios-list-box" style="font-size: 50px;"/>
                <span>新建约束</span>
            </router-link>
            <router-link to="/prize/pool?type=create">
                <Icon type="ios-list-box" style="font-size: 50px;"/>
                <span>新建奖池</span>
            </router-link>
            <router-link to="/coupon/pool?type=create">
                <Icon type="ios-list-box" style="font-size: 50px;"/>
                <span>新建券池</span>
            </router-link>
            <router-link to="/task/promotion?type=create">
                <Icon type="ios-list-box" style="font-size: 50px;"/>
                <span>新建促销</span>
            </router-link>
        </p>
    </div>
</template>

<script>
    import utils from '../libs/utils'
    export default {
        name: "Index",
        data () {
            return {
                timeText: '',
                pic: null,
                username:'',
                password:'',
                picList: [
                    'myjobdeer.png',
                    'myjobdeer1.png',
                    'myjobdeer2.png',
                    'myjobdeer3.png',
                    'myjobdeer4.png',
                    'myjobdeer5.png',
                    'myjobdeer6.png',
                    'myjobdeer7.png',
                    'myjobdeer8.png',
                    'myjobdeer9.png',
                    'myjobdeer10.png'
                ]
            }
        },
        methods: {
            logout() {
                window.location.href = '/logout.do';
            }
        },
        created() {
            let localData = window.localStorage.getItem('ppms/pic');
            if (localData) {
                localData = JSON.parse(localData);
                if ((localData.date / 1) !== (utils.dateFormat(new Date().getTime(), 'YYYYMMDD') / 1)) {
                    this.pic = this.picList[parseInt(Math.random() * 12)] || this.picList[0];
                    window.localStorage.setItem('ppms/pic', JSON.stringify({
                        pic: this.pic,
                        date: utils.dateFormat(new Date().getTime(), 'YYYYMMDD')
                    }))
                } else {
                    this.pic = localData.pic;
                }
            } else {
                this.pic = this.picList[parseInt(Math.random() * 2)];
                window.localStorage.setItem('ppms/pic', JSON.stringify({
                    pic: this.pic,
                    date: utils.dateFormat(new Date().getTime(), 'YYYYMMDDhhmmss')
                }))
            }
            let hour = utils.dateFormat(new Date().getTime(), 'hh') / 1;
            if (hour < 6) {
                this.timeText = '凌晨好';
            } else if (hour < 11) {
                this.timeText = '上午好';
            } else if (hour < 14) {
                this.timeText = '中午好';
            } else if (hour < 18) {
                this.timeText = '下午好';
            } else {
                this.timeText = '晚上好';
            }
        }
    }
</script>

<style scoped lang="less">
    .index {
        padding-top: 60px;
        .basic_info {
            position: relative;
            padding-left: 100px;
            margin-bottom: 60px;
            img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
            }
            span {
                position: absolute;
                top: 10px;
                left: 220px;
            }
        }
        .quick_list {
            display: flex;
            justify-content: space-evenly;
            margin-top: 50px;
            a {
                display: inline-block;
                width: 60px;
                height: 80px;
                color: #5D6B77;
                text-align: center;
                span {
                    font-size: 14px;
                }
            }
        }
    }
</style>