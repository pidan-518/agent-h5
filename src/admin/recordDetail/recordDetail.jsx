/* File Info 
 * Author:      your name 
 * CreateTime:  2020/8/5 下午3:58:07 
 * LastEditor:  your name 
 * ModifyTime:  2020/12/10 下午4:30:25 
 * Description: 提现详情
*/ 
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './recorddetail.less'

// 引入接口
import servicePath from '../../common/util/api/apiUrl'
import { CarryTokenRequest } from '../../common/util/request'

// 提现--详细信息
export default class Index extends Component {
  constructor(props) {
    super(props)
    // 发送 提现记录详情 请求
    const id = this.$router.params.id
    const withdrawId = this.$router.params.withdrawId
    CarryTokenRequest(servicePath.getRecordDetail, { id: id })
      .then(res => {
        console.log(res)
        this.setState({
          detail: res.data.data,
        })
      })
      .catch(err => {
        console.log(err)
      })

    // 请求银行数据
    CarryTokenRequest(servicePath.getBankList, { current: 1, len: 10 })
      .then(res => {
        const bankList = res.data.data.map(item => {
          return item.name
        })
        // console.log(bankList)
        this.setState({
          bankList: bankList,
        })
      })
      .catch(err => {
        console.log(err)
      })

    this.state = {
      detail: {},
      bankList: [{}],
    }
  }

  config = {
    navigationBarTitleText: '详细信息',
  }

  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps, nextContext) {}
  componentWillUnmount() {}
  componentDidShow() {}
  componentDidHide() {}
  componentDidCatchError() {}
  componentDidNotFound() {}

  render() {
    const data = this.state.detail

    return (
      <View id="recordDetail">
        {/* 内容区域 */}
        <View id="content">
          {/* 头像头衔 */}
          <View className="avatars">
            <Image src={data.headImage} className="avatar"></Image>
            <View className="rank">{data.agentLevelName}</View>
          </View>
          {/* 详细信息 */}
          <View className="Information-list">
            <p>昵称：{data.nickName}</p>
            <p>姓名：{data.realName}</p>
            <p>手机号码：{data.mobile}</p>
            <p>会员ID：{data.agentId}</p>
            <p>申请时间：{data.applicationTime}</p>
            <p>申请金额（元）：{data.amount}</p>
            <p>账号类型：{data.accountType === 0 ? '银行卡' : '支付宝'}</p>
            <p>收款账号：{data.payeeAccount}</p>
            <p>
              开户行：{this.state.bankList[data.bank - 1]}
            </p>
            <p>收款人：{data.payee}</p>
            <p>是否通过：{data.state===1 ? '是' : '否'}</p>
            <p>
              {data.state === 1 ? '通过' : '驳回'}时间：{data.createTime}
            </p>
            {/* 缺少通过/驳回时间？？ */}
            {data.state === 1 ? (
              <p>提现金额（元）：{data.amount}</p>
            ) : (
              <p>驳回原因：{data.reason}</p>
            )}
            <p>提现备注：{data.remark}</p>
          </View>
        </View>
      </View>
    )
  }
}
