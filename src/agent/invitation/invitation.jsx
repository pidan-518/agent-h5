import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import './invitation.less'

import shareBgPic from '../../static/agentPart/ic_invitation_bg.png'
import shareBtnIcon from '../../static/agentPart/ic_invitation_btn.png'

export default class Invitation extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  navigateTo(){
    Taro.navigateTo({
      url:'/agent/sharedetail/sharedetail?type=invitation'
    })
  }
  config = {
    navigationBarTitleText: '分享'
  }

  render () {
    return (
      <View className='examinvitation'>
        <Image className='share-bg' src={shareBgPic}/>
        <Image className='share-btn' src={shareBtnIcon} onClick={this.navigateTo}/>
      </View>
    )
  }
}
