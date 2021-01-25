import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './electricity.less'
// components
// picture
import banner from '../../static/scattered/banner.png'


export default class electricity extends Component {

  toGoodelist(){
    Taro.navigateTo({
      url:''    // 488商品列表页面
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '电商达人'
  }

  render () {
    return (
      //团队详情 页面
      <View className='h5-electricity'>
        {/* 顶部banner开始 */}
        <view className='h5-electricity-banner'>
          <view className='electricity-banner-img'>
            <img src={banner} alt=""/>
          </view>
        </view>
        {/* 顶部banner结束 */}
        {/* 底部内容开始 */}
        <view className='h5-electricity-content'>
          <view className='electricity-content-pay'>
            <view className='electricity-pay-text'>
              <text className='pay-text-content1'>资格：</text>
              <text className='pay-text-content2'>缴纳</text>
              <text className='pay-text-content3'>&nbsp;448</text>
              <text className='pay-text-content4'>元</text>
            </view>
          </view>
          <view className='electricity-content-textcontent'>
            <view className='content-textcontent-title'>
              <text>收益</text>
            </view>
            <view className='content-textcontent-title1'>
              <text className='title1-title'>一.培训课堂</text>
              <text className='title1-content'>1.电商知识</text>
              <text className='title1-content'>2.如何分享产品</text>
              <text className='title1-content'>3.佣金制度</text>
              <text className='title1-content'>4.自购/分享5%-50%收益</text>
              <text className='title1-content'>5.介绍费100元/人</text>
            </view>
            <view className='content-textcontent-title2'>
              <text className='title2-title'>二.证书</text>
              <text className='title2-content'>1.获得电商达人证书</text>
            </view>
            <view className='content-textcontent-title3'>
              <text className='title3-title'>三.礼品</text>
              <text className='title3-content'>1.获得价值888元精美礼品</text>
            </view>
          </view>
          <view className='electricity-content-btn'>
            <view className='content-btn' onClick={this.toGoodelist}>
              <text className='btn'>点击加入</text>
            </view>
          </view>
        </view>
        {/* 底部内容结束 */}
      </View>
    )
  }
}
