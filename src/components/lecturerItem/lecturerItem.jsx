import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import './lecturerItem.less'

// 静态图
import itemImg from '../../static/agentPart/ic_share_bg.png'
export default class LecturerItem extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  navigateTo=(e)=>{
    Taro.navigateTo({
      url:this.props.url+'?'+this.props.type+'='+e,
    })
  }
  render () {
    return (
      <View className="main">
        {
          this.props.lecturerList.map(item=>{
          return  <View className='item' onClick={this.navigateTo.bind(this,this.props.type=='teacherId'?item.teacherId:item.planId)}>
            <Image className='img' src={item.teacherImg}/>
            <View className="info-view">
              <View className="name">{item.teacherName}</View>
              <View className="bottom">
                <View className="info">{item.personalProfile}</View>
                <View className="more">详情</View>
              </View>
            </View>
            </View>
          })
        }
      </View>
    )
  }
}
