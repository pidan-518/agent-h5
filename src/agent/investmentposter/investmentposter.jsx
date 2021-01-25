import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, } from '@tarojs/components'
import './investmentposter.less'
//裁剪插件
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css'
//请求
import { CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';
import { AtModal, AtModalContent, AtModalAction } from "taro-ui"
import "taro-ui/dist/style/components/modal.scss";
//icon
import code from './static/code.png'
export default class investmentPoster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      investment: '',//推广
      hidd: true,//剪切框显示与隐藏
      cutImagePath: '',//剪切图路径
      modal: false,//模态框
      cutimage: '',//裁剪图
    }
  }
  componentWillMount() {
  }
  componentDidMount() {
    this.getPromotionPoster()
    window.ontouchmove=function(e){
      e.preventDefault && e.preventDefault();
      e.returnValue=false;
      e.stopPropagation && e.stopPropagation();    return false;
  };
    // document.body.addEventListener("touchmove", bodyScroll, false);
    // function bodyScroll(event) {
    //   event.preventDefault();
    // }
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  config = {
    navigationBarTitleText: '招商海报',
  }
  //获取海报图
  getPromotionPoster = () => {
    CarryTokenRequest(apiUrl.selectPostersInfo, {
      'postersType': 2
    })
      .then(res => {
        let configValue = res.data.data.configValue
        this.setState({ investment: configValue + '?t=' + new Date().getTime() })
      })
  }
  //上传获取二维码图片
  handleSelectImg = () => {
    let _this = this
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: (res) => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        this.setState({
          cutimage: tempFilePaths[0],
          hidd: false
        }, () => {
          console.log(this.state.cutimage)
          if (!this.cropper) {
            const image = document.getElementById('cutimage');
            this.cropper = new Cropper(image, {
              aspectRatio: 1 / 1,
              viewMode: 1,
              dragMode: 'move',
              touchDragZoom: true,
              rotatable: true,
              crop(e) {
                const canvas = this.cropper.getCroppedCanvas();
                canvas.toBlob((blob) => {
                  _this.cutImageData = blob
                }, 'image/jpeg', 0.91)
                // _this.cutImageData = canvas.toDataURL("image/jpeg", 0.01)
              },
            });
          } else {
            this.cropper.replace(this.state.cutimage);
          }
        })
      }
    })
  }
  //查询代理人二维码
  querycorde = () => {
    CarryTokenRequest(apiUrl.selectWechatQrUrl, {})
      .then(res => {
        let configValue = res.data.data
        if (configValue) {
          this.setState({
            cutImagePath: configValue + '?t=' + new Date().getTime()
          })
        }
      })
  }
  //上传二维码
  ChangePoster = (e) => {
    Taro.showLoading({
      title: '上传中'
    });
    let fil = this.state.cutImagePath
    // this.setState({
    //   cutImagePath: URL.createObjectURL(fil)
    // })
    // console.log(fil,'fil')
    var formData = new FormData();
    let nameImg = new Date().getTime() + '.png'
    formData.append("file", fil, nameImg);
    Taro.request({
      url: apiUrl.uploadWechatQrUrl,
      method: "POST",
      credentials: "include",
      data: formData,
      success: (res) => {
        console.log("上传二维码成功", res.data);
        if (res.data.code === 0) {
          Taro.hideLoading();
          this.getPromotionPoster()
          Taro.showToast({
            title: "上传成功",
            icon: "success",
            duration: 1000
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
        console.log("上传图片异常", err);
      }
    })
  }


  onConfirmCut = () => this.setState({ cutImagePath: this.cutImageData, hidd: true }, () => { this.ChangePoster() });
  onCancelCut = () => this.setState({ hidd: true });

  render() {
    const { investment, hidd, cutimage } = this.state
    return (
      <View className='investmentposter' /* style={{minHeight: '2000px'}} */ style={{height:`${window.innerHeight}px`}}>
        <View className="content">
          <img id="imgcover" src={investment} className="imgcover" style={{maxHeight:`${window.innerHeight-80}px`,maxWidth:`${window.innerWidth}px`}} />
        </View>
        <View className='bottom' >
          <View className='share' >
            <View >(长按上方图片保存/分享)</View>
          </View>
          <View className='uploadcorde' onClick={this.handleSelectImg}>
            <View className='code'><img src={code} /></View>
            <View >上传二维码</View>
          </View>
        </View>
        <AtModal isOpened={!hidd}>
          <AtModalContent>
            <View className='imagecode'>
              <img src={cutimage} id="cutimage" className='img' />
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.onCancelCut}>取消</Button>
            <Button onClick={this.onConfirmCut}>确定</Button>
          </AtModalAction>
        </AtModal>      
      </View>
    )
  }
}
