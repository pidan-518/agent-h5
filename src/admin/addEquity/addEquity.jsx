import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Form, Image, Picker } from '@tarojs/components'

import './addequity.less'

// 引入接口
import servicePath from '../../common/util/api/apiUrl'
import { CarryTokenRequest } from '../../common/util/request'

// 新增权益界面
export default class statement extends Component {
  constructor(props) {
    super(props)

    this.profitModeList = [
      '没有分润',
      '介绍费',
      '直推',
      '间推',
      '平级间推',
      '自购分享',
      '直属自购分享',
      '间推自购分享',
      '平级直属自购分享',
      '直播收益',
      '直属直播收益',
      '间推直播收益',
      '平级直播收益',
      '新人奖金直推',
      '新人奖金间推',
      '新人奖金平推',
    ]
    // this.sourceLevelList = [
    //   '不分等级',
    //   '区域总监',
    //   '业务总监',
    //   '区域经理',
    //   '业务经理',
    //   '网红店长',
    //   '电商达人',
    // ]

    this.state = {
      rightInterestsName: '', // 权益名称
      levelId: 0, // 等级ID
      profitMode: 0, // 分润模式 / 分润来源？
      profitAmount: 0, // 分润金额
      profitRate: '0%', // 分润比例
      SourceLevel: 0, // 收益来源分销等级
      levelList: [{}],
    }
  }

  componentWillMount() {}

  componentDidMount() {
    this.getLevelList()
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '新增权益',
  }

  // 请求级别列表
  getLevelList = () => {
    CarryTokenRequest(servicePath.getAgentLevelList)
      .then(res => {
        const levelList = [{ level: 0, name: '请选择' }, ...res.data.data]
        console.log('等级列表', levelList)

        this.setState({
          levelList,
          levelId: 0,
          SourceLevel: 0,
        })
      })
      .catch(err => console.log(err))
  }

  // 确定添加权益——发送请求
  formSubmit = e => {
    // console.log('表单验证开始：')

    if (this.state.rightInterestsName === '') {
      Taro.showToast({
        title: '必须输入权益名称！',
        icon: 'none',
        duration: 1500,
      })
      return
    }
    if (this.state.levelId === 0) {
      Taro.showToast({
        title: '必须输入所属级别！',
        icon: 'none',
        duration: 1000,
      })
      return
    }

    // 验证分润比例是否输入为0-100
    // let reg = /^\d+(\.\d+)?$/
    // const isRightProfitRate = reg.test(this.state.profitRate)
    if (this.state.profitRate.slice(0, -1) > 100 || this.state.profitRate.slice(0, -1) < 0) {
      Taro.showToast({
        title: '分润比例只能为0-100%！',
        icon: 'none',
        duration: 2000,
      })
      return
    }

    let profitAmount = parseFloat(this.state.profitAmount)

    // 通过验证后，整合数据
    const dataAdd = {
      ...e.detail.value,
      levelId: this.state.levelId,
      rightInterestsName: this.state.rightInterestsName,
      interestsSourceLevel: this.state.SourceLevel,
      profitSharingRate: this.state.profitRate.slice(0, -1),
      profitSharingAmount: profitAmount,
    }

    console.log(dataAdd)

    // 发送请求
    CarryTokenRequest(servicePath.getInterestsConfigAdd, dataAdd)
      .then(res => {
        console.log(res)

        Taro.showToast({
          title: '权益添加成功',
          icon: 'success',
          duration: 1500,
        })

        setTimeout(() => {
          Taro.redirectTo({
            url: `/admin/agentmanage/agentmanage`,
          })
        }, 1500)
      })
      .catch(err => console.log(err))
  }

  // 点击input全选文字
  handleInputClick = e => {
    e.target.select()
    console.log(e.target)
  }

  // 双向绑定——所属级别
  handlelevelIdChange = e => {
    const levelId = this.state.levelList[e.detail.value].level
    console.log(levelId)

    this.setState({
      levelId,
    })
  }

  // 双向绑定——分润模式
  handleProfitModeChange = e => {
    const profitMode = e.detail.value
    console.log('分润模式修改为：', e.detail.value)

    this.setState({
      profitMode,
    })
  }

  // 双向绑定——分润来源等级
  handleSourceLevelChange = e => {
    // console.log('分润来源等级修改为：', this.state.levelList[e.detail.value].id)
    const SourceLevel = this.state.levelList[e.detail.value].level

    this.setState({
      SourceLevel,
    })
  }

  // 双向绑定——权益名称
  handleEnameChange = e => {
    const rightInterestsName = e.detail.value.trim()

    this.setState({
      rightInterestsName,
    })
  }

  // 双向绑定——分润金额
  handleProfitAmountChange = e => {
    const reg = /^\d+(\.\d+)?$/
    let profitAmount = e.detail.value || 0
    // console.log(profitAmount)

    const strLength = String(profitAmount).length
    const pointNum = String(profitAmount).indexOf('.') + 1

    if (!reg.test(profitAmount)) {
      Taro.showToast({
        title: '分润金额必须为正数！',
        icon: 'none',
        duration: 2000,
      })
      profitAmount = this.state.profitAmount
      this.setState({
        profitAmount,
      })
      return
    }

    // 输入最大值
    if (profitAmount.length > 21) {
      Taro.showToast({
        title: '超过最大值',
        icon: 'none',
        duration: 2000,
      })
      profitAmount = this.state.profitAmount
      this.setState({
        profitAmount,
      })
      return
    }

    // 正则测试-是否输入两位小数的正数
    if (pointNum !== 0) {
      if (strLength - pointNum > 2) {
        Taro.showToast({
          title: '分润金额仅支持小数点后两位！',
          icon: 'none',
          duration: 2000,
        })
        profitAmount = this.state.profitAmount
      }
    }

    this.setState({
      profitAmount,
    })
  }

  // 双向绑定——分润比例
  handleProfitRateChange = e => {
    let profitRate = parseFloat(e.detail.value) || 0
    profitRate = profitRate + '%'
    console.log(profitRate)

    this.setState({
      profitRate,
    })
  }

  render() {
    let selectLevel = 0
    let SourceLevel = 0

    this.state.levelList.forEach((item, index) => {
      if (item.level === this.state.levelId) {
        selectLevel = index
      }
    })
    this.state.levelList.forEach((item, index) => {
      if (item.level === this.state.SourceLevel) {
        SourceLevel = index
      }
    })

    return (
      <View id="addEquity">
        {/* 内容区域 */}
        <View id="content">
          <Form onSubmit={this.formSubmit} className="formBox">
            <View className="items">
              <View className="item">
                <Text className="item-title">权益名称：</Text>
                <Input
                  type="text"
                  name="rightInterestsName"
                  className="item-input"
                  value={this.state.rightInterestsName}
                  onChange={this.handleEnameChange}
                  focus
                  placeholder="请输入"
                ></Input>
              </View>

              <Picker
                className="item"
                name="levelId"
                mode="selector"
                range={this.state.levelList}
                rangeKey={'name'}
                onChange={this.handlelevelIdChange}
                value={selectLevel}
              >
                <Text className="item-title">所属级别：</Text>
                <View className="item-select">{this.state.levelList[selectLevel].name}</View>
              </Picker>

              <Picker
                className="item"
                name="profitSharingMode"
                mode="selector"
                range={this.profitModeList}
                onChange={this.handleProfitModeChange}
                value={this.state.profitMode}
              >
                <Text className="item-title">分润模式：</Text>
                <View className="item-select">{this.profitModeList[this.state.profitMode]}</View>
              </Picker>

              <View className="item">
                <Text className="item-title">分润金额：</Text>
                <Input
                  className="item-input"
                  value={this.state.profitAmount === null ? 0 : this.state.profitAmount}
                  onBlur={this.handleProfitAmountChange}
                  onClick={this.handleInputClick}
                  name="profitSharingAmount"
                ></Input>
              </View>

              <View className="item">
                <Text className="item-title">分润比例：</Text>
                <Input
                  className="item-input"
                  name="profitSharingRate"
                  value={this.state.profitRate}
                  onBlur={this.handleProfitRateChange}
                ></Input>
              </View>

              <Picker
                className="item"
                name="interestsSourceLevel"
                mode="selector"
                range={this.state.levelList}
                rangeKey={'name'}
                onChange={this.handleSourceLevelChange}
                value={SourceLevel}
              >
                <Text className="item-title">分润来源等级：</Text>
                <View className="item-select">{this.state.levelList[SourceLevel].name}</View>
              </Picker>
            </View>
            <Button className="btn-box">
              <Text className="btn-text">保存</Text>
            </Button>
          </Form>
        </View>
      </View>
    )
  }
}
