import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'

import Index from '@/components/Index'

import SceneManagement from '@/components/SceneManagement'

import ProjectManagement from '@/components/ProjectManagement'

import Constraint from '@/components/Constraint/Constraint'
import ConstraintManagement from '@/components/Constraint/ConstraintManagement'
import ConstraintRule from '@/components/Constraint/ConstraintRule'

import Prize from '@/components/Prize/Prize'
import PrizeType from '@/components/Prize/PrizeType'
import PrizePool from '@/components/Prize/PrizePool'
import PrizePoolBackup from '@/components/Prize/PrizePoolBackup'
import PrizeReal from '@/components/Prize/PrizeReal'
import PrizeRecord from '@/components/Prize/PrizeRecord'
import PrizeCount from '@/components/Prize/PrizeCount'
import PrizeCompensate from '@/components/Prize/PrizeCompensate'

import Coupon from '@/components/Coupon/Coupon'
import CouponPool from '@/components/Coupon/CouponPool'
import CouponCard from '@/components/Coupon/CouponCard'
import CouponQRCode from '@/components/Coupon/CouponQRCode'

import Task from '@/components/Task/Task'
import TaskRule from '@/components/Task/TaskRule'
import TaskManagement from '@/components/Task/TaskManagement'
import TaskRecord from '@/components/Task/TaskRecord'
import TaskCount from '@/components/Task/TaskCount'
import TaskVip from '@/components/Task/TaskVip'
import TaskPromotion from '@/components/Task/TaskPromotion'

import Log from '@/components/Log/Log'
import LogHandle from '@/components/Log/LogHandle'
import LogYunZuan from '@/components/Log/LogYunZuan'
import LogNew from '@/components/Log/LogNew'
import LogCoupon from '@/components/Log/LogCoupon'
import LogStar from '@/components/Log/LogStar'
import LogMail from '@/components/Log/LogMail'
import LogVip from '@/components/Log/LogVip'
import LogAllowance from '@/components/Log/LogAllowance'

import Sign from '@/components/Sign/Sign'
import SignManagement from '@/components/Sign/SignManagement'
import SignTiming from '@/components/Sign/SignTiming'

import SystemManagement from '@/components/SystemManagement'

import Interface from '@/components/Interface'

import ClearRedis from '@/components/ClearRedis'

import Login from '@/components/Login'
import Register from '@/components/Register'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: {
        title: '任务系统管理后台(PPMS)'
      },
      component: Home,
      children: [
        {
          path: '',
          meta: {
            title: '任务系统管理后台(PPMS)'
          },
          name: 'Index',
          component: Index
        },
        {
          path: 'scene',
          meta: {
            title: 'PPMS - 场景管理'
          },
          name: 'SceneManagement',
          component: SceneManagement
        },
        {
          path: 'project',
          meta: {
            title: 'PPMS - 项目管理'
          },
          name: 'ProjectManagement',
          component: ProjectManagement
        },
        {
          path: 'constraint',
          name: 'Constraint',
          component: Constraint,
          children: [
            {
              path: 'management',
              meta: {
                title: 'PPMS - 约束管理'
              },
              name: 'ConstraintManagement',
              component: ConstraintManagement
            },
            {
              path: 'rule',
              meta: {
                title: 'PPMS - 约束规则类型'
              },
              name: 'ConstraintRule',
              component: ConstraintRule
            }
          ]
        },
        {
          path: 'prize',
          name: 'Prize',
          component: Prize,
          children: [
            {
              path: 'type',
              meta: {
                title: 'PPMS - 奖品类型'
              },
              name: 'PrizeType',
              component: PrizeType
            },
            {
              path: 'pool',
              meta: {
                title: 'PPMS - 奖品池管理'
              },
              name: 'PrizePoolBackup',
              component: PrizePoolBackup
            },
            {
              path: 'real',
              meta: {
                title: 'PPMS - 实物领奖日志'
              },
              name: 'PrizeReal',
              component: PrizeReal
            },
            {
              path: 'record',
              meta: {
                title: 'PPMS - 领奖记录日志'
              },
              name: 'PrizeRecord',
              component: PrizeRecord
            },
            {
              path: 'count',
              meta: {
                title: 'PPMS - 领奖记录统计'
              },
              name: 'PrizeCount',
              component: PrizeCount
            },
            {
              path: 'compensate',
              meta: {
                title: 'PPMS - 补偿调用管理'
              },
              name: 'PrizeCompensate',
              component: PrizeCompensate
            }
          ]
        },
        {
          path: 'coupon',
          name: 'Coupon',
          component: Coupon,
          children: [
            {
              path: 'pool',
              meta: {
                title: 'PPMS - 券池管理'
              },
              name: 'CouponPool',
              component: CouponPool
            },
            {
              path: 'card',
              meta: {
                title: 'PPMS - 卡密日志'
              },
              name: 'CouponCard',
              component: CouponCard
            },
            {
              path: 'qrcode',
              meta: {
                title: 'PPMS - 二维码日志'
              },
              name: 'CouponQRCode',
              component: CouponQRCode
            }
          ]
        },
        {
          path: 'task',
          name: 'Task',
          component: Task,
          children: [
            {
              path: 'management',
              meta: {
                title: 'PPMS - 任务管理'
              },
              name: 'TaskManagement',
              component: TaskManagement
            },
            {
              path: 'rule',
              meta: {
                title: 'PPMS - 任务规则'
              },
              name: 'TaskRule',
              component: TaskRule
            },
            {
              path: 'record',
              meta: {
                title: 'PPMS - 任务执行日志'
              },
              name: 'TaskRecord',
              component: TaskRecord
            },
            {
              path: 'count',
              meta: {
                title: 'PPMS - 任务执行统计'
              },
              name: 'TaskCount',
              component: TaskCount
            },
            {
              path: 'vip',
              meta: {
                title: 'PPMS - 会员任务执行日志'
              },
              name: 'TaskVip',
              component: TaskVip
            },
            {
              path: 'promotion',
              meta: {
                title: 'PPMS - 促销管理'
              },
              name: 'TaskPromotion',
              component: TaskPromotion
            }
          ]
        },
        {
          path: 'log',
          name: 'Log',
          component: Log,
          children: [
            {
              path: 'handle',
              meta: {
                title: 'PPMS - 操作日志'
              },
              name: 'LogHandle',
              component: LogHandle
            },
            {
              path: 'yunzuan',
              meta: {
                title: 'PPMS - 云钻调用日志'
              },
              name: 'LogYunZuan',
              component: LogYunZuan
            },
            {
              path: 'new',
              meta: {
                title: 'PPMS - 新人礼包调用日志'
              },
              name: 'LogNew',
              component: LogNew
            },
            {
              path: 'coupon',
              meta: {
                title: 'PPMS - 易购券调用日志'
              },
              name: 'LogCoupon',
              component: LogCoupon
            },
            {
              path: 'star',
              meta: {
                title: 'PPMS - 球星卡调用日志'
              },
              name: 'LogStar',
              component: LogStar
            },
            {
              path: 'mail',
              meta: {
                title: 'PPMS - 站内信日志'
              },
              name: 'LogMail',
              component: LogMail
            },
            {
              path: 'vip',
              meta: {
                title: 'PPMS - 会员发放日志'
              },
              name: 'LogVip',
              component: LogVip
            },
            {
              path: 'allowance',
              meta: {
                title: 'PPMS - 购物津贴发放日志'
              },
              name: 'LogAllowance',
              component: LogAllowance
            }
          ]
        },
        {
          path: 'system',
          meta: {
            title: 'PPMS - 用户信息日志'
          },
          name: 'SystemManagement',
          component: SystemManagement
        },
        {
          path: 'interface',
          meta: {
            title: 'PPMS - 第三方接口'
          },
          name: 'Interface',
          component: Interface
        },
        {
          path: 'redis',
          meta: {
            title: 'PPMS - 管理员操作'
          },
          name: 'ClearRedis',
          component: ClearRedis
        },
        {
          path: 'sign',
          name: 'Sign',
          component: Sign,
          children: [
            {
              path: 'management',
              meta: {
                title: 'PPMS - 签到管理'
              },
              name: 'SignManagement',
              component: SignManagement
            },
            {
              path: 'timing',
              meta: {
                title: 'PPMS - 签到定时'
              },
              name: 'SignTiming',
              component: SignTiming
            }
          ]
        },
      ]
    },
    {
      path: '/login',
      meta: {
        title: 'PPMS - 登录'
      },
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      meta: {
        title: 'PPMS - 注册'
      },
      name: 'Register',
      component: Register
    },
    {
      path: '*',
      meta: {
        title: '任务系统管理后台(PPMS)'
      },
      name: 'Index',
      component: Index
    }
  ]
})
