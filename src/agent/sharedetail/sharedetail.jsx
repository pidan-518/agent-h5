import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import './sharedetail.less'
import QRcode from 'qrcode'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import wxCodePic from '../../static/agentPart/ic_wx_code.png'

export default class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareLink: '',
      code: '',
      shareBgPic:'',
      icon: '',
      type: '',
      feel: false,
      yjCodePic: '',
    }
  }
  componentWillMount () { }

  componentDidMount () {
    
   }

  componentWillUnmount () { }

  componentDidShow () {
    const userId = JSON.parse(window.sessionStorage.getItem('userInfo')).recommendAgentCode
    Taro.setNavigationBarTitle({
      title: this.$router.params.type=='share'?'自购分享':this.$router.params.type=='consume'?'邀请消费者会员':'达人分享'
    })
    let shareLink = ''
    let icon = ''
    if(this.$router.params.type=='share'){
      switch (envConstants) {
        case 'pro':
          shareLink = 'https://aigangmao.com/h5/v100?shareRecommend='+userId
          break;
        case 'pre':
          shareLink = 'http://121.42.231.22/h5?shareRecommend='+userId 
          break;
        case 'dev':
          shareLink = 'http://192.168.0.181/h5?shareRecommend='+userId
          break;
        default:
          break;
      }
      icon = '⚭'
      QRcode.toDataURL('https://www.aigangmao.com/h5/v100/')
      .then(url => {
        console.log('codecode',url)
        this.setState({
          shareBgPic: url,
        })
      })
      .catch(err => {
        console.error(err)
      })
    } else if (this.$router.params.type=='consume'){
      switch (envConstants) {
        case 'pro':
          shareLink = 'http://istgcl.com/#/agent/consumeregister/consumeregister?shareRecommend='+userId
          break;
        case 'pre':
          shareLink = 'http://121.42.231.22/agent/#/agent/consumeregister/consumeregister?shareRecommend='+userId
          break;
        case 'dev':
          shareLink = 'http://192.168.0.181/agent/#/agent/consumeregister/consumeregister?shareRecommend='+userId 
          break;
        default:
          break;
      }
      QRcode.toDataURL(shareLink)
        .then(url => {
          console.log('codecode',url)
          this.setState({
            shareBgPic: url,
          })
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      this.getJudgeTime()
      switch (envConstants) {
        case 'pro':
          shareLink = 'https://aigangmao.com/h5/v100/#/pages/drpjoin/drpjoin?shareRecommend='+userId
          break;
        case 'pre':
          shareLink = 'http://121.42.231.22/h5/#/pages/drpjoin/drpjoin?shareRecommend='+userId
          break;
        case 'dev':
          shareLink = 'http://192.168.0.181/h5/#/pages/drpjoin/drpjoin?shareRecommend='+userId 
          break;
        default:
          break;
      }
      icon = '§'
    }
      this.setState({
        shareLink,
        code:userId,
        icon,
        type: this.$router.params.type,
      })
      QRcode.toDataURL('iconmall://drpjoin?recommend='+userId) // tuijianma
        .then(url => {
          console.log('codecode',url)
          this.setState({
            yjCodePic: url,
          })
        })
        .catch(err => {
          console.error(err)
        })
   }

  componentDidHide () { }
  getJudgeTime(){
    CarryTokenRequest(servicePath.getJudgeTime)
    .then(res=>{
      console.log('获取时间',res);
      if(res.data.code===0){
        if(res.data.data=='0'){
          this.setState({
            feel:true
          })
          const userId = window.sessionStorage.getItem('userInfo')?JSON.parse(window.sessionStorage.getItem('userInfo')).recommendAgentCode:null
          let shareLink = ''
          switch (envConstants) {
            case 'pro':
              shareLink = 'http://istgcl.com/#/agent/register/register?shareRecommend='+userId
              break;
            case 'pre':
              shareLink = 'http://121.42.231.22/agent/#/agent/register/register?shareRecommend='+userId 
              break;
            case 'dev':
              shareLink = 'http://192.168.0.181/agent/#/agent/register/register?shareRecommend='+userId 
              break;
            default:
              break;
          }
          QRcode.toDataURL(shareLink)
          .then(url => {
            console.log('codecode',url)
            this.setState({
              shareBgPic: url,
            })
          })
          .catch(err => {
            console.error(err)
          })
        } else {
          QRcode.toDataURL('https://www.aigangmao.com/h5/v100/')
          .then(url => {
            console.log('codecode',url)
            this.setState({
              shareBgPic: url,
            })
          })
          .catch(err => {
            console.error(err)
          })
        }
      }
    })
    .catch(err=>{
      console.log('获取时间接口异常--',err);
    })
  }
  getCopy=(e)=>{
    if(e=='ios'){
      Taro.setClipboardData({
        data: 'https://apps.apple.com/cn/app/id1532834790',
        success: function (res) {
          Taro.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    } else if (e=='an'){
      Taro.setClipboardData({
        data: 'https://www.aigangmao.com/minio-product/appversion/1.0.0/app_client_1.0.0.apk',
        success: function (res) {
          Taro.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    } else {
      Taro.setClipboardData({
        data: 'fj令'+this.state.icon+this.state.code+this.state.icon+'复制到爱港猫打开',
        success: function (res) {
          Taro.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    }
    
  }
  onSave=()=>{
    Taro.saveImageToPhotosAlbum({
      filePath:'https://cdn.zhifualliance.com/assets/images/ic_logo.png',
      success: function (res) { }
    })
  }
  config = {
    navigationBarTitleText: '分享'
  }

  render () {
    const {shareLink,code,shareBgPic,icon,type,feel,yjCodePic} = this.state
    return (
      <View className='sharedetail'>
        {
          type=='consume'?
          <View className="code-view">
              <Image className='share-bg' src={shareBgPic}/>
              <View className="text">长按保存/分享二维码</View>
          </View>
          :type=='share'? <View>
            {/* 平台分享 */}
            <View className="code-view">
              <Image className='share-bg' src={shareBgPic}/>
              <View className="text">扫码下载APP</View>
              {/* <View className="save" onClick={this.onSave}>长按二维码保存到手机</View> */}
            </View>
            {/* --下载链接暂屏蔽 */}
            {/* <View className="text">APP下载链接</View> */} 
            {/* <View className="item">
              <View className="name">ios</View>
              <View className="bor on" onClick={this.getCopy.bind(this,'ios')}>https://apps.apple.com/cn/app/id1532834790</View>
              <View className="btn" onClick={this.getCopy.bind(this,'ios')}>点击复制</View>
            </View>
            <View className="item">
              <View className="name">安卓</View>
              <View className="bor on" onClick={this.getCopy.bind(this,'an')}>https://www.aigangmao.com/minio-product/appversion/1.0.0/app_client_1.0.0.apk</View>
              <View className="btn" onClick={this.getCopy.bind(this,'an')}>点击复制</View>
            </View> */}
          </View>:<View>
            {/* 达人分享 */}
            {
              feel?<View className="code-view">
              <Image className='share-bg' src={shareBgPic}/>
              <View className="text">长按二维码保存到手机</View>
            </View>:<View>
              <View className="code-view">
                <Image className='share-bg' src={yjCodePic}/>
                <View className="text">打开爱港猫APP/小程序扫码购物秒变达人领佣金</View>
              </View>
              {/* <View className="code-view">
                <Image className='share-bg' src={shareBgPic}/>
                <View className="text">扫码下载APP</View>
              </View> */}
              <View className="item">
                <View className="bor" onClick={this.getCopy.bind(this,'speak')}>{icon}{code}{icon}复制到爱港猫APP打开</View>
                <View className="btn" onClick={this.getCopy.bind(this,'speak')}>点击复制</View>
              </View>
            </View>
            }
            
          </View>
        }
        
      </View>
    )
  }
}
