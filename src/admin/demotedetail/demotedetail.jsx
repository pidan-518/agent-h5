import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,Label,RadioGroup,Radio,Picker } from '@tarojs/components'
import './demotedetail.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

import teacherImg from '../../static/agentPart/ic_share_bg.png'
export default class Demote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type:'',
      demoteList:[{
        value:1,
        text: '立即降级',
      },{
        value:2,
        text: '暂不降级',
      }],
      detail: '',
      auditStatus :0,
      selectorType: ['请选择', '一个月','两个月','三个月','四个月','五个月','六个月','七个月','八个月','九个月','十个月','十一个月','十二个月'],
      monthsPostponed: 0,
      selectorChecked2: '请选择',
    }
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
    this.getselectStaffDetail()
    if(this.$router.params.type==2){
      this.setState({
        demoteList: [
          {
            value:1,
            text: '立即降级',
          },
          {
            value:3,
            text: '取消',
          },
          {
            value:4,
            text: '延期',
          },
          {
            value:5,
            text: '通过试用',
          },
        ]
      })
    }
   }

  componentDidHide () { }
  change=(e,item)=>{
    console.log(e,item);
  }
  onChangeType=(e)=>{ // 选择账号类型
    console.log('选择类型',e);
    const index = e.detail.value
    this.setState({
      selectorChecked2: this.state.selectorType[index],
      monthsPostponed: index
    })
    console.log(this.state.monthsPostponed);
  }
  getSelect=(e)=>{
    this.setState({
      auditStatus:e.value
    })
  }
  getSubmit=()=> {
    if(this.state.auditStatus==0)return
    if(this.state.auditStatus==4&&this.state.monthsPostponed==0){
      Taro.showToast({
        title: '请选择延期时长',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.getsaveDegradation()
  }
  getsaveDegradation(){
    CarryTokenRequest(servicePath.getsaveDegradation,{agentId:Number(this.$router.params.userId),auditStatus:this.state.auditStatus,monthsPostponed:this.state.monthsPostponed})
    .then(res=>{
      console.log('降级保存',res);
      if(res.data.code===0){
        Taro.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 1500,
        })
        setTimeout(() => {
          window.history.back(-1)
        }, 2000);
      } else {
        Taro.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      } 
    })
    .catch(err=>{
      console.log('降级保存接口异常--',err);
    })
  }
  getselectStaffDetail() {
    CarryTokenRequest(servicePath.getselectStaffDetail,{userId:this.$router.params.userId})
    .then(res=>{
      console.log('降级详情',res);
      this.setState({
        detail:res.data.data
      })
    })
    .catch(err=>{
      console.log('降级详情接口异常--',err);
    })
  }
  config = {
    navigationBarTitleText: '降级审核'
  }

  render () {
    const { detail,demoteList,auditStatus,selectorChecked2,monthsPostponed  } = this.state
    return (
      <View className='demotedetail'>
        <View className="top">
          <Image className="head" src={detail.avatar}/>
          <View className="tag">{detail.levelName}</View>
        </View>
        <View className="info">
          <View className="text">姓名：{detail.userName}</View>
          <View className="text">手机号码：{detail.phonenumber}</View>
          <View className="text">注册时间：{detail.createTime?detail.createTime.split(' ')[0]:'-'}</View>
          <View className="text">升级时间：{detail.degradationDate?detail.degradationDate.split(' ')[0]:'-'}</View>
        </View>
        <View className="echart">
          <View className="til">业绩数据</View>
          <View className="number">本月业绩：<Text className="red">{detail.currentMonthlyPerformance}元</Text></View>
          <View className="number">{new Date().getMonth()==0?12:new Date().getMonth()}月份业绩：<Text className="red">{detail.lastMonthPerformance}元</Text></View>
          <View className="number">{new Date().getMonth()==0?12-1:new Date().getMonth()==1?12:new Date().getMonth()-1}月份业绩：<Text className="red">{detail.oneMonthAgoPerformance}元</Text></View>
          <View className="number">{new Date().getMonth()==0?12-2:new Date().getMonth()==1?12-1:new Date().getMonth()==2?12:new Date().getMonth()-2}月份业绩：<Text className="red">{detail.twoMonthAgoPerformance}元</Text></View>
        </View>
        <View className="reson">
          <View className="text">降级原因：{detail.degradationReason}</View>
          {
            demoteList.map(item=>{
              return <View className="item" onClick={this.getSelect.bind(this,item)}>
                <View className={item.value==auditStatus?'radio on':"radio"}></View>
                {item.text}  {item.value==3?<Text className="tips"> (取消后重新计算三个月)</Text>:''}
                {
                  item.value==4&&auditStatus==4?
                  <Picker mode='selector' range={this.state.selectorType} onChange={this.onChangeType} value={monthsPostponed}>
                    <Text className="tips"> ({selectorChecked2})</Text>
                  </Picker>
                  :''
                }
                </View>
            })
          }
        </View>
        <View className="btn" onClick={this.getSubmit}>确定</View>
      </View>
    )
  }
}
