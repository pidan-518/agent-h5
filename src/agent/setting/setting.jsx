import Taro, { Component } from '@tarojs/taro';
import { View, Text,Image, Input, Picker } from '@tarojs/components';
import './setting.less';
import '../../common/globalstyle.less';
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import subIcon from '../../static/agentPart/ic_set_sub.png'
import RegionPicker from '../../components/taro-region-picker'

export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headImg: require("../../static/lecturer/add-icon.png"), // 头像
      otherHeadImg: '',
      userName: '',
      region: '',
      phoneNumber: '',
    };
  }

  // 上传头像
  getUploadImage=()=>{
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success:(res)=> {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        let file = res.tempFiles[0].originalFileObj     
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
          Taro.showToast({
            title: "图片必须小于1MB",
            icon: "none",
            duration: 1000
          });
          return;
        }
        console.log(res);
        var formData = new FormData();
        formData.append("file", res.tempFiles[0].originalFileObj);
        Taro.request({
          url: servicePath.getUploadhead,
          method: "POST",
          credentials: "include",
          data: formData,
          success: (res) => {
            console.log("上传头像成功", res.data);
            if (res.data.code === 0) {
              Taro.hideLoading();
              this.setState({
                otherHeadImg: res.data.data,
                headImg: tempFilePaths,
              }, () => {
                Taro.showToast({
                  title: "上传头像成功",
                  icon: "success",
                  duration: 1000
                });
              });
            } else {
              Taro.hideLoading();
              if (res.data.code === 403) {
                Taro.showToast({
                  title: "暂未登录",
                  icon: "none",
                  duration: 1000,
                  success: () => {
                    setTimeout(() => {
                      Taro.navigateTo({
                        url: "/page/login/login"
                      })
                    }, 1000);
                  }
                })
              } else {
                Taro.showToast({
                  title: res.data.msg,
                  icon: "none",
                  duration: 1000
                })
              }
            }
          },
          fail: (err) => {
            Taro.hideLoading();
            Taro.showToast({
              title: "网络连接失败",
              icon: "none",
              duration: 1000
            })
            console.log("上传讲师图片异常", err);
          }
        })
      }
    })
  }
  onSubmit=()=> {
    if(!this.state.userName&&!this.state.region&&!this.state.otherHeadImg){
      Taro.showToast({
        title: '您什么也没改~',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.getupdateAgentUser()
  }
  //地区选择
  onGetRegion(region) {
    // 参数region为选择的省市区
    this.setState({
      region,
    })
    console.log(region);
  }
  change=(e)=>{
    this.setState({
      userName: e.target.value
    })
  }
  getAgentUserDetail(){
    CarryTokenRequest(servicePath.getAgentUserDetail,{userId:JSON.parse(window.sessionStorage.getItem('userInfo')).userId})
  .then(res=>{
    console.log('获取代理人信息接口',res);
    const number = Math.random() * 100000
    const phonenumber = res.data.data.phonenumber
    const otherHeadImg = res.data.data.avatar+'?num='+number
    const region = res.data.data.region
    const userName = res.data.data.userName
    this.setState({
      phonenumber,
      otherHeadImg,
      userName,
      headImg: otherHeadImg,
      region,
    })
  })
  .catch(err=>{
    console.log('获取代理人信息接口异常--',err);
  })
  
  }
  getupdateAgentUser() {
    const obj = {}
    if(this.state.userName){
      obj.userName = this.state.userName
    }
    if(this.state.otherHeadImg){
      obj.avatar = this.state.otherHeadImg
    }
    if(this.state.region){
      obj.region = this.state.region
    }
    CarryTokenRequest(servicePath.getupdateAgentUser,{
      ...obj,
      userId:JSON.parse(window.sessionStorage.getItem('userInfo')).userId
    })
    .then(res=>{
      if(res.data.code===0){
        Taro.showToast({
          title: '修改成功',
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
      console.log('发送短信验证码接口异常--',err);
    })
  }
  componentWillMount () {  }

  componentDidMount () {
  }

  componentWillUnmount () { }

  componentDidShow () { 
    this.getAgentUserDetail()
  }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '设置'
  }

  render () {
    const {
      headImg,
      otherHeadImg,
      phonenumber,
      region,
      userName,
    } = this.state;

    return (
      <View className='setting'>
        <View className="item head">
          <View className="name">头像：</View>
          <View className="right" onClick={this.getUploadImage}>
            <img src={headImg} alt=""/>
            <View className="text">点击上传头像</View>
          </View>
        </View>
        <View className="item">
          <View className="name">昵称：</View>
          <Input className="inp" value={userName} placeholder='请输入你的昵称' maxLength='20' onChange={(event)=>{this.change(event)}}></Input>
        </View>
        <View className="item">
          <View className="name">手机号码：</View>
          <Input className="inp" disabled value={phonenumber} placeholder='请输入你的手机号码'></Input>
        </View>
        <View className="item">
          <View className="name">地区：</View>
          <View className="address">
            <RegionPicker onGetRegion={this.onGetRegion.bind(this)} value={region} />
          </View>
          <View className="more"/>
        </View>
        <View className='button' onClick={this.onSubmit}>
          <Image className='submit' src={subIcon}/>
        </View>
      </View>
    )
  }
}
