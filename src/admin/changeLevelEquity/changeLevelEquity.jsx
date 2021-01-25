import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtButton, AtModal, AtModalContent, AtModalAction } from 'taro-ui'

import './changelevelequity.less'

// 引入接口
import servicePath from '../../common/util/api/apiUrl'
import { CarryTokenRequest } from '../../common/util/request'

// 引入模态框组件
import OptionModal from '../../components/OptionModal/OptionModal'

// 等级权益
export default class Index extends Component {
  config = {
    navigationBarTitleText: '等级权益',
  }

  state = {
    isShow: false,
    actionName: '',
    level: [],
    equitySelectId: 999, // 要删除的权益ID
  }

  componentWillMount() {}
  componentDidMount() {
    // 请求权益列表
    this.getEquityList()
  }
  componentWillReceiveProps(nextProps, nextContext) {}
  componentWillUnmount() {}
  componentDidShow() {}
  componentDidHide() {}
  componentDidCatchError() {}
  componentDidNotFound() {}

  // 发送请求——获取等级权益列表
  getEquityList = () => {
    const levelId = this.$router.params.num === 'null' ? '99999' : this.$router.params.num
    CarryTokenRequest(servicePath.getInterestsConfigList, { levelId })
      .then(res => {
        // console.log(res.data.data)
        let arr = res.data.data

        // 如果没有数据，显示暂无数据
        if (arr === null) {
          this.setState({
            level: ['暂无数据！'],
          })
          return
        }

        // 遍历修改Name数据
        const newarr = arr.map((item, index) => {
          item.rightInterestsName = `${index + 1}.${item.rightInterestsName}`
          return { ...item }
        })
        // console.log(newarr)

        this.setState({
          level: newarr,
        })
      })
      .catch(err => console.log(err))
  }

  // 删除权益——确认弹窗
  handleClickDelEquity = (id, name) => () => {
    const equityname = name.split('.')[1]
    console.log(equityname, id)
    this.setState({
      isShow: true,
      actionName: equityname,
      equitySelectId: id,
    })
  }

  // 确定删除
  handleDelete = () => {
    const delId = this.state.equitySelectId

    CarryTokenRequest(servicePath.getInterestsConfigDelete, { id: delId })
      .then(res => {
        console.log(res.data.data)
        // 重新请求权益列表
        this.getEquityList()
      })
      .catch(err => console.log(err))

    this.setState({
      isShow: false,
      actionName: '',
      equitySelectId: 999,
    })
  }

  // 取消删除
  handleCancelDel = () => {
    this.setState({
      isShow: false,
      actionName: '',
      equitySelectId: 999,
    })
  }

  // /模态框
  MotalIsShow = () => {
    if (this.state.isShow) {
      const render = (
        <View className="modal-text">
          <p>“{this.state.actionName}”</p>删除后，该条件下代理人等级条件
          将会发生变动，您确定删除该条件吗？
        </View>
      )
      return (
        <OptionModal
          render={render}
          handleConfirm={this.handleDelete}
          handleReject={this.handleCancelDel}
        ></OptionModal>
      )
    }
  }

  // 跳转页面到——修改权益——传递权益ID
  handleClickChangeEquity = eid => () => {
    Taro.redirectTo({
      url: `/admin/changeequity/changeequity?eid=${eid}`,
    })
  }

  render() {
    return (
      <View id="changeLevelEquity">
        {/* 内容区域 */}
        <View id="content">
          <h3 className="title">权益名称</h3>
          {this.state.level.map(item => {
            return (
              <View className="item">
                <p className="item-detail">{item.rightInterestsName || '暂无数据！'}</p>
                {this.state.level[0] === '暂无数据！' ? (
                  ''
                ) : (
                  <View className="item-btn">
                    <AtButton
                      className="del-btn"
                      onClick={this.handleClickDelEquity(item.id, item.rightInterestsName)}
                    ></AtButton>
                    <AtButton
                      className="com-btn"
                      onClick={this.handleClickChangeEquity(item.id)}
                    ></AtButton>
                  </View>
                )}
              </View>
            )
          })}

          {/* 模态框 */}
          {this.MotalIsShow()}
        </View>
      </View>
    )
  }
}
