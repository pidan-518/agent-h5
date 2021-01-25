import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import './lecturerdetail.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
// 静态图
import itemImg from '../../static/agentPart/ic_share_bg.png'
export default class LecturerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail:{},
    }
  }
  componentWillMount () { }

  componentDidMount () { 
    window.sessionStorage.setItem('time',0)
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.getTeacherDetail()
   }

  componentDidHide () { }
  navigateToTime=()=>{
    Taro.navigateTo({
      url:'/agent/calendar/calendar?teacherId='+this.$router.params.teacherId
    })
  }
  getTeacherDetail() {
    CarryTokenRequest(servicePath.getTeacherDetail,{teacherId:this.$router.params.teacherId})
    .then(res=>{
      console.log('讲师详情',res);
      this.setState({
        detail: res.data.data
      })
    })
    .catch(err=>{
      console.log('讲师详情接口异常--',err);
    })
  }
  config = {
    navigationBarTitleText: '讲师详情'
  }

  render () {
    const { detail } = this.state
    return (
      <View className='examlecturerdetail'>
        <Image className="img-bg" src={detail.teacherImg} />
        <View className="bottom">
          <View className="name">{detail.teacherName}</View>
          <View className="info">{detail.personalProfile}</View>
          <View className="title">主讲课程</View>
          <View className="course">{detail.courseContent}</View>
        </View>
        <View className="bg">
          <View className="submit" onClick={this.navigateToTime}>立即预约</View>
        </View>
      </View>
    )
  }
}
