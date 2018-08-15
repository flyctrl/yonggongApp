/*
* @Author: chengbs
* @Date:   2018-05-22 14:13:58
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 22:02:16
*/
import React from 'react'
import * as urls from 'Contants/urls'
import Loadable from 'react-loadable'

function MyLoadingComponent() {
  return <div></div>
}
const Home = Loadable({ // 首页
  loader: () => import(/* webpackChunkName: "home" */ '../models/Home'),
  loading: MyLoadingComponent
})
const Message = Loadable({ // 消息
  loader: () => import(/* webpackChunkName: "message" */ '../models/Message'),
  loading: MyLoadingComponent
})
const PushOrder = Loadable({ // 发布工单
  loader: () => import(/* webpackChunkName: "pushorder" */ '../models/PushOrder'),
  loading: MyLoadingComponent
})
const WorkOrder = Loadable({ // 工单
  loader: () => import(/* webpackChunkName: "tobedone" */ '../models/WorkOrder'),
  loading: MyLoadingComponent
})

const ApplyDetail = Loadable({ // 审批详情
  loader: () => import(/* webpackChunkName: "applydetail" */ '../models/WorkOrder/applyDetail'),
  loading: MyLoadingComponent
})
const ApplyRecord = Loadable({ // 审批记录
  loader: () => import(/* webpackChunkName: "applyrecord" */ '../models/WorkOrder/applyRecord'),
  loading: MyLoadingComponent
})
const OrderDetail = Loadable({ // 工单详情
  loader: () => import(/* webpackChunkName: "orderdetail" */ '../models/WorkOrder/orderDetail'),
  loading: MyLoadingComponent
})
const EletAgreement = Loadable({ // 电子合同
  loader: () => import(/* webpackChunkName: "eletagreement" */ '../models/WorkOrder/eletAgreement'),
  loading: MyLoadingComponent
})
const ApplySuggest = Loadable({ // 审批意见
  loader: () => import(/* webpackChunkName: "applysuggest" */ '../models/WorkOrder/applySuggest'),
  loading: MyLoadingComponent
})
const SelectComp = Loadable({ // 选择中标单位
  loader: () => import(/* webpackChunkName: "selectcomp" */ '../models/WorkOrder/selectComp'),
  loading: MyLoadingComponent
})
const ConfirmProgress = Loadable({ // 进度确认
  loader: () => import(/* webpackChunkName: "confirmprogress" */ '../models/WorkOrder/confirmProgress'),
  loading: MyLoadingComponent
})

const Mine = Loadable({ // 我的
  loader: () => import(/* webpackChunkName: "mine" */ '../models/Mine'),
  loading: MyLoadingComponent
})
const Account = Loadable({ // 我的账户
  loader: () => import(/* webpackChunkName: "account" */ '../models/Mine/Account'),
  loading: MyLoadingComponent
})
const AccountDetail = Loadable({ // 我的账户》账户详情
  loader: () => import(/* webpackChunkName: "accountdetail" */ '../models/Mine/Account/detail'),
  loading: MyLoadingComponent
})
const AccountRecharge = Loadable({ // 我的账户》充值
  loader: () => import(/* webpackChunkName: "accountrecharge" */ '../models/Mine/Account/recharge'),
  loading: MyLoadingComponent
})
const AccountWithdrawCash = Loadable({ // 我的账户》提现
  loader: () => import(/* webpackChunkName: "accountwithdrawcash" */ '../models/Mine/Account/withdrawCash'),
  loading: MyLoadingComponent
})

const Login = Loadable({ // 登录
  loader: () => import(/* webpackChunkName: "login" */ '../models/Login/login'),
  loading: MyLoadingComponent
})
const Register = Loadable({ // 注册
  loader: () => import(/* webpackChunkName: "register" */ '../models/Login/register'),
  loading: MyLoadingComponent
})
const ForgetPwd = Loadable({ // 忘记密码
  loader: () => import(/* webpackChunkName: "forgetpwd" */ '../models/Login/forgetPwd'),
  loading: MyLoadingComponent
})
const ResetPwd = Loadable({ // 重置密码
  loader: () => import(/* webpackChunkName: "resetpwd" */ '../models/Login/resetPwd'),
  loading: MyLoadingComponent
})

const SysNotice = Loadable({ // 系统通知
  loader: () => import(/* webpackChunkName: "sysnotice" */ '../models/Message/sysNotice'),
  loading: MyLoadingComponent
})
const ChatBox = Loadable({ // 聊天框
  loader: () => import(/* webpackChunkName: "chatbox" */ '../models/Message/chatBox'),
  loading: MyLoadingComponent
})
const UserInfo = Loadable({ // 用户信息
  loader: () => import(/* webpackChunkName: "userinfo" */ '../models/Message/userInfo'),
  loading: MyLoadingComponent
})

const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
    parent: null,
    showMenu: true,
    animated: false,
    title: '首页'
  },
  {
    path: urls.HOME,
    exact: true,
    component: Home,
    parent: null,
    showMenu: true,
    animated: false,
    title: '首页'
  }, {
    path: urls.WORKORDER,
    exact: true,
    component: WorkOrder,
    parent: null,
    animated: false,
    showMenu: true,
    title: '工单'
  }, {
    path: urls.PUSHORDER,
    exact: true,
    component: PushOrder,
    parent: null,
    showMenu: false,
    animated: false,
    title: '发布工单'
  }, {
    path: urls.MESSAGE,
    exact: true,
    component: Message,
    parent: null,
    animated: false,
    showMenu: true,
    title: '消息'
  }, {
    path: urls.MINE,
    exact: true,
    component: Mine,
    parent: null,
    animated: false,
    showMenu: true,
    title: '我的'
  }, {
    path: urls.APPLYDETAIL,
    exact: true,
    component: ApplyDetail,
    parent: 'WorkOrder',
    animated: true,
    showMenu: false,
    title: '审批详情'
  }, {
    path: urls.APPLYRECORD,
    exact: true,
    component: ApplyRecord,
    parent: 'ApplyDetail',
    animated: true,
    showMenu: false,
    title: '审批记录'
  }, {
    path: urls.ORDERDETAIL,
    exact: true,
    component: OrderDetail,
    parent: 'WorkOrder',
    animated: true,
    showMenu: false,
    title: '工单详情'
  }, {
    path: urls.ELETAGREEMENT,
    exact: true,
    component: EletAgreement,
    parent: null,
    animated: true,
    showMenu: false,
    title: '电子合同'
  }, {
    path: urls.APPLYSUGGEST,
    exact: true,
    component: ApplySuggest,
    parent: 'ApplyDetail',
    animated: true,
    showMenu: false,
    title: '审批意见'
  }, {
    path: urls.SELECTCOMP,
    exact: true,
    component: SelectComp,
    parent: 'WorkOrder',
    animated: true,
    showMenu: true,
    title: '选择中标单位'
  }, {
    path: urls.CONFIRMPROGRESS,
    exact: true,
    component: ConfirmProgress,
    parent: 'WorkOrder',
    animated: true,
    showMenu: true,
    title: '进度确认'
  }, {
    path: urls.ACCOUNT,
    exact: true,
    component: Account,
    parent: true,
    animated: true,
    showMenu: false,
    title: '我的账户'
  }, {
    path: urls.ACCOUNTDETAIL,
    exact: true,
    component: AccountDetail,
    parent: true,
    animated: true,
    showMenu: false,
    title: '账户详情'
  }, {
    path: urls.ACCOUNTRECHARGE,
    exact: true,
    component: AccountRecharge,
    parent: true,
    animated: true,
    showMenu: false,
    title: '充值'
  }, {
    path: urls.ACCOUNTWITHDRAWCASH,
    exact: true,
    component: AccountWithdrawCash,
    parent: true,
    animated: true,
    showMenu: false,
    title: '提现'
  }, {
    path: urls.LOGIN,
    exact: true,
    component: Login,
    parent: null,
    animated: false,
    showMenu: false,
    title: '登录'
  }, {
    path: urls.REGISTER,
    exact: true,
    component: Register,
    parent: null,
    animated: false,
    showMenu: false,
    title: '注册'
  }, {
    path: urls.FORGETPWD,
    exact: true,
    component: ForgetPwd,
    parent: null,
    animated: false,
    showMenu: false,
    title: '忘记密码'
  }, {
    path: urls.RESETPWD,
    exact: true,
    component: ResetPwd,
    parent: null,
    animated: false,
    showMenu: false,
    title: '重置密码'
  }, {
    path: urls.SYSNOTICE,
    exact: true,
    component: SysNotice,
    parent: 'Message',
    showMenu: false,
    animated: true,
    title: '系统通知'
  }, {
    path: urls.CHATBOX,
    exact: true,
    component: ChatBox,
    parent: 'Message',
    showMenu: false,
    animated: false,
    title: '聊天框'
  }, {
    path: urls.USERINFO,
    exact: true,
    component: UserInfo,
    parent: 'ChatBox',
    showMenu: false,
    animated: false,
    title: '用户信息'
  }
]

export default routes
