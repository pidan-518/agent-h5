import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import './reservedetail.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
// 静态图
import itemImg from '../../static/agentPart/ic_share_bg.png'
export default class LecturerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
    }
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { 
    this.getReserveDetail()
  }

  componentDidHide () {
    
   }
   getReserveDetail() {
    CarryTokenRequest(servicePath.getReserveDetail,{planId:this.$router.params.planId})
    .then(res=>{
      console.log('讲师详情',res);
      this.setState({
        detail:res.data.data
      })
    })
    .catch(err=>{
      console.log('讲师详情接口异常--',err);
    })
  }
  getcancel=()=>{
    Taro.showModal({
      title: '',
      content: '您确定要取消该次课程培训预约吗？',
      showCancel: true,
      confirmColor:'#E32D2D',
      success: (res)=> {
        if (res.confirm) {
          console.log('用户点击确定')
          this.getTeacherUpdate()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  getTeacherUpdate() {
    CarryTokenRequest(servicePath.getTeacherUpdate,{planId:this.$router.params.planId,planStatus:1,startTime:this.state.detail.startTime})
    .then(res=>{
      console.log('修改预约状态',res);
      this.getReserveDetail()
    })
    .catch(err=>{
      console.log('修改预约状态接口异常--',err);
    })
  }
  config = {
    navigationBarTitleText: '预约详情'
  }

  render () {
    const { detail } = this.state
    return (
      <View className='reservedetail'>
        <Image className="img-bg" src={detail.teacherImg} />
        <View className="bottom">
          <View className="name">{detail.teacherName}</View>
          <View className="info">{detail.personalProfile}</View>
          <View className="title">主讲课程</View>
          <View className="course" dangerouslySetInnerHTML={{ __html:detail.courseContent}}></View>
          <View className="title">预约时间：<Text className="course">{detail.startTime}</Text></View>
          <View className="title">联系电话：<Text className="course">0755-86564695</Text></View>
          <View className="title">地址：<Text className="course">广东省深圳市南山区卓越前海壹号B座1413</Text></View>
          {
            detail.planStatus==2?'':<View className="title">预约状态：<Text className="course">{detail.planStatus==1?'已取消':'已完成'}</Text></View>
          }
        </View>
        {
          detail.planStatus==2?<View className="bg" onClick={this.getcancel}>
            <View className="submit">取消预约</View>
          </View>:''
        }
      </View>
    )
  }
}
