import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './staffmanage.less'
import basicsettings from './static/basicsettings.png'
import demotionaudit from './static/demotionaudit.png'
import nodemotion from './static/nodemotion.png'

export default class StaffManage extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  config = {
    navigationBarTitleText: '职员管理'
  }
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  basicTo = (url) => {
    Taro.navigateTo({
      url: `/admin${url}`
    })
  }
  render() {
    return (
      <View className='staffManagement'>
        <View className='headNav'>
          <ul>
            <li className='basicSet' onClick={() => { this.basicTo('/agentsetting/agentsetting') }}>
              <View className='item'>
                <img src={basicsettings} />
              </View>
              <p>基础设置</p>
            </li>
            <li>
              <View className='item' onClick={() => { this.basicTo('/demote/demote?type=1') }}>
                <img src={demotionaudit} />
              </View>
              <p>降级审核</p>
            </li>
            <li>
              <View className='item' onClick={() => { this.basicTo('/demote/demote?type=2') }}>
                <img src={nodemotion} />
              </View>
              <p>暂不降级</p>
            </li>
          </ul>
        </View>
        {/* <LiftComp /> */}
      </View>
    )
  }
}