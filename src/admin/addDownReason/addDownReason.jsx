import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './adddownreason.less'
import {CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';

export default class adddownreason extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  config = {
    navigationBarTitleText: '添加原因'
  }
  useReachBottom=() => {
    console.log('onReachBottom')
  }
  onDete = () => {
    console.log(this.contentReason.value)
    this.postList()
  }
  postList = (userId) => {
    CarryTokenRequest(apiUrl.insert, {
      contentReason: this.contentReason.value
    })
      .then(response => {
        this.gotodata()
      })
  }
  gotodata=()=>{
    Taro.navigateBack({
      delta: 1
    })
  }
  render() {
    return (
      <View className='reason'>
        <View className='addReason'>
          <Text className='tex'>降级原因：</Text>
          <View className='inp'>
            <input  className='reasonInput' type="text" placeholder='请输入原因' ref={el => this.contentReason = el} />
          </View>
        </View>
        <button onClick={this.onDete}>确定</button>
      </View>

    )
  }
}
