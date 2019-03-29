
/*
* @Author: baosheng
* @Date:   2018-04-02 22:21:55
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 21:59:09
*/
const BASE_URL = ``

export const HOME = `${BASE_URL}/Home`
export const SYSTEMESSDETAIL = `${HOME}/systemMessDetail` // 首页系统通知详情
export const MESSAGE = `${BASE_URL}/Message`
export const WORKLISTMANAGE = `${BASE_URL}/WorkListManage` // 工单列表

export const PUSHNORMALORDER = `${BASE_URL}/PushWorkOrder/normalOrder` // 发布普通工单
export const PUSHNORMALORDERFORM = `${PUSHNORMALORDER}/formBox` // 发布普通工单form
export const NLORDERRESULT = `${PUSHNORMALORDER}/result` // 普通工单结果详情
export const PUSHQUICKORDER = `${BASE_URL}/PushWorkOrder/quickOrder` // 发布快单
export const PUSHQUICKORDERFORM = `${PUSHQUICKORDER}/formBox` // 发布快单form
export const QKORDERRESULT = `${PUSHQUICKORDER}/result` // 快单结果详情
export const PUSHBIDORDER = `${BASE_URL}/PushWorkOrder/bidsOrder` // 发布招标
export const PUSHBIDSORDERFORM = `${PUSHBIDORDER}/formBox` // 发布招标form
export const BIDORDERRESULT = `${PUSHBIDORDER}/result` // 招标结果详情

// 工单
export const WORKLISTDETAIL = `${WORKLISTMANAGE}/worklistDetail` // 工单详情
export const ACCESSRECORD = `${WORKLISTMANAGE}/accessRecord` // 接单记录
export const SETTLERECORD = `${WORKLISTMANAGE}/settleRecord` // 结算记录
export const SETTLERECORDDETAIL = `${WORKLISTMANAGE}/applySettle` // 结算记录详情
export const ATTENDRECORD = `${WORKLISTMANAGE}/attendRecord` // 考勤记录
export const SENDSTARTWORKRECORD = `${WORKLISTMANAGE}/sendStartWorkRecord` // 开工记录 我发的
export const ATTENDDETAIL = `${WORKLISTMANAGE}/attendRecord/detail` // 考勤详情
// 我的
export const MINE = `${BASE_URL}/Mine`
export const MYORDER = `${MINE}/myorder` // 我的订单
export const ORDERLISTDETAIL = `${MYORDER}/worklistDetail` // 订单详情
export const OSETTLERECORD = `${MYORDER}/settleRecord` // 结算记录 我接的
export const OORDERSTARTWORKRECORD = `${MYORDER}/orderStartWorkRecord` // 开工记录 我接的
export const ORDERWORKERLIST = `${MYORDER}/workerList` // 工人列表
export const AGENTSTARTLIST = `${MYORDER}/agentStart` // 代开工列表
export const AGENTFINISHLIST = `${MYORDER}/agentFinish` // 代完工列表
export const OATTENDDETAIL = `${MYORDER}/attendRecord/detail` // 考勤详情
export const APPLYSETTLE = `${MYORDER}/applySettle` // 订单结算记录详情
export const SELECTWORKER = `${MYORDER}/selectWorker` // 选择工人
export const PENDINGSETTLERECORD = `${MYORDER}/pendingSettleRecord` // 待申请结算记录
export const SETUP = `${MINE}/SetUp` // 我的设置
export const SETPAYPWD = `${SETUP}/setPayPwd` // 设置支付密码
export const SETUPSECURITY = `${MINE}/security` // 我的设置》账户与安全
export const SETUPABOUTUS = `${MINE}/aboutUs` // 我的设置》关于我们
export const CLAUSE = `${SETUP}/clause` // 服务条款协议
export const ACCOUNT = `${MINE}/Account` // 我的账户
export const ACCOUNTRECHARGE = `${ACCOUNT}/recharge` // 我的账户》充值
export const ACCOUNTWITHDRAWCASH = `${ACCOUNT}/withdrawCash` // 我的账户》提现
export const SUCCESSPAGE = `${ACCOUNT}/successPage` // 支付成功页面
export const FAILPAGE = `${ACCOUNT}/failPage` // 支付失败页面
export const ACCOUNTDETAIL = `${ACCOUNT}/detail` // 我的账户》账户详细
export const BANKCARD = `${ACCOUNT}/bankCard` // 银行卡
export const CHECKSET = `${MINE}/CheckSet` // 考勤设置
export const CHECK = `${MINE}/Check` // 考勤管理
export const CHECKLIST = `${MINE}/Check/checkList` // 考勤列表

export const CERTIFICATION = `${MINE}/certification` // 认证管理
export const COMPANYAUTH = `${MINE}/companyAuth` // 企业认证
export const REALNAMEAUTH = `${MINE}/realNameAuth` // 个人认证
export const REALNAMEAUTHSUCCESS = `${REALNAMEAUTH}/success` // 个人认证成功
export const COMPANYAUTHDETAIL = `${MINE}/companyAuthDetail` // 企业认证详情
export const REALNAMEAUTHDETAIL = `${MINE}/realNameDetail` // 个人认证详情

export const INVOICENEWMANGE = `${MINE}/invoiceMange` // 新发票管理
export const INVOICEORDER = `${INVOICENEWMANGE}/order` // 工单开票
export const TITLEMANGE = `${INVOICENEWMANGE}/title` // 抬头管理
export const TITLEOPERATE = `${TITLEMANGE}/operate` // 抬头添加和编辑
export const ADDRESSMANGE = `${INVOICENEWMANGE}/address` // 地址管理
export const ADDRESSOPERATE = `${ADDRESSMANGE}/operate` // 地址添加和编辑
export const INVOICENEWDETAIL = `${INVOICENEWMANGE}/detail` // 新发票详情
export const APPLYINEWINVOICE = `${INVOICENEWMANGE}/applyInvoice` // 申请新发票

export const CONTRACTMANGE = `${MINE}/contractMange` // 合同管理
export const CONTRACTLIST = `${MINE}/contractList` // 我发的合同管理列表
export const ELETAGREEMENT = `${CONTRACTMANGE}/eletAgreement` // 电子合同
export const PROJECTMANGE = `${MINE}/projectMange` // 项目管理
export const PROJECTDETAIL = `${MINE}/projectMange/projectDetail` // 项目详情
export const CREATEPROJECT = `${MINE}/projectMange/createProject` // 创建项目
export const BALANCEMANGE = `${MINE}/balanceMange` // 结算管理
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
export const EDITPERSON = `${MINE}/personStructure/editPerson` // 修改人员
export const ADDDEPARTMENT = `${MINE}/personStructure/addDepartment` // 添加部门
export const EDITDEPARTMENT = `${MINE}/personStructure/editDepartment` // 修改部门
export const SELECTDEPART = `${MINE}/personStructure/selectDepart` // 选择部门
export const FEEDBACK = `${MINE}/feedBack` // 问题反馈
export const BANKCARDLIST = `${MINE}/bankcardList` // 银行卡
export const WORKERMANGE = `${MINE}/workList` // 工人管理
export const CREATEWORKER = `${WORKERMANGE}/createWorker` // 添加工人
export const CREATEWORKERSUCCESS = `${CREATEWORKER}/success` // 添加工人成功

export const LOGIN = `${BASE_URL}/Login/login` // 登录
export const REGISTER = `${BASE_URL}/Login/register` // 注册
export const FORGETPWD = `${BASE_URL}/Login/forgetPwd` // 忘记密码
export const RESETPWD = `${BASE_URL}/Login/resetPwd` // 重置密码

export const SYSNOTICE = `${BASE_URL}/Message/sysNotice` // 系统通知
export const CHATBOX = `${BASE_URL}/Message/chatBox` // 聊天框
export const USERINFO = `${BASE_URL}/Message/userInfo` // 用户信息
export const SHOWINFODETAIL = `${BASE_URL}/Message/showDetail` // 详情

