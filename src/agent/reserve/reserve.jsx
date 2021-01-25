import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import LecturerItem from '../../components/lecturerItem/lecturerItem';
import './reserve.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

// 静态图
import detailIc from '../../static/agentPart/ic_return.png'
import moreIc from '../../static/agentPart/ic_more.png'
export default class Reserve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabList:['已预约','历史记录'],
      tabIn:0,
      lecturerList:[],
      num: [2],
      current:1,
      pages:1,
      isMore:true,
    }
  }
  componentWillMount () { }

  componentDidMount () {
    this.getReserveList(1,[2])
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  onReachBottom() { // 上拉加载
    console.log('到底了',this.state.current);
    if (this.state.current === this.state.pages) {
      console.log("进入");
    } else if (this.state.pages !== 0) {
      Taro.showLoading({
        title: '正在加载...'
      })
      this.getReserveList(this.state.current + 1,this.state.num)
    }
  }
  getReserveList(current,number) {
    CarryTokenRequest(servicePath.getReserveList,{
      current,
      len:10,
      itemIds:number})
    .then(res=>{
      console.log('预约记录',res);
      this.setState({
        lecturerList:[...this.state.lecturerList,...res.data.data.records],
        current:res.data.data.current,
        pages:res.data.data.pages,
      })
      Taro.hideLoading();
    })
    .catch(err=>{
      console.log('预约记录接口异常--',err);
    })
  }
  getSelectIn=(index)=>{
    console.log('点击了吗',index);
    this.setState({
      tabIn:index,
      lecturerList: [],
    })
    let num = ''
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    if(index===0){
      num = [2]
      this.getReserveList(1,num)
    } else {
      num = [0,1]
      this.getReserveList(1,num)
    }
    this.setState({
      num,
    })
  }
  navigateTo=(e)=> {
    Taro.navigateTo({
      url: '/agent/reservedetail/reservedetail?planId='+e
    })
  }
  getselectMore=()=>{
    this.setState({
      isMore:!this.state.isMore,
    })
  }
  config = {
    navigationBarTitleText: '预约记录'
  }

  render () {
    const { tabList,tabIn,lecturerList,current,pages,isMore } = this.state
    return (
      <View className='reserve'>
        <View className={isMore?"dialog remove on":"dialog remove"}>
        <View className="tab-list">
          {
            tabList.map((item,index)=>{
            return <View onClick={this.getSelectIn.bind(this,index)} className={tabIn==index?'item on':'item'}>
              <span className="text">{item}</span>
            </View>
            })
          }
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
        
        {/* <LecturerItem lecturerList={lecturerList} url='/agent/reservedetail/reservedetail' type='planId'/> */}
        {
          lecturerList.map(item=>{
            return <View className="item-view" onClick={this.navigateTo.bind(this,item.planId)}>
              <View className="left">
                <Image className="head" src={item.teacherImg}></Image>
                {/* <View className="tag">网红店长</View> */}
              </View>
              <View className="center">
                <View className="text">预约讲师：{item.teacherName}</View>
                <View className="text">预约时间：{item.startTime}</View>
                <View className="text">地址：广东省深圳市南山区卓越前海壹号B座1413</View>
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
