import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Form, Picker, Image } from '@tarojs/components'
import './cash.less'

import cashIcon from '../../static/satementPart/cashIcon.png'
import recordIcon from '../../static/satementPart/recordIcon.png'
import popUpBtn from '../../static/satementPart/popUpBtn.png'
import searchIcon from '../../static/common/search.png'

import { AtModal, AtModalContent } from 'taro-ui'

// 引入接口
import servicePath from '../../common/util/api/apiUrl'
import { CarryTokenRequest } from '../../common/util/request'

// 导入 空白状态 组件
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty'

// 申请提现界面
export default class statement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      records: [{}], // 财务申请列表
      levelId: 0, // 等级ID
      submitCash: false,
      actionType: '',
      drawDetail: {}, // 提现详情数据
      drawId: null, // 提现ID
      len: 4, // 申请数据长度
      total: null, // 所有数据
      searchData: {}, // 筛选条件
      dataLength: null, // 当前的records长度
      bankList: [], // 银行列表
      levelList: [{}], // 等级列表
      isEmpty: false, // 空白组件是否展示
      popUp: false, // 弹出层
      overLoad: false, // 页面加载是否完成
    }
  }

  componentWillMount() {}

  componentDidMount() {
    // 获取级别列表
    this.getLevelList()

    // 发送财务记录请求
    this.getFinancialRecord({ current: 1, len: 4, state: 0 })

    // 请求银行数据
    CarryTokenRequest(servicePath.getBankList, { current: 1, len: 10 })
      .then(res => {
        const bankList = res.data.data.map(item => {
          return item.name
        })
        // console.log(bankList)
        this.setState({
          bankList: bankList,
        })
      })
      .catch(err => {
        console.log(err)
      })

    setTimeout(() => {
      this.setState({
        overLoad: true,
      })
    }, 800)
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidUpdate() {}

  config = {
    navigationBarTitleText: '提现申请',
    onReachBottomDistance: 50,
  }

  // 请求级别列表
  getLevelList = () => {
    CarryTokenRequest(servicePath.getAgentLevelList)
      .then(res => {
        const levelList = [{ level: 0, name: '级别' }, ...res.data.data]
        console.log('等级列表', levelList)

        this.setState({
          levelList,
        })
      })
      .catch(err => console.log(err))
  }

  // 发送 财务记录 请求
  getFinancialRecord = data => {
    const dataObj = data
    CarryTokenRequest(servicePath.getDrawAdminList, dataObj)
      .then(res => {
        console.log(res.data)
        const data = res.data.data.records
        let isShowEmpty = false
        if (data.length === 0) {
          isShowEmpty = true
        }

        this.setState({
          records: res.data.data.records,
          dataLength: res.data.data.records.length,
          total: res.data.data.total,
          isEmpty: isShowEmpty,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 确认搜索
  // 表单提交——搜索条件
  formSubmit = e => {
    const dataNickName = {
      ...e.detail.value,
      current: 1,
      len: 10,
      agentLevelId: e.detail.value.agentLevelId,
      state: 0,
    }
    // 如果agentLevelId为0，则删除这个属性（这个属性非必须，但不可为0）
    if (dataNickName.agentLevelId === '0') {
      delete dataNickName.agentLevelId
    }
    // console.log(dataNickName)

    CarryTokenRequest(servicePath.getDrawAdminList, dataNickName)
      .then(res => {
        console.log('搜索结果：', res.data.data)
        const data = res.data.data.records

        if (data.length === 0) {
          this.setState({
            isEmpty: true,
          })
        } else {
          this.setState({
            isEmpty: false,
          })
        }
        this.setState({
          records: data,
          dataLength: res.data.data.records.length,
          searchData: dataNickName,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  // change级别Picker方法
  handlelevelIdChange = e => {
    const levelId = this.state.levelList[e.detail.value].level
    this.setState({
      levelId,
    })
  }

  // 上拉加载
  onReachBottom() {
    console.log('上拉加载')
    this.setState({ len: this.state.len + 2 }, () => {
      if (this.state.dataLength < this.state.total) {
        CarryTokenRequest(servicePath.getDrawAdminList, {
          ...this.state.searchData,
          current: 1,
          len: this.state.len,
          state: 0,
        })
          .then(res => {
            console.log('上拉加载的数据：', res)

            this.setState({
              records: res.data.data.records,
              dataLength: res.data.data.records.length,
            })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  // 发送 - 根据交易ID获取提现详情 - 请求
  getDrawDetail = drawId => {
    // console.log(drawId)
    CarryTokenRequest(servicePath.getDrawDetail, { withdrawId: drawId })
      .then(res => {
        console.log('提现详情：', res.data.data)
        const drawDetail = res.data.data
        this.setState({
          drawDetail,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 审核提现申请
  handleSublimtCash = drawId => e => {
    this.getDrawDetail(drawId)
    this.setState({
      submitCash: true,
      actionType: 'allow',
      drawId,
    })
  }

  // 驳回提现申请
  handleSublimtReject = drawId => e => {
    this.getDrawDetail(drawId)
    this.setState({
      submitCash: true,
      actionType: 'reject',
      drawId,
    })
  }

  // 通过申请
  handlePass = () => {
    console.log(this.state.drawId)
    CarryTokenRequest(servicePath.getDrawPass, { withdrawId: this.state.drawId, state: 1 })
      .then(res => {
        console.log('同意提现：', res.data)

        if (res.data.code == 0) {
          Taro.showToast({
            title: '通过申请',
            icon: 'none',
            duration: 1500,
          })
        } else {
          Taro.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500,
          })
        }

        this.setState(
          {
            drawId: null,
          },
          () => this.getFinancialRecord({ current: 1, len: 5, state: 0 })
        )
      })
      .catch(err => {
        console.log(err)
      })
    this.setState({
      submitCash: false,
    })
  }

  // 驳回申请
  handleReject = () => {
    const withdrawId = this.state.drawId
    const reason = this.refs.reason.value

    CarryTokenRequest(servicePath.getDrawNotPass, { withdrawId, state: 2, reason })
      .then(res => {
        console.log('驳回提现：', res.data)

        Taro.showToast({
          title: '驳回成功',
          icon: 'none',
          duration: 1500,
        })

        this.setState(
          {
            drawId: null,
          },
          () => this.getFinancialRecord({ current: 1, len: 5, state: 0 })
        )
      })
      .catch(err => {
        console.log(err)
      })
    this.setState({
      submitCash: false,
    })
  }

  // 模态框关闭
  handleModalClose = () => {
    this.setState({
      submitCash: false,
    })
  }

  // 弹出层控制
  handlePopUp = () => {
    this.setState({
      popUp: !this.state.popUp,
    })
  }

  // 加载模态框
  MotalIsShow = () => {
    if (this.state.submitCash) {
      return (
        <AtModal isOpened closeOnClickOverlay={true} onClose={this.handleModalClose}>
          <AtModalContent>
            <View className={this.state.actionType === 'allow' ? 'modal-box' : 'modal-reject-box'}>
              <h4 className="modal-heaer">
                {this.state.actionType === 'allow' ? '提现通过' : '提现驳回'}
              </h4>
              <View className="line"></View>
              <View className="modal-detail">
                <p>昵称：{this.state.drawDetail.nickName}</p>
                <p>姓名：{this.state.drawDetail.realName}</p>
                <p>手机号码：{this.state.drawDetail.mobile}</p>
                <p>会员ID: {this.state.drawDetail.agentId}</p>
                <p>申请时间：{this.state.drawDetail.updateTime}</p>
                <p>申请金额：{this.state.drawDetail.amount}</p>
                <p>账号类型：{this.state.drawDetail.accountType === 0 ? '银行卡' : '支付宝'}</p>
                <p>收款账号：{this.state.drawDetail.payeeAccount}</p>
                <p>开户行：{this.state.bankList[this.state.drawDetail.bank - 1]}</p>
                <p>收款人：{this.state.drawDetail.payee}</p>
                <p>备注：{this.state.drawDetail.remark}</p>
              </View>
              {this.state.actionType === 'allow' ? (
                ''
              ) : (
                <textarea
                  name="999"
                  id="modal-reason"
                  placeholder="输入驳回原因（可选）"
                  ref="reason"
                ></textarea>
              )}
              {this.state.actionType === 'allow' ? (
                <Button className="modal-btn" size="mini" onClick={this.handlePass}>
                  同意提现
                </Button>
              ) : (
                <Button className="modal-btn" size="mini" onClick={this.handleReject}>
                  驳回申请
                </Button>
              )}
            </View>
          </AtModalContent>
        </AtModal>
      )
    } else {
      return null
    }
  }

  render() {
    // 把数据处理一下，方便置入
    const recordsList = this.state.records.filter(item => {
      // 筛选掉已审核的数据
      let data = {}
      if (item.state === 0) {
        // console.log('已审核')
        data = {
          ...item,
          accountType: item.accountType === 0 ? '银行卡' : '支付宝',
        }
        return data
      }
    })
    // console.log(recordsList)

    let selectLevel = 0
    this.state.levelList.forEach((item, index) => {
      if (item.level === this.state.levelId) {
        selectLevel = index
      }
    })

    return (
      <View id="cash">
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
            {/* 搜索栏 */}
            <View className="searchbar">
              <Form className="searchForm" onSubmit={this.formSubmit}>
                <View className="form-body">
                  <Input
                    type="text"
                    name="nickName"
                    placeholder="昵称"
                    className="search-condition"
                  />
                  <Input
                    type="text"
                    name="mobile"
                    placeholder="手机号码"
                    className="search-condition"
                  />
                  <Picker
                    className="search-condition item-select"
                    name="agentLevelId"
                    mode="selector"
                    range={this.state.levelList}
                    rangeKey={'name'}
                    onChange={this.handlelevelIdChange}
                    value={selectLevel}
                  >
                    <View className="item-select-view">
                      {this.state.levelList[selectLevel].name}
                    </View>
                  </Picker>
                  <Button className="search-condition" id="search-btn">
                    <img src={searchIcon} />
                    <span>搜索</span>
                  </Button>
                </View>
              </Form>
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
          {/* 详细信息 */}
          <View className="detail" onScroll={this.slideToBottom}>
            {recordsList.map(item => {
              return (
                <View className="detail-items">
                  <table className="detail-item" key={item.withdrawId}>
                    <tr>
                      <td>昵称：{item.nickName}</td>
                      <td>申请金额：{item.amount}</td>
                    </tr>
                    <tr>
                      <td>姓名：{item.realName}</td>
                      <td>账号类型：{item.accountType === 0 ? '银行卡' : '支付宝'}</td>
                    </tr>
                    <tr>
                      <td>手机号码：{item.mobile}</td>
                      <td>收款账号：{item.payeeAccount}</td>
                    </tr>
                    <tr>
                      <td>会员ID：{item.agentId}</td>
                      <td>开户行：{this.state.bankList[item.bank - 1]}</td>
                    </tr>
                    <tr>
                      <td>
                        申请时间：<span id="time">{item.updateTime}</span>
                      </td>
                      <td>收款人：{item.payee}</td>
                    </tr>
                  </table>
                  <View className="remark">
                    <span>备注：</span>
                    <span>{item.remark}</span>
                  </View>
                  <Button
                    size="mini"
                    className="detail-btn"
                    onClick={this.handleSublimtCash(item.withdrawId)}
                  >
                    确定
                  </Button>
                  <Button
                    size="mini"
                    className="detail-btn"
                    onClick={this.handleSublimtReject(item.withdrawId)}
                  >
                    驳回
                  </Button>
                </View>
              )
            })}
            {/* {this.state.dataLength === this.state.total ? <Text className='bottomTip'>-已经没有数据了-</Text> : null} */}
            {this.state.isEmpty ? (
              <CommonEmpty></CommonEmpty>
            ) : (
              <Text className="bottomTip">-已经没有数据了-</Text>
            )}
          </View>
        </View>

        {/* 测试模态框组件，使用函数条件渲染 */}
        {this.MotalIsShow()}
      </View>
    )
  }
}
