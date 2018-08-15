
## 技术栈
- [router4.0](https://reacttraining.com/react-router/) 使用的react-router 4.0
- [precss](https://github.com/jonathantneal/precss) 封装成sass语法的postcss集合插件
[eslint规则](http://git.jc/app-h5/docs/blob/master/frontend/.eslintrc.js)
[stylelint规则](http://git.jc/app-h5/docs/blob/master/frontend/.stylelintrc)
- [postcss-pxtorem](https://www.npmjs.com/package/postcss-pxtorem) pxtorem 自定义样式（不包括内联样式）和组件样式的px转化成rem
- [Ant Design Mobile of React](https://mobile.ant.design/) Ant Design Mobile 的 React 实现WebApp开发
- [Icon 编辑工具](http://www.iconfont.cn/) 阿里的矢量图标管理，将图标上传到Iconfont平台，可以自定义下载多种格式的icon，平台也可将图标转换为字体，便于前端自由调整与调用，而本项目是使用的Symbol模式。
- [rc-upload 上传文件模块](https://github.com/react-component/upload) 将信息（网页、文字、图片、视频等）通过网页或者上传工具发布到远程服务器上的过程。
当需要上传一个或一些文件时;当需要展现上传的进度时;图片上传可采用antd-Mobile自带的图片上传模块；

## 布局
1、设计稿标准尺寸：750*1334

2、基于pxtorem，需要适配组件内部的样式，开发页面时候需要对设计稿进行等比例缩放1/2，也就是以尺寸375*667直接进行开发，这样缩放后的设计稿尺寸是多少px，布局时候就直接写多少px就OK了

3、所有的样式不建议写内联样式，尤其是涉及到px的样式属性

4、border的1px可以写成1Px，这样就不会被转化成rem了

5、兼容各个主流机型，已适配iPhoneX

## 路由

### 路由书写简单规范
- 主要是以JSON数组格式进行配置，添加模块后只需要添加想要的路由配置即可
- 基于父组件的路由需要配置父组件的名称（parent）且为字符串类型，没有则设parent为null
- 路由配置文件入口：Contants/Router/routerConf.js

Example：
```javascript
const routes = [
  {
    path: '/',
    exact: true,
    component: Home,
    parent: null,
    showMenu: true,
    animated: false,
    title: '找工作'
  },
  {
    path: urls.HOME,
    exact: true,
    component: Home,
    parent: null,
    showMenu: true,
    animated: false,
    title: '找工作'
  }, {
    path: urls.TOBEDONE,
    exact: true,
    component: TobeDone,
    parent: null,
    animated: false,
    showMenu: true,
    title: '待办'
  }, {
    path: urls.PUSHORDER,
    exact: true,
    component: PushOrder,
    parent: null,
    showMenu: true,
    animated: true,
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
    path: urls.MYWORKLIST,
    exact: true,
    component: MyWorkList,
    parent: 'Mine',
    animated: true,
    showMenu: false,
    title: '我的工单'
  }, {
    path: urls.AUTHENTICATE,
    exact: true,
    component: Authenticate,
    parent: true,
    animated: true,
    showMenu: true,
    title: '资格认证'
  },
  ...
]
```
**配置参数**
 ```javascript
path: 路由路径
exact: 路由是否精确匹配
component: 路由对应的组件
parent：父组件
showMenu: 是否显示footer的菜单
animated: 是否有动画（注意：批量设置主菜单的动画不在这里设置，也就是TabBar组件，需要手动写css动画给antdMobile的 am-tabs-pane-wrap 样式，可以单独设置菜单的动画，如发布工单模块，需要在layout.js和menu里面配置相应的路由路径）
title: 标题
```
## Icon使用说明
Example：
```javascript
import NewIcon from 'Components/NewIcon'
<NewIcon type='home' onClick={this.onClick} className='homeBtn'  />
```
**配置参数**
```
type: IconFont的类名
onClick：点击事件回调函数
className：自定义icon的样式类名
```
## APP头部配置
Example:
```javascript
import Header from 'Components/Header'
<Header
  title='首页'
  leftIcon='icon-back'
  rightIcon=''
  rightTitle=''
/>
```
**配置参数**
```
title: 标题
titleClick: 标题点击事件回调函数
leftIcon: 左侧的Icon
leftTitle1: 左侧第一个标题
leftClick1: 左侧Icon和第一个标题公用的点击事件回调函数
leftTitle2: 左侧第二个标题
leftClick2: 左侧第二个标题的点击事件回调函数
rightIcon: 右侧Icon（可与rightTitle并存）
rightTitle: 右侧标题（可与rightIcon并存）
rightClick: 右侧区域的点击事件回调函数
noLine: 是否有下边线（默认true，有下边线）

/* 搜索框相关 */
onSearch: 搜索回调
searchTitle: 搜索框默认提示文字
cancelText: 搜索框定制“取消”按钮的文字
onSearchFocus: 搜索框focus 事件的回调
onSearchCancel: 搜索框点击取消按钮触发 (不再自动清除输入框的文字)
onSearchSubmit: 搜索框submit事件 (点击键盘的 enter)
```
## APP底部菜单配置
- 基于antdMobile的tabBar，配置APP的footer部分菜单（路由、样式、名称）
- 以JSON数组格式进行配置，菜单顺序就是配置文件的顺序
- 菜单的key需要与对应路由的模块同名，且为字符串
- 菜单配置文件入口：Components/Menus/index.js

Example：
```javascript
const data = [
  {
    path: urls.HOME,
    key: 'Home',
    icon: '#icon-home',
    onIcon: '#icon-home-on',
    title: '首页'
  }, {
    path: urls.MESSAGE,
    key: 'Message',
    icon: '#icon-xiaoxi',
    onIcon: '#icon-xiaoxi-on',
    title: '消息'
  }, {
    path: urls.WORKPLAT,
    key: 'Workplat',
    icon: '#icon-gongzuo',
    onIcon: '#icon-gongzuo-on',
    title: '工作台'
  }, {
    path: urls.CONTACT,
    key: 'Contact',
    icon: '#icon-tongxunlu',
    onIcon: '#icon-tongxunlu-on',
    title: '通讯录'
  }, {
    path: urls.MINE,
    key: 'Mine',
    icon: '#icon-wode',
    onIcon: '#icon-wode-on',
    title: '我的'
  }
]
```
**配置参数**
```javascript
path: 路由地址,
key: 每项菜单必须配的key
icon: 默认时候的icon
onIcon: 被选中状态时候的icon
title: 菜单名称
```
## 上拉刷新组件RefreshList
Example
```javascript
// 引入方法
import { RefreshList } from 'Components'
....
async genData(status, value) { // 父页面数据接口
   const data = await api.getData() || {}
   return data.data || [] // 返回值必须是Json数组
}
render() {
const separator = (sectionID, rowID) => (
    <div
      key={`${sectionID}-${rowID}`}
      style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',
      }}
    />)
const row = (rowData, sectionID, rowID) => {
      return (<div key={rowID}>
        {rowData.title}
        </div>)
    }
<RefreshList row={row} separator={separator} genData={this.genData}/>
}
...
```
**配置类名**
```javascript
row: 内容模块函数
separator：内容模块间隔模块函数（非必传，默认为Example配置）
getData：上拉下拉回调函数（第一个参数为'0'为上拉，'1'为下拉，第二个参数为下拉返回上一次数据数组最后一个数据对象）
```

## 页面模块配置说明
1、如果需要Header直接引入import { Header, Content } from 'Components' 里面的Header既可

2、每个页面都必须包括Content组件，子组件的所有布局都需要写在里面，如果没有头部，则需要在Content组件上配置，如: ```<Content isHeader={false}></Content>```,有头部可以不配置

3、页面最外层的div需要设置固定class，分别是：contentBox（有菜单情况下使用） 或 pageBox（单页面无菜单情况使用，比如登录注册页）
Example：
```javascript
class TobeDone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: '2018 5月'
    }
  }
  detail = () => {
    console.log('详情')
  }
  render() {
    const { date } = this.state
    return <div className='contentBox'>
      <Header leftTitle2={date} rightTitle='查看详情' rightClick={this.detail}/>
      <Content>
        你的页面代码.....
      </Content>
    </div>
  }
}
```
## 1px移动端细线解决方案
在有1px的元素上直接添加对应class，此class是全局类名（无需独立引用），如果不满足可自行扩展，注意：这个class名不需要经过webpack的编码

Example：
```javascript
<ul className={style['file-list']}>
  {
    fileList.map((item, index, ary) => {
      return (
        <li key={index} className='my-bottom-border'><a>{item.name}</a></li>
      )
    })
  }
</ul>
```

**配置类名**
```javascript
.my-left-border // 左边细线
.my-right-border // 右边细线
.my-top-border // 头部细线
.my-bottom-border // 底部细线
.my-full-border // 全部细线

```

## 数据请求
### 说明
1、已经对axios进行了二次封装在Util/fetch.js，在此文件内可以添加相关的请求头部、请求拦截器、请求的跳转等操作

2、目前只封装了POST请求，如需要封装更多请求方式可根据需求进行进一步封装

3、所有的请求接口都是在Util/api.js内完成，请求完的数据响应在组件内体现和操作，与此同时api.js也封装了2个常用的操作：Fetch（用于请求数据的拉取，主要用于查询）、FetchSave(用于请求数据的保存类的操作，主要用于新增、修改、删除等)

### 实际应用
例如请求菜单数据

1、配置api.js
```javascript
export default {
  getMenu(param = {}) {
    return Fetch('/Sso/findMenuList', param)
  }
}
```
2、组件内使用请求到的数据，需要注意的是，async需要和await配合起来使用才可以
```javascript
async componentWillMount() {
  const data = await api.getMenu({ timestamp: (new Date()).getTime() }) || []
  if (data) {
    this.setState({
      data
    })
  }
}
```
## 引用常用资源

### 引用说明

现在在webpack配置了alias方便引用资源，举个例子当你在某个视图组件中需要引用公共组件；不管你与那个组件的相对路径是怎样的，可以直接`import AddButton from 'Components/AddButton'`

目前可以这样引用的有：

- Src: 对应src目录
- Util: 对应'src/utils/'
- Components: 对应'src/components/',
- Asserts: 对应'src/asserts/',
- Contants: 对应'src/contants/'

### 资源文件说明
- Components/Menus/index.js: 菜单配置文件
- Contants/urls.js: 路由地址
- Contants/Router/index.js: 路由入口文件
- Util/index.js: 环境地址配置
- Util/api.js: 接口地址
- Util/fetch.js: 公用请求接口方法
- Util/history.js: createBrowserHistory方法
- Util/storage.js: 对本地存储的操作方法

## 脚本
### 运行
```javascript
cd yaqueApp-wugong
yarn（或者npm install）
npm start
```
### 发布
```javascript
npm run build:test
npm run build:pre
npm run build
npm run upload // 上传服务器
```
