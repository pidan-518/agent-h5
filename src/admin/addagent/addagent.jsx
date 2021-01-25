/*
 * @Author: dzk
 * @Date: 2020-08-19 17:08:17
 * @LastEditTime: 2020-11-27 16:12:01
 * @LastEditors: Please set LastEditors
 * @Description: 密码长度修改为6-16
 * @FilePath: \iconmall-drp-h5\src\admin\addagent\addagent.jsx
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Form, Image, Picker } from '@tarojs/components'

import './addagent.less'

// 引入接口
import servicePath from '../../common/util/api/apiUrl'
import { CarryTokenRequest } from '../../common/util/request'

// 新增代理人界面
export default class statement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userName: '', // 用户名称
      phonenumber: '', // 用户账号
      password: '', // 用户密码
      smsCode: '', // 验证码
      agentLevelId: 0, // 用户等级ID
      levelList: [{}], // 等级列表
      isShowAddBtn: true, // 空白数据-显示状态
      isSendVcode: true, // 是否允许发送验证码
      count: 0, // 倒计时
      countTip: '获取验证码', // 提示信息
      recommendCode: '', // 推荐码
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
    navigationBarTitleText: '新增代理人',
  }

  // 请求级别列表
  getLevelList = () => {
    CarryTokenRequest(servicePath.getAgentLevelList)
      .then(res => {
        const data = res.data.data
        const levelList = [{ level: 0, name: '请选择等级' }, ...data]
        // console.log('等级列表', levelList)

        this.setState({
          levelList,
          levelId: 0,
        })
      })
      .catch(err => console.log(err))
  }

  // 确定添加代理人——发送请求
  formSubmit = e => {
    const dataAdd = {
      ...e.detail.value,
      agentLevelId: this.state.agentLevelId,
    }

    const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$/
    const HKphoneReg = /^([5|6|8|9])\d{7}$/
    const isPhone = phoneReg.test(dataAdd.phonenumber) || HKphoneReg.test(dataAdd.phonenumber)

    if (!isPhone) {
      Taro.showToast({
        title: '账户格式错误',
        icon: 'none',
        duration: 1000,
      })
      return
    }
    if (dataAdd.phonenumber === '') {
      Taro.showToast({
        title: '账户不能为空',
        icon: 'none',
        duration: 1000,
      })
      return
    }
    if (dataAdd.password === '') {
      Taro.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000,
      })
      return
    }
    let password = dataAdd.password.trim().replace(/ /g, '')
    if (password.length < 6 || password.length > 16) {
      Taro.showToast({
        title: `密码必须为6-16位`,
        icon: 'none',
        duration: 1000,
      })
      return
    }
    if (dataAdd.smsCode.length === 0) {
      Taro.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1000,
      })
      return
    }
    if (dataAdd.agentLevelId === 0) {
      Taro.showToast({
        title: '等级不能为空',
        icon: 'none',
        duration: 1000,
      })
      return
    }
    if (dataAdd.recommendCode && dataAdd.recommendCode.length < 6) {
      Taro.showToast({
        title: '推荐码格式错误',
        icon: 'none',
        duration: 1000,
      })
      return
    }

    // 发送请求
    CarryTokenRequest(servicePath.getAddAdminAgent, dataAdd)
      .then(res => {
        console.log(res)
        if (res.data.code == 0) {
          Taro.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000,
          })
          setTimeout(() => {
            Taro.navigateBack({
              delta: 1
            })
          }, 1000)
        }else{
          Taro.showToast({
            title: `${res.data.msg}!`,
            icon: 'none',
            duration: 2000,
          })
          return
        } 
      })
      .catch(err => console.log(err))
  }

  // 点击input全选文字
  // handleInputClick = e => {
  //   e.target.select()
  //   console.log(e.target)
  // }

  // --------------------------------------------------------------------------
  // 双向绑定——所属级别
  handlelevelIdChange = e => {
    const agentLevelId = this.state.levelList[e.detail.value].level
    // console.log('级别',agentLevelId)

    this.setState({
      agentLevelId,
    })
  }

  // 双向绑定——昵称
  handleuserNameChange = e => {
    const userName = e.detail.value.trim()
    // console.log(userName)

    this.setState({
      userName,
    })
  }

  // 双向绑定——账号
  handlePhoneNumberChange = e => {
    const phonenumber = e.detail.value.trim()
    // console.log(phonenumber)

    this.setState({
      phonenumber,
    })
  }

  // 双向绑定——密码
  handlePasswordChange = e => {
    let password = e.detail.value.trim().replace(/ /g, '')

    this.setState({
      password,
    })
  }

  // 双向绑定——验证码
  handleSmsCodeChange = e => {
    const smsCode = e.detail.value.trim()
    // console.log(phonenumber)

    this.setState({
      smsCode,
    })
  }

  // 获取验证码
  handleGetVCode = () => {
    const phone = this.state.phonenumber

    if ( phone.length && this.state.isSendVcode) {
      // 发送请求
      CarryTokenRequest(servicePath.getregisterSmsCode, { phonenumber: phone })
        .then(res => {
          console.log(res)
          if(res.data.code == 0){
            this.send()
          }
          Taro.showToast({
            title: `${res.data.msg}`,
            icon: 'none',
            duration: 1500,
          })
        })
        .catch(err => console.log(err))
    }else if(!phone.length){
      Taro.showToast({
        title: `请输入手机号码`,
        icon: 'none',
        duration: 1500,
      })
    }
  }

  // 推荐码双向绑定
  handleRecommendCodeChange = (e) => {
    const recommendCode = e.detail.value.trim()
    // console.log(phonenumber)

    this.setState({
      recommendCode,
    })
  }

  // 发送验证码
  send = () => {
    this.setState({ counting: false, count: 60 })
    this.setInterval()
  }
  // 设置定时器
  setInterval = () => {
    this.timer = setInterval(this.countDown, 1000)
  }
  // 倒计时
  countDown = () => {
    const { count } = this.state
    if (count === 1) {
      this.clearInterval()
      this.setState({ isSendVcode: true, countTip: '重新获取验证码' })
    } else {
      this.setState({ isSendVcode: false, count: count - 1 })
    }
  }
  // 删除定时器
  clearInterval = () => {
    clearInterval(this.timer)
  }

  render() {
    let selectLevel = 0

    this.state.levelList.forEach((item, index) => {
      if (item.level === this.state.agentLevelId) {
        selectLevel = index
      }
    })

    return (
      <View id="addEquity">
        {/* 内容区域 */}
        <View id="content">
          <Form onSubmit={this.formSubmit} className="formBox">
            <View className="items">
              <View className="item">
                <Text className="item-title">昵称：</Text>
                <Input
                  type="text"
                  name="userName"
                  className="item-input"
                  value={this.state.userName}
                  onChange={this.handleuserNameChange}
                  placeholder="请输入你的昵称"
                ></Input>
              </View>

              <View className="item">
                <Text className="item-title">账号：</Text>
                <Input
                  className="item-input"
                  name="phonenumber"
                  type="number"
                  value={this.state.phonenumber}
                  onChange={this.handlePhoneNumberChange}
                  placeholder="请输入手机号码"
                ></Input>
              </View>

              <View className="item">
                <Text className="item-title">密码：</Text>
                <Input
                  className="item-input"
                  name="password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  placeholder="请输入密码6-16位"
                ></Input>
              </View>

              <View className="item">
                <Text className="item-title">验证码：</Text>
                <Input
                  className="item-input"
                  name="smsCode"
                  type="number"
                  value={this.state.smsCode}
                  onChange={this.handleSmsCodeChange}
                  placeholder="请输入短信验证码"
                ></Input>
                <Text
                  className={this.state.isSendVcode ? 'vcode-btn' : 'vcode-btn-hide'}
                  onClick={this.handleGetVCode}
                >
                  {this.state.isSendVcode
                    ? `${this.state.countTip}`
                    : `${this.state.count}秒后重发`}
                </Text>
              </View>

              <Picker
                className="item"
                name="agentLevelId"
                mode="selector"
                range={this.state.levelList}
                rangeKey={'name'}
                onChange={this.handlelevelIdChange}
                value={selectLevel}
              >
                <Text className="item-title">等级：</Text>
                <View className={selectLevel === 0 ? "item-select-init" : "item-select"}>{this.state.levelList[selectLevel].name}</View>
              </Picker>

              <View className="item">
                <Text className="item-title">推荐码：</Text>
                <Input
                  className="item-input"
                  name="recommendCode"
                  value={this.state.recommendCode}
                  onChange={this.handleRecommendCodeChange}
                  placeholder="请输入推荐码（选填）"
                ></Input>
              </View>
            </View>
            <Button className="btn-box">
              <Text className="btn-text">添加</Text>
            </Button>
          </Form>
        </View>
      </View>
    )
  }
}
