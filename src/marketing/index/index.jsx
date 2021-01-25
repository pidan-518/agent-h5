import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
// import '../../common/globalstyle.less'
import './index.less'
// components
// picture
import marketingBanner from '../../static/scattered/marketingBanner.png'
import bgimg from '../../static/scattered/bgimg.png'
// import logo from '../../static/scattered/logo.png'
import dsdr from '../../static/scattered/dianshangdaren.png'
import whdz from '../../static/scattered/wanghongdianzhang.png'


export default class index extends Component {
    toElectricity(){
        Taro.navigateTo({
            url:'/marketing/electricity/electricity'
        })
    }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '首页'
  }

  render () {
    return (
      //团队详情 页面
      <View className='h5-marketing'>
        {/* Banner开始 */}
        <view className='marketing-topbanner'>
            <view className='marketing-topbanner-list'>
                <img className='topbanner-list-bgimg' src={marketingBanner} alt=""/>
                {/* <img className='topbanner-list-logoimg' src={logo} alt=""/> */}
            </view>
        </view>
        {/* Banner结束 */}
        {/* 功能栏开始 */}
        <view className='marketing-functionbar'>
            <view className='marketing-functionbar-list'>
                <view className='functionbar-list-item'   onClick={this.toElectricity}>
                    <img className='item-icon' src={dsdr} alt=""/>
                    <text className='item-content'>电商达人</text>
                </view>
                <view className='functionbar-list-item'>
                    <img className='item-icon' src={whdz} alt=""/>
                    <text className='item-content'>网红店长</text>
                </view>
            </view>
        </view>
        {/* 功能栏结束 */}
        {/* 底部Banner开始 */}
        <view className='marketing-bottom'>
            <view className='marketing-bottom-list'>
                <img className='bottom-list-bgimg' src={bgimg} alt=""/>
            </view>
        </view>
        {/* 底部Banner结束 */}
        {/* <button  onClick={this.toElectricity}>123</button> */}
      </View>
    )
  }
}
