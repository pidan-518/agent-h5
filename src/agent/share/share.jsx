import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import './share.less'

import shareBgPic from '../../static/agentPart/ic_share_bg.png'
import shareBtnIcon from '../../static/agentPart/ic_share_btn.png'

export default class Share extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  navigateTo(){
    Taro.navigateTo({
      url:'/agent/sharedetail/sharedetail?type=share'
    })
  }
  config = {
    navigationBarTitleText: '分享'
  }

  render () {
    return (
      <View className='examshare'>
        <Image className='share-bg' src={shareBgPic}/>
        <Image className='share-btn' src={shareBtnIcon} onClick={this.navigateTo}/>
      </View>
    )
  }
}
