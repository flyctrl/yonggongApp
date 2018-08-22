/*
* @Author: baosheng
* @Date:   2018-04-02 22:21:55
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 21:59:09
*/
const BASE_URL = ``

export const HOME = `${BASE_URL}/Home`
export const MESSAGE = `${BASE_URL}/Message`
export const WORKORDER = `${BASE_URL}/WorkOrder` // 工单列表

export const PUSHNORMALORDER = `${BASE_URL}/PushOrder/pushNormalOrder` // 发布普通工单
export const PUSHQUICKORDER = `${BASE_URL}/PushOrder/pushQuickOrder` // 发布快单
export const PUSHBIDORDER = `${BASE_URL}/PushOrder/pushBidOrder` // 发布招标

// 工单
export const APPLYDETAIL = `${WORKORDER}/applyDetail` // 审批详情
export const APPLYRECORD = `${WORKORDER}/applyRecord` // 审批记录
export const ORDERDETAIL = `${WORKORDER}/orderDetail` // 工单详情
export const ELETAGREEMENT = `${WORKORDER}/eletAgreement` // 电子合同
export const APPLYSUGGEST = `${WORKORDER}/applySuggest` // 审批意见
export const SELECTCOMP = `${WORKORDER}/selectComp` // 选择中标单位
export const BEGINLIST = `${WORKORDER}/beginList` // 开工列表
export const SETTLELIST = `${WORKORDER}/settleList` // 结算列表

// 我的
export const MINE = `${BASE_URL}/Mine`
export const MYPUSH = `${MINE}/myPush` // 我的发布

export const ACCOUNT = `${MINE}/Account` // 我的账户
export const ACCOUNTRECHARGE = `${ACCOUNT}/recharge` // 我的账户》充值
export const ACCOUNTWITHDRAWCASH = `${ACCOUNT}/withdrawCash` // 我的账户》提现
export const SUCCESSPAGE = `${ACCOUNT}/successPage` // 支付成功页面
export const FAILPAGE = `${ACCOUNT}/failPage` // 支付失败页面
export const ACCOUNTDETAIL = `${ACCOUNT}/detail` // 我的账户》账户详细

export const COMPANYAUTH = `${MINE}/companyAuth` // 企业认证
export const INVOICEMANGE = `${MINE}/invoiceMange` // 发票管理
export const APPLYINVOICE = `${MINE}/invoiceMange/applyInvoice` // 申请发票
export const CONTRACTMANGE = `${MINE}/contractMange` // 合同管理
export const PROJECTMANGE = `${MINE}/projectMange` // 项目管理
export const CREATEPROJECT = `${MINE}/projectMange/createProject` // 创建项目
export const BALANCEMANGE = `${MINE}/projectMange/balanceMange` // 结算管理
export const BALANCEDETAIL = `${MINE}/projectMange/balanceMange/balanceDetail` // 结算详情
export const ENGINREALITY = `${MINE}/enginReality` // 工程实况
export const LEAVESITU = `${MINE}/enginReality/leaveSitu` // 请假情况
export const PARTNER = `${MINE}/partner` // 合作方管理
export const ADDPARTNER = `${MINE}/partner/addPartner` // 添加合作方
export const PERSONSTRUCTURE = `${MINE}/personStructure` // 组织架构
export const ORGANTSTRUCT = `${MINE}/personStructure/organtStruct` // 组织架构列表
export const PERSONSTRUCT = `${MINE}/personStructure/personStruct` // 人员列表
export const PERSONDETAIL = `${MINE}/personStructure/personDetail` // 人员详情
export const ADDPERSON = `${MINE}/personStructure/addPerson` // 添加人员
export const ADDDEPARTMENT = `${MINE}/personStructure/addDepartment` // 添加部门
export const FEEDBACK = `${MINE}/feedBack` // 问题反馈

export const LOGIN = `${BASE_URL}/Login/login` // 登录
export const REGISTER = `${BASE_URL}/Login/register` // 注册
export const FORGETPWD = `${BASE_URL}/Login/forgetPwd` // 忘记密码
export const RESETPWD = `${BASE_URL}/Login/resetPwd` // 重置密码

export const SYSNOTICE = `${BASE_URL}/Message/sysNotice` // 系统通知
export const CHATBOX = `${BASE_URL}/Message/chatBox` // 聊天框
export const USERINFO = `${BASE_URL}/Message/userInfo` // 用户信息

