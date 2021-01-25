import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,Input } from '@tarojs/components'
import './consume.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";

import logoIc from '../../static/common/search.png'
import moreIc from '../../static/agentPart/ic_more.png'
export default class Consume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allNum: 0,
      nowMonthNum: 0,
      nowMonthPrice: 0,
      price: 0,
      phonenumber:'',
      type:1,
      dateilList:[],
      current:1,
      pages:1,
      isMore:false,
    }
  }
  componentWillMount () { }

  componentDidMount () { 
    this.getCountPrimaryAgentNum()
    this.getSelectTeamPrimaryAgent(1)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  getselectMore=()=>{
    this.setState({
      isMore:!this.state.isMore,
    })
  }
  onReachBottom() { // 上拉加载
    console.log('到底了',this.state.current);
    if (this.state.current === this.state.pages) {
      console.log("进入");
    } else if (this.state.pages !== 0) {
      this.getSelectTeamPrimaryAgent(this.state.current + 1)
    }
  }
  getCountPrimaryAgentNum(){
    CarryTokenRequest(servicePath.getCountPrimaryAgentNum)
    .then(res=>{
      console.log('获取消费者信息统计',res);
      if(res.data.code===0){
        const {allNum,nowMonthNum,nowMonthPrice,price} = res.data.data
        this.setState({
          allNum,
          nowMonthPrice,
          nowMonthNum,
          price,
        })
      } else {
        Taro.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
    .catch(err=>{
      console.log('获取消费者信息统计接口异常--',err);
    })
  }
  getSelectTeamPrimaryAgent(current){
    CarryTokenRequest(servicePath.getSelectTeamPrimaryAgent,{type:this.state.type,phonenumber:this.state.phonenumber,len:20,current,})
    .then(res=>{
      console.log('获取消费者信息列表',res);
      if(res.data.code===0){
        if(current==1){
          // Taro.pageScrollTo({
          //   scrollTop:0,
          //   duration:300,
          // })
        }
        this.setState({
          dateilList:current==1?[...res.data.data.records]:[...this.state.dateilList,...res.data.data.records],
          current:res.data.data.current,
          pages:res.data.data.pages
        })
      } else {
        Taro.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
    .catch(err=>{
      console.log('获取消费者信息列表接口异常--',err);
    })
  }
  getSelectList=()=>{
    console.log(111111);
    this.getSelectTeamPrimaryAgent(1)
  }
  getSelect(e){
    this.setState({
      type:e,
    },()=>{
      this.getSelectTeamPrimaryAgent(1)
    })
  }
  onInpchange(e){
    console.log(e.target.value);
    this.setState({
      phonenumber:e.target.value
    })
  }
  config = {
    navigationBarTitleText: '消费者会员'
  }

  render () {
    const {allNum,nowMonthNum,nowMonthPrice,price,phonenumber,dateilList,type,current,pages,isMore} = this.state
    return (
      <View className='consume'>
        
        <View className={isMore?"dialog remove on":"dialog remove"}>
          <View className="search">
            <Input className="inp" type='number' placeholder='请输入账号' value={phonenumber} onChange={(e)=>this.onInpchange(e)}></Input>
            <View className="btn" onClick={this.getSelectList}>
              <Image className="ic" src={logoIc}></Image>
              
            </View>
          </View>
          <View className="select-btn">
            <View className={type==1?"item on":'item'} onClick={()=>this.getSelect(1)}>时间</View>
            <View className={type===0?"item on":'item'} onClick={()=>this.getSelect(0)}>消费额</View>
          </View>
          <View className="plate">
            <View className="item on">
              <View className="red">{allNum}</View>
              <View className="text">人员总数</View>
            </View>
            <View className="item">
              <View className="red">{nowMonthNum}</View>
              <View className="text">本月新增人数</View>
            </View>
            <View className="item on">
              <View className="red">{price}</View>
              <View className="text">消费总额</View>
            </View>
            <View className="item">
              <View className="red">{nowMonthPrice}</View>
              <View className="text">本月消费总额</View>
            </View>
          </View>
          <Image className="more remote" src={moreIc} onClick={this.getselectMore}></Image>
        </View>
        {
          isMore?<View className="masking" onClick={this.getselectMore}>
          </View>:<View className="dialog">
          <View className="tips" onClick={this.getselectMore}>
            <View className="text">点击查看更多信息</View>
            <Image className="more" src={moreIc}></Image>
          </View>
        </View>
        }
        
        
        {
          dateilList.length==0?<CommonEmpty content="暂无数据" />:''
        }
        {
          dateilList.map((item,index)=>{
            return <View className="list">
            <Image className="image" src={item.avatar}></Image>
            <View className="right">
              <View className="text">账号：{item.userName}</View>
              <View className="text">消费总额：{item.price}</View>
              <View className="text">注册时间：{item.createTime}</View>
            </View>
          </View>
          })
        }
        {
          current==pages?<View className="no-more">-没有更多啦-</View>:''
        }
      </View>
    )
  }
}
