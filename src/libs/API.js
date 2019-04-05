import Vue from 'vue'
import Cookies from 'js-cookie'
let host = 'http://192.168.0.105:8000/';

//host = 'http://ppmspre.cnsuning.com/';

//host = 'http://10.200.189.5:8080/ppms-admin-web/';

//host = '';
let config = {
  url: {
    get_token:'index/token',
    //场景模块
    query_scene_list: 'scene/admin/query.do',//场景列表
    save_scene: 'scene/admin/save.do',//场景更新
    query_scene_id_and_name: 'index/scenes/query/',//获取场景的ID和name


    login:'index/login/',
    register:'index/register/',

    //项目模块
    query_project_list: 'project/admin/query.do',//项目列表
    save_project: 'project/admin/save.do',//项目更新
    delete_project_img: 'project/admin/delImage.do',//删除任务图片
    switch_project_state: 'project/admin/updateState.do',//项目上下线
    query_project_id_and_name: 'index/project/query/',//获取项目ID和name

    //用户信息模块
    query_userinfo_list: 'system/userInfo/query.do',//用户信息列表

    //任务模块
    query_task_list: 'index/task/query/',//任务列表
    query_task_detail: 'index/task/detail/',//任务详情
    switch_task_state: 'index/task/switch/',//切换任务开关状态
    save_task: 'index/new_task/',//新建/更新任务
    delete_task_img: 'task/admin/delImage.do',//删除任务图片
    query_task_rule: 'task/admin/get/activityRule.do',//获取任务规则
    save_task_rule: 'task/admin/save/activityRule.do',//保存任务规则
    query_task_record: 'task/record/query.do',//任务执行记录列表
    query_task_count: 'task/record/statis/count.do',//任务执行记录统计
    query_task_promotion: 'task/salePromotion/query.do',//促销管理列表
    save_task_promotion: 'task/salePromotion/save.do',//新建/更新促销信息
    query_task_promotion_id_and_name: 'task/salePromotion/idAndName.do',//查询促销信息ID和name
    delete_promotion_img: 'task/salePromotion/delImage.do',//删除促销信息图片
    query_task_vip_list: 'task/vip/query.do',//会员任务执行记录

    //约束模块
    query_constraint_list: 'constraint/admin/query.do',//查询约束列表
    save_constraint: 'constraint/admin/save.do',//新建/更新约束
    query_all_constraint: 'index/cons/query',//查询所有约束
    query_constraint_rule_list: 'constraint/rule/query.do',//查询约束规则列表
    query_constraint_rule_id_name: 'index/cons/query/',//查询约束规则列表

    //券池管理
    query_coupon_pool_list: 'coupon/pool/query.do',//券池列表
    save_coupon_pool: 'coupon/pool/save.do',//创建/更新券池
    import_coupon_pool_string: 'coupon/pool/string.do',//导入卡密信息
    import_coupon_pool_qrcode: 'coupon/pool/qrcode.do',//导入二维码信息
    query_surplus_coupon_pool: 'coupon/pool/remainderNum.do',//查询券池剩余数量
    download_template: 'coupon/pool/download.do',//下载模板
    query_prizePool_id_and_name: 'index/prize/query/',//查询奖品池的ID和name
    coupon_card_list: 'coupon/string/query.do',//卡密优惠券
    coupon_qrcode_list: 'coupon/qrcode/query.do',//二维码优惠券

    //日志模块
    query_log_vip: 'log/memberLog/query.do',//会员发放日志
    query_log_handle: 'log/operate/query.do',//操作日志
    query_log_new: 'log/registerPrizeLog/query.do',//新人礼包日志
    query_log_message: 'log/siteMessageLog/query.do',//站内信日志
    query_log_star: 'log/StarCardLog/query.do',//球星卡日志
    query_log_coupon: 'log/suningCouponLog/query.do',//易购优惠券日志
    query_log_yunzuan: 'log/yunzuan/query.do',//云钻日志
    query_log_allowance: 'log/bonusCouponLog/query.do',//购物津贴日志

    //优惠券管理
    query_qrcode_coupon: 'coupon/qrcode/query.do',//二维码优惠券列表
    delete_qrcode_coupon: 'coupon/qrcode/remove.do',//删除二维码优惠券
    query_string_coupon: 'coupon/string/query.do',//卡密优惠券列表
    delete_string_coupon: 'coupon/string/remove.do',//删除卡密优惠券
    add_pool_coupon: 'coupon/pool/add.do',//新增券池

    //奖品失败补偿调用模块
    query_fail_list: 'prize/failLog/query.do',//奖品失败补偿调用列表
    batch_compensate: 'prize/failLog/compensationCall.do',//批量补偿
    batch_recover: 'prize/failLog/restoreCall.do',//批量还原
    single_compensate: 'prize/failLog/singleCompensationCall.do',//单个补偿
    single_recover: 'prize/failLog/singleRestoreCall.do',//单个还原

    //奖品池模块
    query_prize_pool_list: 'prize/pool/query.do',//奖品池列表
    query_prize_pool_detail: 'prize/pool/goInput.do',//奖品池详情
    create_prize_pool: 'prize/pool/add.do',//新增奖品池
    update_prize_type: 'prize/pool/save/prizeTypeDisplay.do', // 更新奖品类型
    get_prize_type: 'prize/pool/getPrizeTypeDisplay.do', // 展示奖品类型
    update_prize_pool: 'prize/pool/update.do', // 更新奖品池
    get_prize_pool: 'prize/type/query.do', // 更新奖品池
    get_prize_real: 'prize/real/query.do', //领奖实物列表
    get_prize_count: 'prize/record/statis/count.do', // 领奖记录数据统计列表
    get_prize_record: 'prize/record/query.do', // 领奖记录管理列表
    export_prize_real: 'prize/real/export.do', // 导出
    updated_prize_real_mobileNum: 'prize/real/passportMobileNum.do', // 同步
    get_prize_type_idAndName: "prize/type/idAndName.do",// 奖品类型
    get_pool_type: "coupon/pool/idAndName.do",// 券池类型
    delete_prize_pool_img: 'prize/pool/delPoolImage.do',//删除奖品池图片
    delete_prize_item_img: 'prize/pool/delItemImage.do',//删除奖品项图片

    // 签到模块
    query_signIn_data:'signInPrize/admin/query.do', // 查询签到数据
    image_upload:'image/upload.do', // 图片上传
    signInPrize_delImage:'signInPrize/admin/delImage.do', // 删除签到奖品图片
    signInPrize_save:'signInPrize/admin/save/effective.do', // 保存 更新签到信息
    signInPrize_timing_save:'signInPrize/admin/save/timing.do' // 保存 更新签到信息
  }
};

const TIMEOUT = 6 * 1000;
function getCookie(NameOfCookie) {
  if (document.cookie.length > 0) {
    let begin = document.cookie.indexOf(NameOfCookie + "=");
    if (begin !== -1) {
      begin += NameOfCookie.length + 1;
      let end = document.cookie.indexOf(";", begin);
      if (end === -1) end = document.cookie.length;
      return unescape(document.cookie.substring(begin, end));
    }
  }
  return null
}
function fn(method, url, params, body, timeout) {
  //console.log(Cookies.get('token'))
  url = host + config.url[url];
  if (params) {
    let list = [];
    Object.keys(params).forEach(key => {
      list.push(key + '=' + params[key]);
    });
    params = list.join('&');
    url += '?' + params;
  }
  return new Promise((resolve, reject) => {
    Vue.http({
      method,
      url,
      body,
      timeout: timeout || TIMEOUT
    }).then(res => {
      /*if (res.body && res.body.idsIntercepted) {
        window.checkIframe();
        ajaxInSameDomain('/index.do', null, 'get', function (res) {}, function (err) {});
        reject({
          message: '操作失败，请尝试重新操作（身份失效需重新登录）'
        });
        return;
      }*/
      if (res.status === 200) {
        if(res.body.code === 0){
          resolve(res.body);
        }else{
          reject(res.body)
        }
      } else {
        reject(res.body);
      }
    }).catch(err => {
      console.error(err);
      reject(err);
    })
  })
}

export default {
  get: function (url, params) {
    return fn('GET', url, params);
  },
  post: function (url, params, body, timeout) {
    return fn('POST', url, params, body, timeout);
  }
}
