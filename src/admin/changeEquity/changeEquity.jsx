import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Button, Input, Picker } from '@tarojs/components'

import './changeequity.less'

// 引入接口
import servicePath from '../../common/util/api/apiUrl'
import { CarryTokenRequest } from '../../common/util/request'

// 修改权益界面
export default class statement extends Component {
  constructor(props) {
    super(props)

    // 获取权益详情
    this.getData()

    // 级别列表
    // this.levelArray = [
    //   '请选择',
    //   '区域总监',
    //   '业务总监',
    //   '区域经理',
    //   '业务经理',
    //   '网红店长',
    //   '电商达人',
    // ]
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
      eName: '', // 权益名称
      levelId: 6, // 等级ID
      profitMode: 0, // 分润模式 / 分润来源？
      profitAmount: 0.0, // 分润金额
      profitRate: 0, // 分润比例
      SourceLevel: 0, // 收益来源分销等级
      levelList: [{}], // 等级列表
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
    navigationBarTitleText: '修改权益',
  }

  // 请求级别列表
  getLevelList = () => {
    CarryTokenRequest(servicePath.getAgentLevelList)
      .then(res => {
        const levelList = [{ level: 0, name: '请选择' }, ...res.data.data]
        // console.log('等级列表', levelList)

        this.setState({
          levelList,
        })
      })
      .catch(err => console.log(err))
  }

  // 获取权益详情
  getData = () => {
    const eId = this.$router.params.eid
    CarryTokenRequest(servicePath.getInterestsConfigById, { id: eId })
      .then(res => {
        console.log(res)
        const eName = res.data.data.rightInterestsName
        const levelId = res.data.data.levelId
        const profitMode = res.data.data.profitSharingMode
        const profitAmount =
          res.data.data.profitSharingAmount === null ? 0 : res.data.data.profitSharingAmount
        const profitRate =
          res.data.data.profitSharingRate === null ? 0 : res.data.data.profitSharingRate
        const SourceLevel =
          res.data.data.interestsSourceLevel === null ? 0 : res.data.data.interestsSourceLevel

        this.setState({
          eName,
          levelId,
          profitMode,
          profitAmount,
          profitRate,
          SourceLevel,
        })
      })
      .catch(err => console.log(err))
  }

  // 双向绑定——所属级别
  handlelevelIdChange = e => {
    const levelId = this.state.levelList[e.detail.value].level

    this.setState({
      levelId,
    })
  }

  // 双向绑定——分润模式
  handleProfitModeChange = e => {
    const profitMode = e.detail.value
    // console.log('分润模式修改为：', e.detail.value)

    this.setState({
      profitMode,
    })
  }

  // 双向绑定——分润来源等级
  handleSourceLevelChange = e => {
    // console.log('分润来源等级修改为：', e.detail.value)
    const SourceLevel = this.state.levelList[e.detail.value].level
    this.setState({
      SourceLevel,
    })
  }

  // 双向绑定——权益名称
  handleEnameChange = e => {
    const eName = e.detail.value.trim()

    this.setState({
      eName,
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

    // 若输入整数，增加0到小数点后两位；若小数位超过2位，则只截取小数点后两位
    // if (String(profitAmount).indexOf('.') + 1 === 0) {
    //   console.log('输入为整数', profitAmountIsTure)
    //   profitAmount += '.00'
    // } else if (strLength - pointNum === 1) {
    //   console.log('输入了一位小数')
    //   profitAmount += '0'
    // }

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

    // if (dataChange.profitSharingRate > 1 || dataChange.profitSharingRate < 0) {
    //   Taro.showToast({
    //     title: '分润比例只能为0-1！',
    //     icon: 'none',
    //     duration: 2000,
    //   })
    //   return
    // }

    this.setState({
      profitRate,
    })
  }

  // 确认修改--发送请求
  formSubmit = () => {
    const eId = this.$router.params.eid

    let profitAmount = parseFloat(this.state.profitAmount)

    const dataChange = {
      id: eId,
      levelId: this.state.levelId,
      rightInterestsName: this.state.eName,
      interestsSourceLevel: this.state.SourceLevel,
      profitSharingMode: this.state.profitMode,
      profitSharingAmount: profitAmount,
      profitSharingRate: this.state.profitRate,
    }

    if (dataChange.rightInterestsName === '') {
      Taro.showToast({
        title: '必须输入权益名称！',
        icon: 'none',
        duration: 1500,
      })
      return
    }
    if (dataChange.levelId === 0) {
      Taro.showToast({
        title: '必须输入所属级别！',
        icon: 'none',
        duration: 1000,
      })
      return
    }

    // 验证分润比例是否输入为0-1
    // if(dataChange.profitSharingRate > 1 || dataChange.profitSharingRate < 0){
    //   Taro.showToast({
    //     title: '分润比例只能为0-1！',
    //     icon: 'none',
    //     duration: 2000,
    //   })
    //   return
    // }

    console.log(dataChange)

    CarryTokenRequest(servicePath.getInterestsConfigEdit, dataChange)
      .then(res => {
        console.log(res)
        Taro.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1500,
        })
        // this.getData()
        setTimeout(() => {
          Taro.redirectTo({
            url: `/admin/changelevelequity/changelevelequity?num=${this.state.levelId}`,
          })
        }, 1500)
      })
      .catch(err => console.log(err))
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
      <View id="changeEquity">
        {/* 内容区域 */}
        <View id="content">
          <Form onSubmit={this.formSubmit} className="formBox">
            <View className="items">
              <View className="item">
                <Text className="item-title">权益名称：</Text>
                <Input
                  type="text"
                  name="eName"
                  className="item-input"
                  value={this.state.eName}
                  onChange={this.handleEnameChange}
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
                name="profitMode"
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
                  name="profitAmount"
                ></Input>
              </View>

              <View className="item">
                <Text className="item-title">分润比例：</Text>
                <Input
                  className="item-input"
                  name="profitRate"
                  value={this.state.profitRate + '%'}
                  onBlur={this.handleProfitRateChange}
                ></Input>
              </View>

              <Picker
                className="item"
                name="SourceLevel"
                mode="selector"
                range={this.state.levelList}
                rangeKey={'name'}
                onChange={this.handleSourceLevelChange}
                value={SourceLevel}
              >
                <Text className="item-title">分润来源等级：</Text>
                <View className="item-select">{this.state.levelList[SourceLevel].name}</View>
              </Picker>

              {/* <View className="item">
                <Text className="item-title">分润来源等级：</Text>
                <select
                  className="item-select"
                  value={this.state.SourceLevel}
                  onChange={this.handleSourceLevelChange}
                >
                  <option value="" style="display: none;" disabled selected>
                    请选择
                  </option>
                  <option value="0">不分等级</option>
                  <option value="1">区域总监</option>
                  <option value="2">业务总监</option>
                  <option value="3">区域经理</option>
                  <option value="4">业务经理</option>
                  <option value="5">网红店长</option>
                  <option value="6">电商达人</option>
                </select>
              </View> */}
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
