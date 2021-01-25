import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import './promotionposter.less'
//请求
import { CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';
export default class promotionPoster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      poster: '',//海报
      // ratio: true,
    }
  }
  componentDidMount() {
    this.getPromotionPoster()
    document.body.addEventListener("touchmove", bodyScroll, false);
    function bodyScroll(event) {
      event.preventDefault();
    }
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  config = {
    navigationBarTitleText: '推广海报',
  }

  //获取海报图
  getPromotionPoster = () => {
    CarryTokenRequest(apiUrl.selectPostersInfo, {
      'postersType': 1
    })
      .then(res => {
        console.log(res)
        let configValue = res.data.data.configValue
        this.setState({ poster: configValue + '?t=' + new Date().getTime() }, () => { console.log(this.state.poster) })
      })
  }

  render() {
    const { poster } = this.state
    return (
      <View className='promotionPoster' /* style={{minHeight: '2000px'}} */ style={{height:`${window.innerHeight}px`}}>
        <View className='poster' >
          <img src={poster} className='imagewidth' style={{maxHeight:`${window.innerHeight-50}px`,maxWidth:`${window.innerWidth}px`}}/>
        </View>
        <View className='share'>
          (长按上方图片保存/分享)
          </View>
      </View>
    )
  }
}
