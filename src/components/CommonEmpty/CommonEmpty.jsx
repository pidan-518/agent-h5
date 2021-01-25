import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './CommonEmpty.less';

class CommonEmpty extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { 
  }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '首页',
    usingComponents: {}
  }

  render () {
    return (
      <View className="empty-box">
        <img src={require("../../static/common/empty-image.png")} />
        <View className="content-text">{this.props.content}</View>
      </View>
    )
  }
}

CommonEmpty.defaultProps = {
  content: "暂无数据"
}

export default CommonEmpty;