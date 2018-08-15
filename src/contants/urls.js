/*
* @Author: baosheng
* @Date:   2018-04-02 22:21:55
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 21:59:09
*/
const BASE_URL = ``

export const HOME = `${BASE_URL}/Home`
export const MESSAGE = `${BASE_URL}/Message`
export const PUSHORDER = `${BASE_URL}/PushOrder` // 发布工单
export const WORKORDER = `${BASE_URL}/WorkOrder` // 工单列表

// 工单
export const APPLYDETAIL = `${WORKORDER}/applyDetail` // 审批详情
export const APPLYRECORD = `${WORKORDER}/applyRecord` // 审批记录
export const ORDERDETAIL = `${WORKORDER}/orderDetail` // 工单详情
export const ELETAGREEMENT = `${WORKORDER}/eletAgreement` // 电子合同
export const APPLYSUGGEST = `${WORKORDER}/applySuggest` // 审批意见
export const SELECTCOMP = `${WORKORDER}/selectComp` // 选择中标单位
export const CONFIRMPROGRESS = `${WORKORDER}/ConfirmProgress` // 进度确认

// 我的
export const MINE = `${BASE_URL}/Mine`
export const ACCOUNT = `${MINE}/Account` // 我的账户
export const ACCOUNTRECHARGE = `${ACCOUNT}/recharge` // 我的账户》充值
export const ACCOUNTWITHDRAWCASH = `${ACCOUNT}/withdrawCash` // 我的账户》提现
export const ACCOUNTDETAIL = `${ACCOUNT}/detail` // 我的账户》账户详细

export const LOGIN = `${BASE_URL}/Login/login` // 登录
export const REGISTER = `${BASE_URL}/Login/register` // 注册
export const FORGETPWD = `${BASE_URL}/Login/forgetPwd` // 忘记密码
export const RESETPWD = `${BASE_URL}/Login/resetPwd` // 重置密码

export const SYSNOTICE = `${BASE_URL}/Message/sysNotice` // 系统通知
export const CHATBOX = `${BASE_URL}/Message/chatBox` // 聊天框
export const USERINFO = `${BASE_URL}/Message/userInfo` // 用户信息

