import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image,Input } from '@tarojs/components'
import './register.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import globalData from '../../common/util/global-data';

import logoIc from '../../static/agentPart/ic_register_logo.png'
import sxIc from '../../static/agentPart/ic_register_shixiao.png'

export default class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info:{
        phonenumber:'', // 手机号	
        password:'', // 密码
        rePassword:'', // 确认密码
        agentLevelId: 6, // 代理人等级
        smsCode: '', // 验证码
        recommendCode: '', // 推荐码
      },
      time:-1,
      feel:false,
    }
  }
  componentWillMount () { }

  componentDidMount () {
    this.getJudgeTime()
    if(this.$router.params.shareRecommend&&this.$router.params.shareRecommend!='null'){
      let newInfo = this.state.info
      newInfo.recommendCode = this.$router.params.shareRecommend  
      this.setState({
        info: newInfo
      })
    }
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () {
   }
  getsendSmsCode(mobile){
    CarryTokenRequest(servicePath.getregisterSmsCode,{phonenumber:mobile})
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
  getcheckPhonenumber(mobile){
    CarryTokenRequest(servicePath.getcheckPhonenumber,{phonenumber:mobile})
    .then(res=>{
      console.log('发送短信验证码',res);
      if(res.data.code===0){
        this.getsendSmsCode(this.state.info.phonenumber)
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
  getJudgeTime(){
    CarryTokenRequest(servicePath.getJudgeTime)
    .then(res=>{
      console.log('获取时间',res);
      if(res.data.code===0){
        if(res.data.data=='1'){
          this.setState({
            feel: true,
          })
        }
      }
    })
    .catch(err=>{
      console.log('获取时间接口异常--',err);
    })
  }
  getRegisterAgent(){
    const overTime = setTimeout(() => {
      Taro.hideLoading();
      Taro.showToast({
        title: '服务器繁忙，请稍后再尝试',
        icon: 'none'
      })
    }, 8000);
    CarryTokenRequest(servicePath.getRegisterAgent,this.state.info)
    .then(res=>{
      clearTimeout(overTime);
      Taro.hideLoading();
      console.log('提交注册',res);
      if(res.data.code===0){
        Taro.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          Taro.redirectTo({
            url:'/page/login/login'
          })
        }, 1500);
      } else {
        Taro.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
    .catch(err=>{
      Taro.hideLoading();
      console.log('提交注册接口异常--',err);
    })
  }
  timeStar=() => { // 倒计时
    let timer = null
    timer = setInterval(() => {
      console.log(this.state.time, '-----------');
      if (this.state.time >= 0) {
        this.setState({
          time: this.state.time - 1
        })
      } else {
        clearInterval(timer)
      }
    }, 1000);
  }
  change(e,item){ // input双向绑定
    // console.log(e.target.value);
    let value = e.target.value
    value = value.replace(/[\u4E00-\u9FA5]/g,'') // 不能输入中文
    value = value.replace(/\s+/g,'') // 不能输入空格
    // console.log('222',e.target.value);
    if(e.target.type=='number'){
      // value = value.match(/\d+/g) || null
      value = value.replace(/\D/g,'')
    }
    let newInfo = this.state.info
    newInfo[item] = value  
    this.setState({
      info: newInfo
    })
    // console.log(this.state.info);
  }
  getCode=()=>{ // 发送验证码
    if (!this.state.info.phonenumber) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
      if (!(/^1[3456789]\d{9}$/.test(this.state.info.phonenumber))) {
        Taro.showToast({
          title: '手机号格式错误',
          icon: 'none',
          duration: 2000
        })
        return
      }
    if (this.state.time <= 0) {
      if (!globalData.throttle()) return
      this.getcheckPhonenumber(this.state.info.phonenumber)
      
    }
  }
  getSubmit=()=>{
    const { phonenumber,smsCode,password,rePassword,recommendCode } = this.state.info
    if (!(/^1[3456789]\d{9}$/.test(phonenumber))) {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!smsCode) {
      Taro.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(password!==rePassword){
      Taro.showToast({
        title: '两次输入密码不一致',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(password.length<6||password.length>21){
      Taro.showToast({
        title: '请输入6-16位密码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if(recommendCode.length<6){
      Taro.showToast({
        title: '请输入正确长度的邀请码',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!globalData.throttle()) return
      Taro.showLoading({
        title: '提交中...'
      });
    this.getRegisterAgent()
  }
  config = {
    navigationBarTitleText: '代理人注册'
  }

  render () {
    const { info,time,feel } = this.state
    return (
      <View className='register'>
        {
          feel?<View className="shixiao">
          <Image className="sx" src={sxIc}></Image>
          <View className="text">该二维码已失效~</View>
        </View>:
        <View>
          <Image className="logo" src={logoIc}></Image>
          <View className="form">
            <View className="inp-div">
              <Input className="inp" type='number' placeholder='请输入手机号（登录账号使用）' maxLength='11' value={info.phonenumber} onChange={(event)=>{this.change(event,'phonenumber')}}></Input>
            </View>
            <View className="tips">*可用爱港猫平台账号注册</View>
            <View className="inp-div">
              <Input className="inp" maxLength='6' value={info.smsCode} type='number' placeholder='请输入短信验证码' onChange={(event)=>{this.change(event,'smsCode')}}></Input>
              <View className={time<0?"code-btn btn":"code-btn btn on"} onClick={this.getCode}>{time<0?'获取验证码':'已发送('+time+')'}</View>
            </View>
            <View className="inp-div">
              <Input className="inp" type='password' maxLength='16' value={info.password} placeholder='请设定密码' onChange={(event)=>{this.change(event,'password')}}></Input>
            </View>
            <View className="inp-div">
              <Input className="inp" type='password' maxLength='16' value={info.rePassword} placeholder='请确认密码' onChange={(event)=>{this.change(event,'rePassword')}}></Input>
            </View>
            <View className="inp-div">
              <Input className="inp" type='text' value={info.recommendCode} placeholder='请输入邀请码' maxLength='6' onChange={(event)=>{this.change(event,'recommendCode')}}></Input>
            </View>
            <View className="sub-btn btn" onClick={this.getSubmit}>注册</View>
          </View>
        </View>
        }
      </View>
    )
  }
}
