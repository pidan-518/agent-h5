import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './detaInfo.less'
import set from '../../static/examPart/set/set.png'
import {CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty'
export default class detaInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: {},
      //下级数列表项
      list: {
        agentUserVOList: []
      },
    }
  }
  componentWillMount() {
  }
  componentDidMount() { }
 
  componentWillUnmount() { }

  componentDidShow() { 
    //路由携带数据
    const userId = this.$router.params
    userId.userId= parseInt(userId.userId)
    this.postList(userId)
    this.setState({ userId: this.$router.params })
    console.log(userId)
  }

  componentDidHide() { }
  //跳转设置页
  gotodata = () => {
    Taro.navigateTo({
      url: `/admin/set/set?userId=${this.state.userId.userId}`
    })
  }
  postList = (userId) => {
    CarryTokenRequest(apiUrl.selectAgentUserDetail,
      { userId: userId.userId})
      .then(response => {
        console.log(response.data.data)
        this.setState({ list: response.data.data });
      })
  }
  config = {
    navigationBarTitleText: '详细信息'
  }
  render() {
    const { list } = this.state;
    return (
      <View className='detainfo'>
        <View className='upper'>
          <View className='headPor'>
            <Image className='image' src={(list.avatar || '')} alt="头像" />
            <Text className='shopowner'>{list.levelName}</Text>
            <img className='set' src={set} alt="" onClick={this.gotodata} />
          </View>
          <View className='massage'>
            <View className='upperLeft'>
              <Text>昵称：{list.userName}</Text>
              <Text>姓名：{list.realName}</Text>
              <Text>手机号码：{list.phonenumber}</Text>
              <Text>注册时间：{(list.createTime || '').split(' ')[0]}</Text>
              <Text>升级时间：{(list.degradationDate || '').split(' ')[0]}</Text>
              <Text>地区：{(list.region || '').split(':').join('')}</Text>
            </View>
            <View className='upperRight'>
              <Text>佣金总额：{list.totalCommission}</Text>
              <Text>佣金余额：{list.balanceCommission}</Text>
              <Text>冻结金额：{list.frozenAmount}</Text>
              <Text>提现总额：{list.withdrawalAmount}</Text>
              <Text>订单总额：{list.totalOrderCommission}</Text>
              <Text>订单数: {list.numsOrders}</Text>
            </View>
          </View>
        </View>
        <View className='lower'>
          <View className='lowerHead'>
            <Text>一级下级数：{list.firstSubordinateNums}</Text>
            <Text>二级下级数：{list.secondSubordinateNums}</Text>
          </View>
          {(list.agentUserVOList || []).length != 0 ?
            list.agentUserVOList.map(item => (
              <View className='conItem'>
                <View className='itemLeft'>
                  <View className='avatar'>
                     <img src={item.avatar} alt="" />
                    <p>{item.levelName}</p>
                  </View>
                  <View className='info'>
                    <p>昵称: {item.userName}</p>
                    <p>姓名:{item.realName}</p>
                    <p>注册时间：{(item.createTime || '').split(' ')[0]}</p>
                    <p>升级时间：{(item.degradationDate || '').split(' ')[0]}</p>
                  </View>
                </View>
              </View>
            ))
            :<CommonEmpty/> 
            }
        </View>
      </View>
    )
  }
}