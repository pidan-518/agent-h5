import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Image,Picker } from '@tarojs/components'
import './withdrawal.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import globalData from '../../common/util/global-data';
// 静态图
import subIcon from '../../static/agentPart/ic_set_sub.png'

export default class WithDrawal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selector: [],
      selectorType: ['银行卡', '支付宝'],
      selectorChecked: '',
      selectorChecked2: '银行卡',
      WithInfo:{
        amount: '', // 提现金额	
        remark: '', //备注
        payee: '', // 收款人
        payeeAccount: '', // 收款人账号
        accountType: 0, // 账号类型0=银行卡，1=支付宝
        bank: '', // 银行id
        mobile: '', // 手机号
        smsCode: '', // 验证码
      },
      timer:null,
      time:-1,
      valueIndex:0,
      money: '',
    }
  }
  componentWillMount () { }

  componentDidMount () { 
    this.getBankList()
    this.setState({
      money: this.$router.params.money
    })
    // Taro.showModal({
    //   title: '温馨提示',
    //   content: '1号-15号提现结算时间为当月16号    16号-31号提现结算时间为下个月1号',
    //   showCancel: false,
    //   confirmColor:'#6F411C',
    //   confirmText:'关闭',
    //   success: (res)=> {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  }

  componentWillUnmount () { }

  componentDidShow () { 
    const phonenumber = JSON.parse(window.sessionStorage.getItem('userInfo')).phonenumber
    const obj = this.state.WithInfo
    obj.mobile = phonenumber
    this.setState({
      WithInfo:obj,
    })
  }

  componentDidHide () {
    console.log('注销');
   }
  getAddWithdraw(info){
    CarryTokenRequest(servicePath.getAddWithdraw,info)
    .then(res=>{
      console.log('新增提现申请',res);
      if(res.data.code==0){
        Taro.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1500
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
      console.log('新增提现申请接口异常--',err);
    })
  }
  getBankList(){
    CarryTokenRequest(servicePath.getBankList,{
      current:1,
      len:200,
    })
    .then(res=>{
      console.log('获取银行列表',res);
      this.setState({
        selector: res.data.data
      })
    })
    .catch(err=>{
      console.log('获取银行列表接口异常--',err);
    })
  }
  getsendSmsCode(mobile){
    CarryTokenRequest(servicePath.getsendSmsCode,{mobile})
    .then(res=>{
      console.log('发送短信验证码',res);
      if(res.data.code===0){
        this.setState({
          time:60,
        })
        Taro.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
        this.timeStar()
      } else {
        Taro.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
    .catch(err=>{
      console.log('发送短信验证码接口异常--',err);
    })
  }
  onChange=(e)=> { // 选择银行
    console.log('选择',e);
    let newInfo = this.state.WithInfo
    newInfo.bank = this.state.selector[e.detail.value].id
    this.setState({
      selectorChecked: this.state.selector[e.detail.value].name,
      WithInfo: newInfo,
      valueIndex:e.detail.value
    })
    console.log('WithInfo',this.state.WithInfo);
  }
  change(e,item){ // input双向绑定
    console.log(e.target.type);
    let value = e.target.value
    if(item=='amount'){
      if(value==0) value = ''
      value = (value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
      if(Number(value)>Number(this.state.money)){
        Taro.showToast({
          title: '不能大于可提现金额',
          icon: 'none',
          duration: 2000
        })
        value = ''
      }
    } else {
      console.log(1);
      if(e.target.type=='number'){
        // value = value.match(/\d+/g) || null
        value = value.replace(/\D/g,'')
      }
    }
    let newInfo = this.state.WithInfo
    newInfo[item] = value  
    this.setState({
      WithInfo: newInfo
    })
    // console.log(this.state.WithInfo);
  }
  onChangeType=(e)=>{ // 选择账号类型
    console.log('选择类型',e);
    const index = e.detail.value
    let newInfo = this.state.WithInfo
    newInfo.accountType = index
    this.setState({
      selectorChecked2: this.state.selectorType[index],
      WithInfo: newInfo
    })
    console.log(this.state.WithInfo);
  }
  getCode=()=>{ // 发送验证码
    if (!this.state.WithInfo.mobile) return
    if (!(/^1[3456789]\d{9}$/.test(this.state.WithInfo.mobile))&&!(/^(5|6|8|9)\d{7}$/.test(this.state.WithInfo.mobile))) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.state.time <= 0) {
      this.getsendSmsCode(this.state.WithInfo.mobile)
      
    }
  }
  timeStar=() => { // 倒计时
    let timer = null
    timer = setInterval(() => {
      console.log(this.time, '-----------');
      if (this.state.time >= 0) {
        this.setState({
          time: this.state.time - 1
        })
      } else {
        clearInterval(timer)
      }
    }, 1000);
  }
  onSubmit=()=>{
    const {amount,accountType,payee,payeeAccount,mobile,smsCode,bank} = this.state.WithInfo
    if(!amount){
      Taro.showToast({
        title: '请填写提现金额',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(Number(amount)<100){
      Taro.showToast({
        title: '提现金额需要大于100元',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!payeeAccount){
      Taro.showToast({
        title: '请填写收款账号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!payee){
      Taro.showToast({
        title: '请填写收款人',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!mobile){
      Taro.showToast({
        title: '请填写手机号码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(!smsCode){
      Taro.showToast({
        title: '请填写验证码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // if(!amount||!payee||!payeeAccount||!mobile||!smsCode){
    //   Taro.showToast({
    //     title: '请填写提现金额',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }
    if(accountType==0&&!bank){
      Taro.showToast({
        title: '银行卡提现必须选择开户行',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!(/^1[3456789]\d{9}$/.test(mobile))&&!(/^(5|6|8|9)\d{7}$/.test(mobile))) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!globalData.throttle()) return
    this.getAddWithdraw(this.state.WithInfo)
  }
  config = {
    navigationBarTitleText: '提现申请'
  }

  render () {
    const { selectorChecked,selectorChecked2,WithInfo,time,valueIndex,money } = this.state
    return (
      <View className='withdrawal'>
        <View className='item'>
          <Text className='text'>提现金额：</Text>
          <Input className='inp' value={WithInfo.amount || ''} type='number' placeholder='请输入提现金额' onChange={(event)=>{this.change(event,'amount')}} />
          <View className="price">可提现金额:{Number(money).toFixed(2)}</View>
        </View>
        <Picker mode='selector' range={this.state.selectorType} onChange={this.onChangeType}>
          <View className='item'>
            <Text className='text'>账号类型：</Text>
            <Text className='inp'>{selectorChecked2}</Text>
            <View className="more"/>
          </View>
        </Picker>
        <View className='item'>
          <Text className='text'>收款账号：</Text>
          <Input className='inp' maxLength='40' type={WithInfo.accountType==0?'number':'email'} value={WithInfo.payeeAccount || ''} placeholder='请输入收款账号' onChange={(event)=>{this.change(event,'payeeAccount')}}/>
        </View>
        {
          WithInfo.accountType==0?<Picker mode='selector' range={this.state.selector} rangeKey='name' value={valueIndex} onChange={this.onChange}>
          <View className='item'>
            <Text className='text'>开户行：</Text>
            <Text className='inp'>{WithInfo.bank?selectorChecked:''}</Text>
            <View className="more"/>
          </View>
        </Picker>:''
        }
        <View className='item'>
          <Text className='text'>收款人：</Text>
          <Input className='inp' type='text' maxLength='20' placeholder='请输入收款人姓名' onChange={(event)=>{this.change(event,'payee')}}/>
        </View>
        <View className='item'>
          <Text className='text'>手机号码：</Text>
          <Input className='inp' type='number' value={WithInfo.mobile || ''} placeholder='请输入输入手机号码' disabled onChange={(event)=>{this.change(event,'mobile')}}/>
        </View>
        <View className='item'>
          <Text className='text'>验证码：</Text>
          <Input className='inp' type='number' value={WithInfo.smsCode || ''} placeholder='请输入短信验证码' onChange={(event)=>{this.change(event,'smsCode')}}/>
          <View className='code' onClick={this.getCode}>
            {time<0?'获取验证码':'已发送('+time+')'}
          </View>
        </View>
        <View className='item'>
          <Text className='text'>备注：</Text>
          <Input className='inp' type='text' placeholder='备注信息(选填)' onChange={(event)=>{this.change(event,'remark')}}/>
        </View>
        <View className='button' onClick={this.onSubmit}>
          <Image className='submit' src={subIcon}/>
        </View>
      </View>
    )
  }
}
