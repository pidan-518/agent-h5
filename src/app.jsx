import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import './app.less'

// 导入taro-ui的样式文件
import 'taro-ui/dist/style/index.scss'
// import VConsole from 'vconsole';

// let vConsole = new VConsole 

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  componentDidMount () {
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config = {
    pages: [
      'page/login/login', // 登录 -- li

      // 代理人界面
      'agent/consumeregister/consumeregister', // 消费者注册页 -- wq √
      'agent/consume/consume', // 消费者列表页 -- wq √
      'agent/register/register', // 代理人注册页 -- wq √
      'agent/index/index', // 代理人首页 -- wq √
      'agent/setting/setting', // 代理人信息设置 -- wq √
      'agent/withdrawal/withdrawal', // 代理人提现申请 -- wq √
      'agent/lecturer/lecturer', // 代理人预约讲师列表 -- wq √
      'agent/lecturerdetail/lecturerdetail', // 代理人预约讲师详情 -- wq √
      'agent/message/message', // 代理人消息（管理员系统消息） -- wq √
      'agent/income/income', // 代理人收益列表 -- wq √
      'agent/incomedetail/incomedetail', // (new)代理人收益详情 -- wq √
      'agent/share/share', // 代理人平台分享 -- wq √
      'agent/sharedetail/sharedetail', // 代理人分享详情 -- wq √
      'agent/invitation/invitation', // 代理人达人邀请 -- wq √
      'agent/calendar/calendar', // 代理人预约讲师选择时间 -- wq √
      'agent/reserve/reserve', // 代理人预约记录列表 -- wq √
      'agent/reservedetail/reservedetail', // 代理人预约记录详情 -- wq √
      'agent/orderlist/orderlist', // 代理人 -> 订单排行页面 -- cyl
      'agent/team/team',  // 代理人 -> 成员信息页面 -- cyl
      'agent/investmentposter/investmentposter',//招商海报 --kzh
      'agent/promotionposter/promotionposter',//推广海报 --kzh
      'agent/newuser/newuser',  // 代理人 -> 新人奖金收益页面 -- cyl
      'agent/newuserdetail/newuserdetail',  //代理人 -> 新人奖金收益明细页面 -- cyl

      // 管理员界面
      'admin/lecturer/lecturer', // 讲师首页 -- li
      'admin/reservelist/reservelist', // 课程预约列表 -- li
      'admin/reservedetails/reservedetails', // 课程预约详情 -- li
      'admin/addlecturer/addlecturer', // 添加讲师信息 -- li
      'admin/changelecturer/changelecturer', // 修改讲师信息 -- li
      'admin/lectureradmin/lectureradmin', // 讲师管理 -- li
      'admin/lecturerlist/lecturerlist', // 讲师列表 -- li
      'admin/lecturerdetails/lecturerdetails', // 讲师详情 -- li
      'admin/demote/demote', // 管理员降级审核（暂不降级）列表 -- wq
      'admin/demotedetail/demotedetail', // 管理员降级审核（暂不降级）详情 -- wq
      'admin/index/index', // 管理员首页 -- kzh
      'admin/agentinfo/agentinfo', // 代理人信息 -- kzh
      'admin/detaInfo/detaInfo', // 代理人详细信息 -- kzh
      'admin/set/set', // 代理人详细信息设置页-- kzh
      'admin/adddownreason/adddownreason', // 职员管理添加降级原因 -- kzh
      'admin/staffmanage/staffmanage', // 职员管理 -- kzh
      'admin/agentsetting/agentsetting', // 职员管理基础设置 -- kzh
      'admin/reasondegradation/reasondegradation', // 职员管理降级原因设置 -- kzh
      'admin/addadministrator/addadministrator', // 管理权限 -- kzh
      'admin/examiner/examiner', // 审核列表 -- kzh
      'admin/examinedetail/examinedetail', // 审核详情 -- kzh
      'admin/historydetail/historydetail', // 审核历史记录详情 -- kzh
      'admin/addadministrator/addadministrator', // 管理权限 - kzh
      'admin/install/install', // 管理员 -> 代理人设置页面 -- cyl
      'admin/installProxy/installProxy', // 管理员 -> 代理设置页面 -- cyl
      'admin/permissions/permissions', // 管理员 -> 管理权限页面 -- cyl
      'admin/financialstatement/financialstatement', // 财务 -- dzk
      'admin/financialrecord/financialrecord', // 提现记录 -- dzk
      'admin/recorddetail/recorddetail', // 提现详情 -- dzk
      'admin/cash/cash', // 提现申请 -- dzk
      'admin/agentmanage/agentmanage', // 代理人管理 -- dzk
      'admin/basesetting/basesetting', // 基础设置 -- dzk
      'admin/watchlevelequity/watchlevelequity', // 查看等级权益 -- dzk
      'admin/changelevelequity/changelevelequity', // 修改等级权益 -- dzk
      'admin/addequity/addequity', // 添加等级权益 -- dzk
      'admin/changeequity/changeequity',// 修改等级权益详情 -- dzk
      'admin/adminaddagent/adminaddagent',// 添加代理人页面 -- dzk
      'admin/addagent/addagent', // 添加代理人详情 -- dzk
      'admin/updateagent/updateagent', // 修改代理人详情 -- dzk
      'admin/marketing/marketing',//营销上传海报页面 --kzh--
      
    ],

    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
