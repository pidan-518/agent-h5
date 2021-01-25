import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './agentsetting.less'
import add from './static/addreason.png'
import down from './static/reasondegradation.png'
export default class agentsetting extends Component{

    componentWillMount () { }

    componentDidMount () { }
  
    componentWillUnmount () { }
  
    componentDidShow () { }
  
    componentDidHide () { } 
    downclick=()=>{
        Taro.navigateTo({
              url: `/admin/reasondegradation/reasondegradation`
        })
      }
      addclick=()=>{
        Taro.navigateTo({
              url: `/admin/adddownreason/adddownreason`
        })
      }
    config = {
        navigationBarTitleText: '基础设置'
      }

      render(){
          return(
            <View className='lift'> 
            <View className='liftReason'>
                {/* <p>降级原因</p> */}
                <View className='liftBecause'>
                  <ul>
                    <li>
                      <View className='liftBecauseLeft' onClick={this.downclick}>
                        <img src={down} />
                      </View>
                      <p>降级原因</p>
                    </li>
                    <li>
                    <View className='liftBecauseRight' onClick={this.addclick}>
                        <img src={add} />
                      </View>
                      <p>添加原因</p>
                    </li>
                  </ul>
                </View>
            </View>
        </View>    
             
          )
      }
}