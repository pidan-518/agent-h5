import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './reservedetails.less'
import '../../common/globalstyle.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

// 已预约详情
export default class ReserveDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reserveDetails: {}
    }
  }

  // 查看讲师基本信息
  getAgentById() {
    CarryTokenRequest(servicePath.getAgentById, {
      planId: this.$router.params.planId
    })
      .then(res => {
        console.log("获取讲师基本信息成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            reserveDetails: res.data.data
          });
        }
      })
      .catch(err => {
        console.log("获取讲师基本信息失败", err);
      })
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getAgentById();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '详情信息'
  }

  render () {
    const { reserveDetails } = this.state;

    return (
      <View id='reserve-details'>
        <View className="details-content">
          <View className="user-head">
            <img src={ reserveDetails.avatar } alt=""/><br />
            <Text className="user-tag">{ reserveDetails.name }</Text>
          </View>
          <View className="details">
            <View className="details-item">
              <Text>昵称：</Text>
              <Text>{ reserveDetails.userName }</Text>
            </View>
            <View className="details-item">
              <Text>姓名：</Text>
              <Text>{ reserveDetails.realName }</Text>
            </View>
            <View className="details-item">
              <Text>手机号码：</Text>
              <Text>{ reserveDetails.phonenumber }</Text>
            </View>
            <View className="details-item">
              <Text>注册时间：</Text>
              <Text>{ reserveDetails.userCreateTime }</Text>
            </View>
            <View className="details-item">
              <Text>升级时间：</Text>
              <Text>{ reserveDetails.upgradeTime }</Text>
            </View>
            <View className="details-item">
              <Text>预约讲师： </Text>
              <Text>{ reserveDetails.teacherName }</Text>
            </View>
            <View className="details-item">
              <Text>预约时间： </Text>
              <Text>{ reserveDetails.startTime }</Text>
            </View>
            {
              reserveDetails.planStatus === 2
              ? null
              : <View className="details-item">
                  <Text>预约状态：</Text>
                  <Text className="plan-status">{ reserveDetails.planStatus === 0 ? "已完成" : "已取消"}</Text>
                </View>
            }
          </View>
        </View>
      </View>
    )
  }
}
