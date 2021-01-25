import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import './incomedetail.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty';

export default class Income extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incomeList:[],
      nowDayOfWeek: '', // 今天是本周的第几天
      nowDay: '', // 当前日
      nowMonth: '', // 当前月
      nowYear: '', // 当前年
      selectList: ['本周收益','本月收益','季度收益'],
      selectIn:-1,
      current:1,
      pages: 1,
      startTime: '',
      endTime: '',
      type: '',
    }
  }
  componentWillMount () { }

  componentDidMount () {
    console.log(this.$router.params.type);
    this.setState({
      type: this.$router.params.type,
    })
   }

  componentWillUnmount () { }

  componentDidShow () {
    // new
    const time = this.$router.params.time
    if(this.$router.params.type!=4){
      this.getincomeDetailList(time+' 00:00:00',time+' 23:59:59',1)
    } else{
      this.gettoBePaidList(time+' 00:00:00',time+' 23:59:59',1)
    }
    const type = Number(this.$router.params.type)
    let text = ''
    switch (type) {
      case 0:
        text='全部'
        break;
      case 1:
        text='介绍费'
        break;
      case 2:
        text='自购/分享'
        break;
      case 3:
        text='直播'
        break;
      case 4:
        text='待'
        break;
      default:
        break;
    }
    Taro.setNavigationBarTitle({
      title: text+'收益明细'
    })
  }

  componentDidHide () { } 
  
  getincomeDetailList(startTime,endTime,current) { // 收益列表接口请求
    CarryTokenRequest(servicePath.getincomeDetailList,{
      profitSharingType:Number(this.$router.params.type),
      startTime,
      endTime,
      current,
      len:25,
    })
    .then(res=>{
      console.log('收益列表',res);
      if(current==1){
        this.setState({
          incomeList: [...res.data.data.records],
          current:res.data.data.current,
          pages:res.data.data.pages,
        })
      } else{
        this.setState({
          incomeList: [...this.state.incomeList,...res.data.data.records],
          current:res.data.data.current,
          pages:res.data.data.pages,
        })
      }
    })
    .catch(err=>{
      console.log('收益列表接口异常--',err);
    })
  }
  gettoBePaidList(startTime,endTime,current) { // 收益列表接口请求
    CarryTokenRequest(servicePath.gettoBePaidList,{
      profitSharingType:Number(this.$router.params.type),
      startTime,
      endTime,
      current,
      len:25,
    })
    .then(res=>{
      console.log('收益列表',res);
      if(current==1){
        this.setState({
          incomeList: [...res.data.data.records],
          current:res.data.data.current,
          pages:res.data.data.pages,
        })
      } else{
        this.setState({
          incomeList: [...this.state.incomeList,...res.data.data.records],
          current:res.data.data.current,
          pages:res.data.data.pages,
        })
      }
    })
    .catch(err=>{
      console.log('收益列表接口异常--',err);
    })
  }
  onScrollToLower=()=>{ // 上拉加载
    console.log('1111');
    if (this.state.current === this.state.pages) {
      console.log("进入");
    } else if (this.state.pages !== 0) {
      const time = this.$router.params.time
    if(this.$router.params.type!=4){
      this.getincomeDetailList(time+' 00:00:00',time+' 23:59:59',this.state.current + 1)
    } else{
      this.gettoBePaidList(time+' 00:00:00',time+' 23:59:59',this.state.current + 1)
    }
    }
  }
  config = {
    navigationBarTitleText: '收益明细'
  }

  render () {
    const { incomeList,type } = this.state
    return (
      <View className='incomedetail'>
        <View className='list title'>
          <View className='text'>
          支付时间
          </View>
          <View className='text'>
          订单状态
          </View>
          <View className='text'>
          商品价格
          </View>
          <View className='text'>
          分佣金额
          </View>
          <View className='text'>
          收益来源
          </View>
        </View>
        <ScrollView scrollY style={{height:'calc(100vh - 50px)'}} onScrollToLower={this.onScrollToLower}>
          <View className="overflow">
            {
              incomeList.length===0?<CommonEmpty content="暂无数据" />:
              incomeList.map((item,index)=>{
                return <View className='list'>
                  <View className='text'>
                  {item.createTime?item.createTime:item.incomeTime}
                  </View>
                  <View className='text'>
                  {type!=4?'已完成':item.orderState==20?'已支付':'待收货'}
                  </View>
                  <View className='text'>
                  {item.orderPrice}
                  </View>
                  <View className='text'>
                  {item.income}
                  </View>
                  <View className='text'>
                    {
                      item.profitSharingMode==1||item.profitSharingMode==2||item.profitSharingMode==3||item.profitSharingMode==4?'介绍费':item.profitSharingMode==5||item.profitSharingMode==6||item.profitSharingMode==7||item.profitSharingMode==8?'自购/分享':item.profitSharingMode==9||item.profitSharingMode==10||item.profitSharingMode==11||item.profitSharingMode==12?'直播':item.profitSharingMode==13||item.profitSharingMode==14||item.profitSharingMode==15?'新人奖金':''
                    }
                  </View>
                </View>
              })
            }
          </View>
        </ScrollView>
      </View>
    )
  }
}
