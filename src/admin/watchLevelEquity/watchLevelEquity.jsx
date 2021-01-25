import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './watchlevelequity.less'

// 引入接口
import servicePath from '../../common/util/api/apiUrl'
import { CarryTokenRequest } from '../../common/util/request'


const events = new Events()
// 成功申请记录
export default class Index extends Component {
  config = {
    navigationBarTitleText: '等级权益',
  }

  state = {
    level: [],
  }

  componentWillMount() {}
  componentDidMount() {
    const levelId = this.$router.params.num === 'null' ? '99' : this.$router.params.num
    // 请求权益列表
    CarryTokenRequest(servicePath.getInterestsConfigList, { levelId: levelId })
      .then(res => {
        console.log(res)
        let arr = res.data.data
        let newarr = []
        if (arr === null) {
          newarr.push('暂无数据！')
          this.setState({
            level: newarr,
          })
          return
        }
        // 处理数据
        newarr = arr.map((item,index) => {
          return `${index + 1}.${item.rightInterestsName}`
        })
        // console.log(newarr)
        this.setState({
          level: newarr,
        })
      })
      .catch(err => console.log(err))
  }
  componentWillReceiveProps(nextProps, nextContext) {}
  componentWillUnmount() {}
  componentDidShow() {}
  componentDidHide() {}
  componentDidCatchError() {}
  componentDidNotFound() {}

  render() {
    return (
      <View id="watchLevelEquity">
        {/* 内容区域 */}
        <View id="content">
          <h3 className="equity-name">权益名称</h3>
          {this.state.level.map(item => {
            return <p className="equity-detail">{item}</p>
          })}
        </View>
      </View>
    )
  }
}
