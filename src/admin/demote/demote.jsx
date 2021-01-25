import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,Input,Picker } from '@tarojs/components'
import './demote.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

import detailIc from '../../static/agentPart/ic_return.png'
import moreIc from '../../static/agentPart/ic_more.png'
import selectIc from '../../static/common/dropDown.png'
export default class Demote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type:'',
      selectorType:[],
      peopleList: [],
      selectorChecked2: '',
      userName: '', // 昵称/姓名
      phonenumber: null, // 手机号码
      agentLevelId: null, // 等级id
      current:1,
      pages:1,
      valueIndex:0,
      isMore:false,
    }
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
    this.getlist()
    Taro.setNavigationBarTitle({
      title: this.$router.params.type==1?'降级审核':'暂不降级'
    })
    if(this.$router.params.type==1){
      this.getselectSubstandardStaff(1,null)
    } else {
      this.getselectNoDemotion(1,null)
    }
    this.setState({
      type:this.$router.params.type
    })
   }

  componentDidHide () { }
  change=(e,item)=>{
    console.log(e,item);
    if(item=='userName'){
      this.setState({
        userName: e.target.value  
      })
    } else {
      this.setState({
        phonenumber: Number(e.target.value)
      })
    }
  }
  onChangeType=(e)=>{
    console.log(e);
    this.setState({
      selectorChecked2: this.state.selectorType[e.detail.value].name,
      agentLevelId: this.state.selectorType[e.detail.value].id,
      valueIndex:e.detail.value
    })
    console.log(this.state.agentLevelId);
    this.getSearch(this.state.selectorType[e.detail.value].id)
  }
  navigateTo=(e)=> {
    Taro.navigateTo({
      url: '/admin/demotedetail/demotedetail?type='+this.state.type+'&userId='+e
    })
  }
  getSearch=(agentLevelId)=> {
    if(this.state.type==1){
      this.getselectSubstandardStaff(1,agentLevelId)
    } else {
      this.getselectNoDemotion(1,agentLevelId)
    }
    this.setState({
      agentLevelId,
    })
  }
  onReachBottom() { // 上拉加载
    console.log('到底了',this.state.current);
    if (this.state.current === this.state.pages) {
      console.log("进入");
    } else if (this.state.pages !== 0) {
      Taro.showLoading({
        title: '正在加载...'
      })
      if(this.state.type==1){
        this.getselectSubstandardStaff(this.state.current + 1,this.state.agentLevelId)
      } else {
        this.getselectNoDemotion(this.state.current + 1,this.state.agentLevelId)
      }
    }
  }
  getselectSubstandardStaff(current,agentLevelId) {
    CarryTokenRequest(servicePath.getselectSubstandardStaff,{
      current,
      len:20,
      agentLevelId,
      userName:this.state.userName,
      phonenumber: this.state.phonenumber?this.state.phonenumber:null
    })
    .then(res=>{
      console.log('降级审核列表',res);
      this.setState({
        peopleList: res.data.data.records,
        current:res.data.data.current,
        pages:res.data.data.pages,
      })
      Taro.hideLoading();
    })
    .catch(err=>{
      console.log('降级审核列表接口异常--',err);
    })
  }
  getselectNoDemotion(current,agentLevelId) {
    CarryTokenRequest(servicePath.getselectNoDemotion,{
      current,
      len:20,
      agentLevelId,
      userName:this.state.userName,
      phonenumber: this.state.phonenumber?this.state.phonenumber:null
    })
    .then(res=>{
      console.log('暂不降级列表',res);
      this.setState({
        peopleList: res.data.data.records,
        current:res.data.data.current,
        pages:res.data.data.pages,
      })
      Taro.hideLoading();
    })
    .catch(err=>{
      console.log('暂不降级列表接口异常--',err);
    })
  }
  getlist() {
    CarryTokenRequest(servicePath.list)
    .then(res=>{
      console.log('级别列表',res);
      let List = res.data.data
      const newList = {name:'全部',id:null}
      console.log('-----------',List.unshift(newList));
      this.setState({
        selectorType:List
      })
    })
    .catch(err=>{
      console.log('级别列表接口异常--',err);
    })
  }
  getselectMore=()=>{
    this.setState({
      isMore:!this.state.isMore,
    })
  }
  config = {
    navigationBarTitleText: '降级审核'
  }

  render () {
    const {selectorType,selectorChecked2,peopleList,current,pages,valueIndex,agentLevelId,isMore} = this.state
    return (
      <View className='demote'>
        <View className={isMore?"top on":"top"}>
          <View className="inp-e">
            <Input className='inp' type='text' placeholder='昵称/姓名' onChange={(event)=>{this.change(event,'userName')}}/>
          </View>
          <View className="inp-e">
            <Input className='inp' type='text' placeholder='手机号码' onChange={(event)=>{this.change(event,'phonenumber')}}/>
          </View>
          <Picker mode='selector' range={selectorType} rangeKey='name' value={valueIndex} onChange={this.onChangeType}>
            <View className={selectorChecked2?'inp more':'inp no more'}>
              <Text className=''>{selectorChecked2?selectorChecked2:'级别'}</Text>
              <Image className="select-ic" src={selectIc}></Image>
            </View>
          </Picker>
          <View className="inp btn" onClick={this.getSearch.bind(this,agentLevelId)}>
            <View className="search"></View>
          </View>
          <View className="img">
            <Image className="more remote" src={moreIc} onClick={this.getselectMore}></Image>
          </View>
        </View>
        {/* <View className={isMore?"dialog remove on":"dialog remove"}>
        
          <Image className="more remote" src={moreIc} onClick={this.getselectMore}></Image>
        </View> */}
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
          peopleList.map(item=>{
            return <View className="item-view" onClick={this.navigateTo.bind(this,item.userId)}>
              <View className="left">
                <Image className="head" src={item.avatar}></Image>
                <View className="tag">{item.levelName}</View>
              </View>
              <View className="center">
                <View className="text">昵称：{item.userName}</View>
                <View className="text">姓名：{item.realName}</View>
                <View className="text">手机号码：{item.phonenumber}</View>
                <View className="text">注册时间：{item.createTime?item.createTime.split(' ')[0]:'-'}</View>
                <View className="text">升级时间：{item.degradationDate?item.degradationDate.split(' ')[0]:'-'}</View>
              </View>
              <Image className="more" src={detailIc}></Image>
            </View>
          })
        }
        {
          current==pages||pages==0?<View className="no-more">-没有更多啦-</View>:''
        }
      </View>
    )
  }
}
