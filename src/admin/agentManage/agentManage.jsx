import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'

import './agentmanage.less'

// 引入图片
import baseSettingIcon from '../../static/satementPart/baseSettingIcon.png'
import agentIcon from '../../static/satementPart/agentIcon.png'
import popUpBtn from '../../static/satementPart/popUpBtn.png'
import controlIcon from '../../static/satementPart/controlIcon.png'
import LiveIcon from '../../static/satementPart/LiveIcon.png'
import adminAddAgent from '../../static/satementPart/adminAddAgent.png'

// 引入接口
import servicePath from '../../common/util/api/apiUrl'
import { CarryTokenRequest } from '../../common/util/request'

// 引入模态框组件
import OptionModal from '../../components/OptionModal/OptionModal'

// 代理人管理界面
export default class Index extends Component {
  config = {
    navigationBarTitleText: '代理人管理',
  }

  state = {
    isShow: false, // 模态框控制
    actionType: '', // CHANGE 或 DEL
    actionName: '', // 级别修改原数据
    levelList: [], // 级别列表
    levelSelect: 99, // 修改的级别
    popUp: false, // 弹出层
    overLoad: false, // 页面加载是否完成
  }

  componentWillMount() {}
  componentDidMount() {
    this.getLevelList()

    setTimeout(() => {
      this.setState({
        overLoad: true,
      })
    }, 800)
  }
  componentWillReceiveProps(nextProps, nextContext) {}
  componentWillUnmount() {}
  componentDidShow() {}
  componentDidHide() {}
  componentDidCatchError() {}
  componentDidNotFound() {}

  // 请求级别列表
  getLevelList = () => {
    CarryTokenRequest(servicePath.getAgentLevelList)
      .then(res => {
        // console.log(res)
        const level = res.data.data.reverse().map(item => {
          return item
        })
        console.log(level)

        this.setState({
          levelList: level,
        })
      })
      .catch(err => console.log(err))
  }

  // 跳转到基础设置页面
  handleToBaseSet = () => {
    Taro.navigateTo({
      url: '/admin/basesetting/basesetting',
    })
  }

  // 跳转到职员管理页面
  handleToStaffmanage = () => {
    Taro.navigateTo({
      url: '/admin/staffmanage/staffmanage',
    })
  }

  // 跳转到 添加权益 页面
  handleToAddEquity = () => {
    Taro.navigateTo({
      url: '/admin/addequity/addequity',
    })
  }

  // 跳转到 代理人设置 页面
  handleToInstall = () => {
    Taro.navigateTo({
      url: '/admin/install/install',
    })
  }

  // 跳转到 添加代理人 页面
  handleToAddagent = () => {
    Taro.navigateTo({
      url: '/admin/adminaddagent/adminaddagent',
    })
  }

  // ------------------------删除级别----------------------------------------------
  handleClickDelete = id => e => {
    let name = e.path[3].children[0].innerText
    // console.log(e.path[3].children[0].innerText)
    // console.log(id)

    this.setState({
      isShow: true,
      actionType: 'DEL',
      actionName: name,
      levelSelect: id,
    })
  }
  // 确认删除
  handleDelete = () => {
    const delLevel = this.state.levelSelect
    // 发送删除请求
    CarryTokenRequest(servicePath.getAgentLevelDelete, { id: delLevel })
      .then(res => {
        console.log(res)
        // 修改完重新请求
        this.getLevelList()
      })
      .catch(err => console.err(err))
    this.setState({
      isShow: false,
      actionType: '',
      actionName: '',
      levelSelect: 99,
    })
  }

  // 取消删除
  handleCancelDel = () => {
    this.setState({
      isShow: false,
      actionType: '',
      actionName: '',
      levelSelect: 99,
    })
  }

  // -------------------------修改级别---------------------------------------------
  handleClickChangeLevel = id => e => {
    let name = e.path[3].children[0].innerText

    this.setState({
      isShow: true,
      actionType: 'CHANGE',
      actionName: name,
      levelSelect: id,
    })
  }

  // 确认修改
  handleChangeLevel = () => {
    // console.log('确认修改为：', this.refs.inputBox.value)
    const newName = this.refs.inputBox.value
    const changeLevel = this.state.levelSelect

    // 发送修改请求
    CarryTokenRequest(servicePath.getAgentLevelEdit, { id: changeLevel, name: newName })
      .then(res => {
        // 修改完重新请求
        this.getLevelList()
      })
      .catch(err => console.err(err))

    // 隐藏模态框
    this.setState({
      isShow: false,
      actionType: '',
      actionName: '',
      levelSelect: 99,
    })
  }

  // 取消修改
  handleCancelChangeLevel = () => {
    this.setState({
      isShow: false,
      actionType: '',
      actionName: '',
      levelSelect: 99,
    })
  }

  // ----------------------查看权益-----------------------------------------------
  handleClickWatchEquity = num => () => {
    Taro.navigateTo({
      url: `/admin/watchlevelequity/watchlevelequity?num=${num}`,
    })
  }

  // ----------------------修改权益-----------------------------------------------
  handleClickChangeEquity = num => () => {
    Taro.navigateTo({
      url: `/admin/changelevelequity/changelevelequity?num=${num}`,
    })
  }

  // ----------------------点击input全选文字---------------------------------------
  // handleInputClick = () => {
  //   // console.log(this.refs.inputBox)
  //   this.refs.inputBox.select()
  // }

  // ---------------------------模态框---------------------------------------------
  MotalIsShow = () => {
    if (this.state.isShow) {
      if (this.state.actionType === 'DEL') {
        const render = (
          <View className="modal-text">
            删除后，该级别下所有代理人将不再存在级别，您确定要删除“{this.state.actionName}”吗？
          </View>
        )
        return (
          <OptionModal
            render={render}
            handleConfirm={this.handleDelete}
            handleReject={this.handleCancelDel}
          ></OptionModal>
        )
      } else if (this.state.actionType === 'CHANGE') {
        const render = (
          <View className="modal-box">
            <Text className='modal-name'>等级修改：</Text>
            <input
              className="level-input"
              value={this.state.actionName}
              ref="inputBox"
              onClick={this.handleInputClick}
            ></input>
          </View>
        )
        return (
          <OptionModal
            render={render}
            handleConfirm={this.handleCancelChangeLevel}
            handleReject={this.handleChangeLevel}
          ></OptionModal>
        )
      }
    } else {
      return null
    }
  }

  // 弹出层控制
  handlePopUp = () => {
    this.setState({
      popUp: !this.state.popUp,
    })
  }

  render() {
    return (
      <View id="agentManage">
        {/* 内容区域 */}
        <View id="content">
          {/* 弹出控制层 */}
          <View
            className={
              !this.state.popUp
                ? this.state.overLoad
                  ? 'topHide'
                  : 'topHide nonetransition'
                : 'topControl'
            }
          >
            {/* 分类 */}
            <View className="options">
              <View className="button-item">
                <Button className="button-box" onClick={this.handleToBaseSet}>
                  <Image src={baseSettingIcon} className="button-img" />
                </Button>
                <Text>基础设置</Text>
              </View>
              <View className="button-item">
                <Button className="button-box" onClick={this.handleToInstall}>
                  <Image src={agentIcon} className="button-img" />
                </Button>
                <Text>代理人设置</Text>
              </View>
              <View className="button-item">
                <Button className="button-box" onClick={this.handleToStaffmanage}>
                  <Image src={controlIcon} className="button-img" />
                </Button>
                <Text>职员管理</Text>
              </View>
              <View className="button-item">
                <Button className="button-box" onClick={this.handleToAddagent}>
                  <Image src={adminAddAgent} className="button-img" />
                </Button>
                <Text>添加代理人</Text>
              </View>
            </View>
            {/* 弹出按钮 */}
            <View className="popBtnView" onClick={this.handlePopUp}>
              {this.state.popUp ? null : <Text className="tip">点击查看更多信息</Text>}
              <Image
                src={popUpBtn}
                className={this.state.popUp ? 'popBtn-open' : 'popBtn-close'}
              ></Image>
            </View>
          </View>
          {/* 底部遮罩层 */}
          {this.state.popUp ? <View className="topMask" onClick={this.handlePopUp}></View> : null}

          {/* 级别设置-设置列表 */}
          <View className="setting-group">
            <Text className='setting-title'>等级设置</Text>
            <View className="group">
              {this.state.levelList.map(item => {
                return (
                  <View className="item">
                    <Text className='item-name'>{item.name}</Text>
                    <View className="item-btn">
                      <View
                        className="del-btn"
                        // onClick={this.handleClickDelete(item.id)}
                      ></View>
                      <View
                        className="com-btn-hide"
                        // onClick={this.handleClickChangeLevel(item.id)}
                      ></View>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
          {/* 等级权益-设置列表 */}
          <View className="setting-group setting-group2">
            <Text className='setting-title'>等级权益</Text>
            <View className="group">
              {this.state.levelList.map(item => {
                return (
                  <View className="item">
                    <Text className='item-name'>{item.name}</Text>
                    <View className="item-btn">
                      <View
                        className="watch-btn"
                        onClick={this.handleClickWatchEquity(item.level)}
                      ></View>
                      <View
                        className="com-btn"
                        onClick={this.handleClickChangeEquity(item.level)}
                      ></View>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>

          {/* 添加 */}
          <View className="add">
            <Text className="add-title">添加</Text>
            <View className="add-items">
              <View className="btn-area">
                <Button className="btn" onClick={this.handleToAddEquity}>
                  <Image className="btn-icon" src={LiveIcon}></Image>
                </Button>
                <Text className="btn-name">等级权益</Text>
              </View>
            </View>
          </View>

          {/* 模态框 */}
          {this.MotalIsShow()}
        </View>
      </View>
    )
  }
}
