/*
* @Author: chengbs
* @Date:   2018-05-22 14:13:58
* @Last Modified by:   baosheng
* @Last Modified time: 2018-08-14 22:02:16
*/
import React from 'react'
import { Icon } from 'antd-mobile'
import * as urls from 'Contants/urls'
import Loadable from 'react-loadable'

function MyLoadingComponent({ error, pastDelay }) {
  if (error) {
    return <div style={{ width: '100%', height: '400px', lineHeight: '400px', textAlign: 'center' }}>网络异常，请重新加载！</div>
  } else if (pastDelay) {
    return <div style={{ width: '100%', height: '400px', lineHeight: '400px', textAlign: 'center' }}><Icon type='loading' size='lg' /></div>
  } else {
    return null
  }
}
const Home = Loadable({ // 首页
  loader: () => import(/* webpackChunkName: "home" */ '../models/Home'),
  loading: MyLoadingComponent
})
const SystemMessDetail = Loadable({ // 系统消息详情
  loader: () => import(/* webpackChunkName: "systemessage" */ '../models/Home/SystemMessDetail'),
  loading: MyLoadingComponent
})
const Message = Loadable({ // 消息
  loader: () => import(/* webpackChunkName: "message" */ '../models/Message'),
  loading: MyLoadingComponent
})
const WorkListManage = Loadable({ // 工单列表
  loader: () => import(/* webpackChunkName: "worklistmanage" */ '../models/WorkListManage'),
  loading: MyLoadingComponent
})

const PushNormalOrder = Loadable({ // 发布普通工单
  loader: () => import(/* webpackChunkName: "pushnormalorder" */ '../models/PushOrder/pushNormalOrder'),
  loading: MyLoadingComponent
})
const PushQuickOrder = Loadable({ // 发布快单
  loader: () => import(/* webpackChunkName: "pushquickorder" */ '../models/PushWorkOrder/quickOrder'),
  loading: MyLoadingComponent
})
const SelectClassify = Loadable({
  loader: () => import(/* webpackChunkName: "SelectClassify" */ '../models/PushWorkOrder/quickOrder/classify'),
  loading: MyLoadingComponent
})
const ClassifyList = Loadable({
  loader: () => import(/* webpackChunkName: "ClassifyList" */ '../models/PushWorkOrder/quickOrder/classifyList'),
  loading: MyLoadingComponent
})
const PushQuickOrderForm = Loadable({
  loader: () => import(/* webpackChunkName: "PushQuickOrderForm" */ '../models/PushWorkOrder/quickOrder/formBox'),
  loading: MyLoadingComponent
})
const PushBidOrder = Loadable({ // 发布招标
  loader: () => import(/* webpackChunkName: "pushbidorder" */ '../models/PushOrder/pushBidOrder'),
  loading: MyLoadingComponent
})

const WorkListDetail = Loadable({ // 工单详情
  loader: () => import(/* webpackChunkName: "worklistdetail" */ '../models/WorkListManage/worklistDetail'),
  loading: MyLoadingComponent
})
const AccessRecord = Loadable({ // 接单记录
  loader: () => import(/* webpackChunkName: "accessrecord" */ '../models/WorkListManage/accessRecord'),
  loading: MyLoadingComponent
})
const SettleRecord = Loadable({ // 结算记录
  loader: () => import(/* webpackChunkName: "settlerecord" */ '../models/WorkListManage/settleRecord'),
  loading: MyLoadingComponent
})
const AttendRecord = Loadable({ // 考勤记录
  loader: () => import(/* webpackChunkName: "attendrecord" */ '../models/WorkListManage/attendRecord'),
  loading: MyLoadingComponent
})
const SendStartWorkRecord = Loadable({ // 开工记录 我发的
  loader: () => import(/* webpackChunkName: "sendStartWorkRecord" */ '../models/WorkListManage/sendStartWorkRecord'),
  loading: MyLoadingComponent
})
const OrderStartWorkRecord = Loadable({ // 开工记录 我接的
  loader: () => import(/* webpackChunkName: "orderStartWorkRecord" */ '../models/WorkListManage/orderStartWorkRecord'),
  loading: MyLoadingComponent
})
const AttendDetail = Loadable({ // 考勤详情
  loader: () => import(/* webpackChunkName: "attenddetail" */ '../models/WorkListManage/attendRecord/detail'),
  loading: MyLoadingComponent
})

const Mine = Loadable({ // 我的
  loader: () => import(/* webpackChunkName: "mine" */ '../models/Mine'),
  loading: MyLoadingComponent
})
const SetUp = Loadable({ // 我的设置
  loader: () => import(/* webpackChunkName: "setup" */ '../models/Mine/SetUp'),
  loading: MyLoadingComponent
})
const SetUpPayPwd = Loadable({ // 设置支付密码
  loader: () => import(/* webpackChunkName: "setuppaypwd" */ '../models/Mine/SetUp/setPayPwd'),
  loading: MyLoadingComponent
})
const SetUpSecurity = Loadable({ // 我的设置》账户与安全
  loader: () => import(/* webpackChunkName: "setupsecurity" */ '../models/Mine/SetUp/security'),
  loading: MyLoadingComponent
})
const SetUpAboutUs = Loadable({ // 我的设置》关于我们
  loader: () => import(/* webpackChunkName: "setupaboutus" */ '../models/Mine/SetUp/aboutAs'),
  loading: MyLoadingComponent
})
const SetUpIntrduce = Loadable({ // 我的设置》关于我们》功能介绍
  loader: () => import(/* webpackChunkName: "setupintroduce" */ '../models/Mine/SetUp/introduce'),
  loading: MyLoadingComponent
})
const SetUpIntrduceInfo = Loadable({ // 我的设置》关于我们》功能介绍》详情
  loader: () => import(/* webpackChunkName: "setupintroduceinfo" */ '../models/Mine/SetUp/introduce/detail'),
  loading: MyLoadingComponent
})
const MyPush = Loadable({ // 我的发布
  loader: () => import(/* webpackChunkName: "mypush" */ '../models/Mine/myPush'),
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
const BankCard = Loadable({ // 绑定银行卡
  loader: () => import(/* webpackChunkName: "bankcard" */ '../models/Mine/Account/bankCard'),
  loading: MyLoadingComponent
})
const AccountRecharge = Loadable({ // 我的账户》充值
  loader: () => import(/* webpackChunkName: "accountrecharge" */ '../models/Mine/Account/recharge'),
  loading: MyLoadingComponent
})
const SuccessPage = Loadable({ // 成功页面
  loader: () => import(/* webpackChunkName: "successpage" */ '../models/Mine/Account/successPage'),
  loading: MyLoadingComponent
})
const FailPage = Loadable({ // 失败页面
  loader: () => import(/* webpackChunkName: "failpage" */ '../models/Mine/Account/failPage'),
  loading: MyLoadingComponent
})
const AccountWithdrawCash = Loadable({ // 我的账户》提现
  loader: () => import(/* webpackChunkName: "accountwithdrawcash" */ '../models/Mine/Account/withdrawCash'),
  loading: MyLoadingComponent
})
const CompanyAuth = Loadable({ // 企业认证
  loader: () => import(/* webpackChunkName: "companyauth" */ '../models/Mine/companyAuth'),
  loading: MyLoadingComponent
})
const RealNameAuth = Loadable({ // 个人认证
  loader: () => import(/* webpackChunkName: "realnameauth" */ '../models/Mine/realNameAuth/'),
  loading: MyLoadingComponent
})
const RealNameAuthDetail = Loadable({ // 个人认证详情
  loader: () => import(/* webpackChunkName: "realnameauthdetail" */ '../models/Mine/realNameDetail'),
  loading: MyLoadingComponent
})
const CompanyAuthDetail = Loadable({ // 企业认证详情
  loader: () => import(/* webpackChunkName: "companyauthdetail" */ '../models/Mine/companyAuthDetail'),
  loading: MyLoadingComponent
})
const InvoiceMange = Loadable({ // 发票管理
  loader: () => import(/* webpackChunkName: "invoicemange" */ '../models/Mine/invoiceMange'),
  loading: MyLoadingComponent
})
const InvoiceListOne = Loadable({ // 代收发票管理
  loader: () => import(/* webpackChunkName: "invoicemange" */ '../models/Mine/invoiceMange/invoiceListOne'),
  loading: MyLoadingComponent
})
const InvoiceListTwo = Loadable({ // 代开发票管理
  loader: () => import(/* webpackChunkName: "invoicemange" */ '../models/Mine/invoiceMange/invoiceListTwo'),
  loading: MyLoadingComponent
})
const InvoiceDetail = Loadable({ // 代开发票详情
  loader: () => import(/* webpackChunkName: "invoicemange" */ '../models/Mine/invoiceMange/invoiceListTwo/invoiceDetail'),
  loading: MyLoadingComponent
})
const ApplyInvoice = Loadable({ // 申请发票
  loader: () => import(/* webpackChunkName: "applyinvoice" */ '../models/Mine/invoiceMange/applyInvoice'),
  loading: MyLoadingComponent
})
const ContractMange = Loadable({ // 合同管理
  loader: () => import(/* webpackChunkName: "contractmange" */ '../models/Mine/contractMange'),
  loading: MyLoadingComponent
})
const EletAgreement = Loadable({ // 电子合同
  loader: () => import(/* webpackChunkName: "eletagreement" */ '../models/Mine/contractMange/eletAgreement'),
  loading: MyLoadingComponent
})
const ProjectMange = Loadable({ // 项目管理
  loader: () => import(/* webpackChunkName: "projectmange" */ '../models/Mine/projectMange'),
  loading: MyLoadingComponent
})
const ProjectDetail = Loadable({ // 项目详情
  loader: () => import(/* webpackChunkName: "projectdetail" */ '../models/Mine/projectMange/projectDetail'),
  loading: MyLoadingComponent
})
const CreateProject = Loadable({ // 创建项目
  loader: () => import(/* webpackChunkName: "createproject" */ '../models/Mine/projectMange/createProject'),
  loading: MyLoadingComponent
})
const BalanceMange = Loadable({ // 结算管理
  loader: () => import(/* webpackChunkName: "balacemange" */ '../models/Mine/balanceMange'),
  loading: MyLoadingComponent
})
const BalanceDetail = Loadable({ // 结算详情
  loader: () => import(/* webpackChunkName: "balacedetail" */ '../models/Mine/balanceMange/balanceDetail'),
  loading: MyLoadingComponent
})
const EnginReality = Loadable({ // 工程实况
  loader: () => import(/* webpackChunkName: "enginreality" */ '../models/Mine/enginReality'),
  loading: MyLoadingComponent
})
const LeaveSitu = Loadable({ // 考勤情况
  loader: () => import(/* webpackChunkName: "leavesitu" */ '../models/Mine/enginReality/leaveSitu'),
  loading: MyLoadingComponent
})
const Partner = Loadable({ // 合作方
  loader: () => import(/* webpackChunkName: "partner" */ '../models/Mine/partner'),
  loading: MyLoadingComponent
})
const AddPartner = Loadable({ // 添加合作方
  loader: () => import(/* webpackChunkName: "addpartner" */ '../models/Mine/partner/addPartner'),
  loading: MyLoadingComponent
})
const PersonStructure = Loadable({ // 组织架构
  loader: () => import(/* webpackChunkName: "personstructure" */ '../models/Mine/personStructure'),
  loading: MyLoadingComponent
})
const OrgantStruct = Loadable({ // 组织架构列表
  loader: () => import(/* webpackChunkName: "organtstruct" */ '../models/Mine/personStructure/organtStruct'),
  loading: MyLoadingComponent
})
const PersonStruct = Loadable({ // 人员列表
  loader: () => import(/* webpackChunkName: "pesrsonstruct" */ '../models/Mine/personStructure/personStruct'),
  loading: MyLoadingComponent
})
const PersonDetail = Loadable({ // 人员详情
  loader: () => import(/* webpackChunkName: "pesrsondetail" */ '../models/Mine/personStructure/personDetail'),
  loading: MyLoadingComponent
})
const AddPerson = Loadable({ // 添加人员
  loader: () => import(/* webpackChunkName: "addperson" */ '../models/Mine/personStructure/addPerson'),
  loading: MyLoadingComponent
})
const EditPerson = Loadable({ // 修改人员
  loader: () => import(/* webpackChunkName: "editperson" */ '../models/Mine/personStructure/editPerson'),
  loading: MyLoadingComponent
})
const AddDepartment = Loadable({ // 添加部门
  loader: () => import(/* webpackChunkName: "adddepartment" */ '../models/Mine/personStructure/addDepartment'),
  loading: MyLoadingComponent
})
const EditDepartment = Loadable({ // 修改部门
  loader: () => import(/* webpackChunkName: "editdepartment" */ '../models/Mine/personStructure/editDepartment'),
  loading: MyLoadingComponent
})
const SelectDepart = Loadable({ // 选择部门
  loader: () => import(/* webpackChunkName: "selectdepart" */ '../models/Mine/personStructure/selectDepart'),
  loading: MyLoadingComponent
})
const FeedBack = Loadable({ // 问题反馈
  loader: () => import(/* webpackChunkName: "feedback" */ '../models/Mine/feedBack'),
  loading: MyLoadingComponent
})
const BankcardList = Loadable({ // 银行卡
  loader: () => import(/* webpackChunkName: "bankcardlist" */ '../models/Mine/bankcardList'),
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
const ShowInfoDetail = Loadable({
  loader: () => import(/* webpackChunkName: "showinfodetail" */ '../models/Message/showDetail'),
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
  },
  {
    path: urls.SYSTEMESSDETAIL,
    exact: true,
    component: SystemMessDetail,
    parent: Home,
    showMenu: true,
    animated: false,
    title: '系统'
  }, {
    path: urls.WORKLISTMANAGE,
    exact: true,
    component: WorkListManage,
    parent: null,
    animated: false,
    showMenu: true,
    title: '工单列表'
  }, {
    path: urls.PUSHNORMALORDER,
    exact: true,
    component: PushNormalOrder,
    parent: null,
    showMenu: false,
    animated: false,
    title: '发布工单'
  }, {
    path: urls.PUSHQUICKORDER,
    exact: true,
    component: PushQuickOrder,
    parent: null,
    showMenu: false,
    animated: false,
    title: '发布快单'
  }, {
    path: urls.SELECTCLASSIFY,
    exact: true,
    component: SelectClassify,
    parent: null,
    showMenu: false,
    animated: true,
    title: '选择分类'
  }, {
    path: urls.CLASSIFYLIST,
    exact: true,
    component: ClassifyList,
    parent: null,
    showMenu: false,
    animated: true,
    title: '分类列表'
  }, {
    path: urls.PUSHQUICKORDERFORM,
    exact: true,
    component: PushQuickOrderForm,
    parent: null,
    showMenu: false,
    animated: true,
    title: '发布工单'
  }, {
    path: urls.PUSHBIDORDER,
    exact: true,
    component: PushBidOrder,
    parent: null,
    showMenu: false,
    animated: false,
    title: '发布招标'
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
    path: urls.SETUP,
    exact: true,
    component: SetUp,
    parent: null,
    animated: true,
    showMenu: false,
    title: '我的设置'
  }, {
    path: urls.SETPAYPWD,
    exact: true,
    component: SetUpPayPwd,
    parent: null,
    animated: true,
    showMenu: false,
    title: '设置支付密码'
  }, {
    path: urls.SETUPSECURITY,
    exact: true,
    component: SetUpSecurity,
    parent: null,
    animated: true,
    showMenu: false,
    title: '账户与安全'
  }, {
    path: urls.SETUPABOUTUS,
    exact: true,
    component: SetUpAboutUs,
    parent: null,
    animated: true,
    showMenu: false,
    title: '关于我们'
  }, {
    path: urls.SETUPINTRODUCE,
    exact: true,
    component: SetUpIntrduce,
    parent: null,
    animated: true,
    showMenu: false,
    title: '功能介绍'
  }, {
    path: urls.SETUPINTRODUCEINFO,
    exact: true,
    component: SetUpIntrduceInfo,
    parent: null,
    animated: true,
    showMenu: false,
    title: '功能详情'
  }, {
    path: urls.WORKLISTDETAIL,
    exact: true,
    component: WorkListDetail,
    parent: null,
    showMenu: false,
    animated: true,
    title: '工单详情'
  }, {
    path: urls.ACCESSRECORD,
    exact: true,
    component: AccessRecord,
    parent: null,
    showMenu: false,
    animated: true,
    title: '接单记录'
  }, {
    path: urls.SETTLERECORD,
    exact: true,
    component: SettleRecord,
    parent: null,
    showMenu: false,
    animated: true,
    title: '结算记录'
  }, {
    path: urls.ATTENDRECORD,
    exact: true,
    component: AttendRecord,
    parent: null,
    showMenu: false,
    animated: true,
    title: '考勤记录'
  }, {
    path: urls.SENDSTARTWORKRECORD,
    exact: true,
    component: SendStartWorkRecord,
    parent: null,
    showMenu: false,
    animated: true,
    title: '开工记录'
  }, {
    path: urls.ORDERSTARTWORKRECORD,
    exact: true,
    component: OrderStartWorkRecord,
    parent: null,
    showMenu: false,
    animated: true,
    title: '开工记录'
  }, {
    path: urls.ATTENDDETAIL,
    exact: true,
    component: AttendDetail,
    parent: null,
    showMenu: false,
    animated: true,
    title: '考勤详情'
  }, {
    path: urls.MYPUSH,
    exact: true,
    component: MyPush,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '我的发布'
  }, {
    path: urls.ACCOUNT,
    exact: true,
    component: Account,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '我的账户'
  }, {
    path: urls.ACCOUNTDETAIL,
    exact: true,
    component: AccountDetail,
    parent: 'Account',
    animated: true,
    showMenu: false,
    title: '账户详情'
  }, {
    path: urls.BANKCARD,
    exact: true,
    component: BankCard,
    parent: 'Account',
    animated: true,
    showMenu: false,
    title: '绑定银行卡'
  }, {
    path: urls.ACCOUNTRECHARGE,
    exact: true,
    component: AccountRecharge,
    parent: 'Account',
    animated: true,
    showMenu: false,
    title: '充值'
  }, {
    path: urls.SUCCESSPAGE,
    exact: true,
    component: SuccessPage,
    parent: 'Account',
    animated: true,
    showMenu: false,
    title: '支付成功'
  }, {
    path: urls.FAILPAGE,
    exact: true,
    component: FailPage,
    parent: 'Account',
    animated: true,
    showMenu: false,
    title: '支付失败'
  }, {
    path: urls.ACCOUNTWITHDRAWCASH,
    exact: true,
    component: AccountWithdrawCash,
    parent: 'Account',
    animated: true,
    showMenu: false,
    title: '提现'
  }, {
    path: urls.COMPANYAUTH,
    exact: true,
    component: CompanyAuth,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '企业认证'
  }, {
    path: urls.REALNAMEAUTH,
    exact: true,
    component: RealNameAuth,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '个人认证'
  }, {
    path: urls.REALNAMEAUTHDETAIL,
    exact: true,
    component: RealNameAuthDetail,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '个人认证详情'
  }, {
    path: urls.COMPANYAUTHDETAIL,
    exact: true,
    component: CompanyAuthDetail,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '企业认证详情'
  }, {
    path: urls.INVOICEMANGE,
    exact: true,
    component: InvoiceMange,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '发票管理'
  }, {
    path: urls.INVOICELISTONE,
    exact: true,
    component: InvoiceListOne,
    parent: 'invoiceMange',
    animated: true,
    showMenu: false,
    title: '代收发票管理'
  }, {
    path: urls.INVOICELISTTWO,
    exact: true,
    component: InvoiceListTwo,
    parent: 'invoiceMange',
    animated: true,
    showMenu: false,
    title: '代开发票管理'
  },
  {
    path: urls.INVOICELISTTWODETAIL,
    exact: true,
    component: InvoiceDetail,
    parent: 'invoiceListTwo',
    animated: true,
    showMenu: false,
    title: '代开发票详情'
  },
  {
    path: urls.APPLYINVOICE,
    exact: true,
    component: ApplyInvoice,
    parent: 'InvoiceMange',
    animated: true,
    showMenu: false,
    title: '申请发票'
  }, {
    path: urls.CONTRACTMANGE,
    exact: true,
    component: ContractMange,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '合同管理'
  }, {
    path: urls.ELETAGREEMENT,
    exact: true,
    component: EletAgreement,
    parent: null,
    animated: true,
    showMenu: false,
    title: '电子合同'
  }, {
    path: urls.PROJECTMANGE,
    exact: true,
    component: ProjectMange,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '项目管理'
  }, {
    path: urls.PROJECTDETAIL,
    exact: true,
    component: ProjectDetail,
    parent: 'ProjectMange',
    animated: true,
    showMenu: false,
    title: '项目详情'
  }, {
    path: urls.CREATEPROJECT,
    exact: true,
    component: CreateProject,
    parent: 'ProjectMange',
    animated: true,
    showMenu: false,
    title: '创建项目'
  }, {
    path: urls.BALANCEMANGE,
    exact: true,
    component: BalanceMange,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '结算管理'
  }, {
    path: urls.BALANCEDETAIL,
    exact: true,
    component: BalanceDetail,
    parent: 'BalanceMange',
    animated: true,
    showMenu: false,
    title: '结算详情'
  }, {
    path: urls.ENGINREALITY,
    exact: true,
    component: EnginReality,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '工程实况'
  }, {
    path: urls.LEAVESITU,
    exact: true,
    component: LeaveSitu,
    parent: 'EnginReality',
    animated: true,
    showMenu: false,
    title: '请假情况'
  }, {
    path: urls.PARTNER,
    exact: true,
    component: Partner,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '合作方'
  }, {
    path: urls.ADDPARTNER,
    exact: true,
    component: AddPartner,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '添加合作方'
  }, {
    path: urls.PERSONSTRUCTURE,
    exact: true,
    component: PersonStructure,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '组织架构'
  }, {
    path: urls.ORGANTSTRUCT,
    exact: true,
    component: OrgantStruct,
    parent: 'PersonStructure',
    animated: true,
    showMenu: false,
    title: '组织架构列表'
  }, {
    path: urls.PERSONSTRUCT,
    exact: true,
    component: PersonStruct,
    parent: 'PersonStructure',
    animated: true,
    showMenu: false,
    title: '人员列表'
  }, {
    path: urls.PERSONDETAIL,
    exact: true,
    component: PersonDetail,
    parent: 'PersonStruct',
    animated: true,
    showMenu: false,
    title: '人员详情'
  }, {
    path: urls.ADDPERSON,
    exact: true,
    component: AddPerson,
    parent: 'PersonStructure',
    animated: true,
    showMenu: false,
    title: '添加人员'
  }, {
    path: urls.EDITPERSON,
    exact: true,
    component: EditPerson,
    parent: 'PersonStructure',
    animated: true,
    showMenu: false,
    title: '修改人员'
  }, {
    path: urls.ADDDEPARTMENT,
    exact: true,
    component: AddDepartment,
    parent: 'OrgantStruct',
    animated: true,
    showMenu: false,
    title: '添加部门'
  }, {
    path: urls.EDITDEPARTMENT,
    exact: true,
    component: EditDepartment,
    parent: 'OrgantStruct',
    animated: true,
    showMenu: false,
    title: '修改部门'
  }, {
    path: urls.SELECTDEPART,
    exact: true,
    component: SelectDepart,
    parent: 'OrgantStruct',
    animated: true,
    showMenu: false,
    title: '选择部门'
  }, {
    path: urls.FEEDBACK,
    exact: true,
    component: FeedBack,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '问题反馈'
  }, {
    path: urls.BANKCARDLIST,
    exact: true,
    component: BankcardList,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '银行卡'
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
  }, {
    path: urls.SHOWINFODETAIL,
    exact: true,
    component: ShowInfoDetail,
    parent: 'Message',
    showMenu: false,
    animated: false,
    title: '详情页'
  }
]

export default routes
