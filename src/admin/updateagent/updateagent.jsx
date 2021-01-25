/*
 * @Author: dixia
 * @Date: 2020-08-20 09:38:10
 * @LastEditTime: 2020-11-26 16:48:43
 * @LastEditors: Please set LastEditors
 * @Description: 添加代理人成功之后不可以修改等级，把添加成功的代理人的等级设置功能隐藏掉，密码长度限定为6-16
 * @FilePath: \iconmall-drp-h5\src\admin\updateagent\updateagent.jsx
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Form, Image, Picker } from '@tarojs/components'

import './updateagent.less'

// 引入接口
import servicePath from '../../common/util/api/apiUrl'
import { CarryTokenRequest } from '../../common/util/request'

// 新增权益界面
export default class statement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userName: '无', // 用户名称
      phonenumber: '000', // 用户账号
      password: '0', // 用户密码
      agentLevelId: 0, // 用户等级ID
      levelList: [{}], // 等级列表
      isShowAddBtn: true, // 空白数据-显示状态
      userId: null, // 代理人ID
      realState: 0, // 账户实名状态
    }
  }

  componentWillMount() {}

  componentDidMount() {
    this.getLevelList()
    this.getselectAgentUserDetail()
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '修改信息',
  }

  // 请求级别列表
  getLevelList = () => {
    CarryTokenRequest(servicePath.getAgentLevelList)
      .then(res => {
        const data = res.data.data
        const levelList = [{ level: 0, name: '请选择' }, ...data]
        // console.log('等级列表', levelList)

        this.setState({
          levelList,
          agentLevelId: 0,
        })
      })
      .catch(err => console.log(err))
  }

  // 请求代理人详情
  getselectAgentUserDetail = () => {
    const userId = this.$router.params.uid
    CarryTokenRequest(servicePath.selectAgentUserDetail, { userId })
      .then(res => {
        const details = res.data.data
        console.log('代理人详情', details)

        this.setState({
          agentLevelId: details.agentLevelId,
          userName: details.userName,
          // phonenumber: details.phonenumber,
          password: null,
          userId: userId,
          realState: details.realState,
        })
      })
      .catch(err => console.log(err))
  }

  // 确定修改——发送请求
  formSubmit = e => {
    const dataAdd = {
      ...e.detail.value,
      userId: this.state.userId,
      // agentLevelId: this.state.agentLevelId,
    }
    // console.log(dataAdd) // 表单数据

    // const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$/
    // const isPhone = phoneReg.test(dataAdd.phonenumber)
    // console.log(isPhone)

    if (dataAdd.userName === '') {
      Taro.showToast({
        title: '昵称不能为空',
        icon: 'none',
        duration: 1000,
      })
      return
    }
    // if (!isPhone) {
    //   Taro.showToast({
    //     title: '账户格式错误',
    //     icon: 'none',
    //     duration: 1000,
    //   })
    //   return
    // }
    // if (dataAdd.phonenumber === '') {
    //   Taro.showToast({
    //     title: '账户不能为空',
    //     icon: 'none',
    //     duration: 1000,
    //   })
    //   return
    // }
    if (dataAdd.password === '' && this.state.realState == 0) {
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
    // if (dataAdd.agentLevelId === 0) {
    //   Taro.showToast({
    //     title: '等级不能为空',
    //     icon: 'none',
    //     duration: 1000,
    //   })
    //   return
    // }

    // 发送请求
    CarryTokenRequest(servicePath.getUpdateAdminAgent, dataAdd)
      .then(res => {
        console.log('修改请求：', res)
        if (res.data.code === 0) {
          setTimeout(() => {
            Taro.navigateBack({
              delta: 1
            })
          }, 1000)
          Taro.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1000,
          })
        } else {
          Taro.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000,
          })
        }
      })
      .catch(err => alert(err))
  }

  // --------------------------------------------------------------------------
  // 点击input全选文字
  handleInputClick = e => {
    e.target.select()
    console.log(e.target)
  }

  // 双向绑定——所属级别
  handlelevelIdChange = e => {
    const agentLevelId = this.state.levelList[e.detail.value].level
    // console.log(agentLevelId)

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

  // 双向绑定——账号(已删除)
  // handlePhoneNumberChange = e => {
  //   const phonenumber = e.detail.value.trim()
  //   // console.log(phonenumber)

  //   this.setState({
  //     phonenumber,
  //   })
  // }

  // 双向绑定——密码
  handlePasswordChange = e => {
    let password = e.detail.value.trim().replace(/ /g, '')
    if (password.length < 6 || password.length > 21) {
      Taro.showToast({
        title: `密码必须为6-21位`,
        icon: 'none',
        duration: 1000,
      })
      return
    }
    // console.log(password)

    this.setState({
      password,
    })
  }

  render() {
    let selectLevel = 0

    this.state.levelList.forEach((item, index) => {
      if (item.level === this.state.agentLevelId) {
        selectLevel = index
      }
    })
    // console.log(selectLevel)

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
                ></Input>
              </View>

              {/* <View className={this.state.realState === 0 ? 'item' : 'item item-disable'}>
                <Text className="item-title">账号：</Text>
                <Input
                  className="item-input"
                  name="phonenumber"
                  type="number"
                  value={this.state.phonenumber}
                  onBlur={this.handlePhoneNumberChange}
                  disabled={this.state.realState === 0 ? false : true}
                ></Input>
              </View> */}

              <View className={this.state.realState === 0 ? 'item' : 'item item-disable'}>
                <Text className="item-title">密码：</Text>
                <Input
                  className="item-input"
                  name="password"
                  value={this.state.password}
                  onBlur={this.handlePasswordChange}
                  disabled={this.state.realState === 0 ? false : true}
                  placeholder={this.state.realState === 0 ? '请输入密码6-16位' : '不可更改'}
                ></Input>
              </View>

              {/* <Picker
                className="item"
                name="agentLevelId"
                mode="selector"
                range={this.state.levelList}
                rangeKey={'name'}
                onChange={this.handlelevelIdChange}
                value={selectLevel}
              >
                <Text className="item-title">等级：</Text>
                <View className="item-select">{this.state.levelList[selectLevel].name}</View>
              </Picker> */}
            </View>
            <Button className="btn-box">
              <Text className="btn-text">确定</Text>
            </Button>
          </Form>
        </View>
      </View>
    )
  }
}
