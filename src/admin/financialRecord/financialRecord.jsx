import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Form, Image, Picker } from '@tarojs/components'
import './financialrecord.less'

// 引入图片
import cashRecord from '../../static/satementPart/cashRecord.png'
import rejectIcon from '../../static/satementPart/rejectIcon.png'
import toIcon from '../../static/satementPart/toIcon.png'
import popUpBtn from '../../static/satementPart/popUpBtn.png'
import searchIcon from '../../static/common/search.png'

// 引入接口
import servicePath from '../../common/util/api/apiUrl'
import { CarryTokenRequest } from '../../common/util/request'

// 导入 空白状态 组件
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty'

// 财务记录-界面
export default class statement extends Component {
  constructor(props) {
    super(props)

    // 发送-提现申请记录-请求
    this.getRecordList({ current: 1, len: 8, state: 1 })

    // 级别列表
    this.levelArray = [
      '级别',
      '区域总监',
      '业务总监',
      '区域经理',
      '业务经理',
      '网红店长',
      '电商达人',
    ]

    this.state = {
      current: 0, // 当前Tab页
      levelId: 0, // 等级ID
      records: [], // 提现记录
      len: 8, // 申请数据长度
      searchData: {}, // 搜索-请求参数
      dataLength: null,
      total: null, // 所有数据
      stateType: 1, // 请求的数据类型：1-已通过，2-已驳回
      isEmpty: false, // 空白组件是否展示
      selectIn: 0,
      popUp: false, // 弹出层
      overLoad: false, // 页面加载是否完成
    }
  }

  config = {
    navigationBarTitleText: '财务记录',
    onReachBottomDistance: 50,
  }

  componentWillMount() {}

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        overLoad: true,
      })
    }, 800)
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  // 监听滑动--后期加返回头部功能
  // onPageScroll(e){
  //   // console.log(e) // e 为滑动距离
  // }

  // 发送 提现记录 请求
  getRecordList = data => {
    const dataObj = data
    CarryTokenRequest(servicePath.getRecordList, dataObj)
      .then(res => {
        console.log(res.data)
        const data = res.data.data.records
        let isShowEmpty = false
        if (data.length === 0) {
          isShowEmpty = true
        }

        this.setState({
          records: data,
          dataLength: data.length,
          total: res.data.data.total,
          isEmpty: isShowEmpty,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 上拉加载
  onReachBottom() {
    this.setState({ len: this.state.len + 8 }, () => {
      console.log(this.state.dataLength, this.state.total)
      if (this.state.dataLength < this.state.total) {
        CarryTokenRequest(servicePath.getRecordList, {
          ...this.state.searchData,
          current: 1,
          len: this.state.len,
          state: this.state.stateType,
        })
          .then(res => {
            console.log('上拉加载', res)
            this.setState({
              records: res.data.data.records,
              dataLength: res.data.data.records.length,
              total: res.data.data.total,
            })
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  }

  // 确认搜索
  formSubmit = e => {
    const dataNickName = {
      ...e.detail.value,
      current: 1,
      len: 5,
      agentLevelId: this.state.levelId,
      state: this.state.stateType,
    }
    // 如果agentLevelId为0，则删除这个属性（这个属性非必须，但不可为0）
    if (dataNickName.agentLevelId === 0) {
      delete dataNickName.agentLevelId
    }
    // console.log(dataNickName)

    CarryTokenRequest(servicePath.getRecordList, dataNickName)
      .then(res => {
        console.log(res.data)
        const data = res.data.data.records
        let isShowEmpty = false
        if (data.length === 0) {
          isShowEmpty = true
        }

        this.setState({
          records: data,
          dataLength: data.length,
          isEmpty: isShowEmpty,
          searchData: dataNickName,
          total: res.data.data.total,
          len: 5,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 跳转到-记录详情页面
  handleToSuccessDetail = id => () => {
    // console.log(id)
    Taro.navigateTo({
      url: `/admin/recorddetail/recorddetail?id=${id}`,
    })
  }

  // change级别Picker方法
  handlelevelIdChange = e => {
    const levelId = e.detail.value
    console.log(levelId)

    this.setState({
      levelId,
    })
  }

  // 切换页面
  handleTabsChange = e => {
    this.setState({
      selectIn: e,
      stateType: e == 0 ? 1 : 2,
      levelId: 0,
      searchData: {},
      len: 8,
      popUp: !this.state.popUp,
    })
    if (e == 0) {
      this.getRecordList({ current: 1, len: 8, state: 1 })
    } else {
      this.getRecordList({ current: 1, len: 8, state: 2 })
    }
  }

  // 弹出层控制
  handlePopUp = () => {
    this.setState({
      popUp: !this.state.popUp,
    })
  }

  render() {
    // 分离数据
    const { records, selectIn } = this.state
    const recordSuccess = records.filter(item => {
      if (item.state === 1) {
        return item
      }
    })
    const recordFail = records.filter(item => {
      if (item.state === 2) {
        return item
      }
    })

    return (
      <View id="financialRecord">
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
                    range={this.levelArray}
                    onChange={this.handlelevelIdChange}
                    value={this.state.levelId}
                  >
                    <View className="item-select-view">{this.levelArray[this.state.levelId]}</View>
                  </Picker>
                  <Button className="search-condition" id="search-btn">
                    <img src={searchIcon} />
                    <span>搜索</span>
                  </Button>
                </View>
              </Form>
            </View>
            {/* 分类 */}
            <View className="options">
              <View className="button-item">
                <Button className="button-box" onClick={this.handleTabsChange.bind(this, 0)}>
                  <Image src={cashRecord} className="button-img" />
                </Button>
                <Text>提现记录</Text>
              </View>
              <View className="button-item">
                <Button className="button-box" onClick={this.handleTabsChange.bind(this, 1)}>
                  <Image src={rejectIcon} className="button-img" />
                </Button>
                <Text>驳回记录</Text>
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
          {/* 主页面 */}
          <View className="tabs-content">
            <View id="tab0" className={selectIn == 0 ? 'tab tab-active' : 'tab'}>
              <View style="font-size: 24px;">
                {/* 申请列表 */}
                <View className="application-list">
                  {recordSuccess.map(item => {
                    return (
                      <View className="data-item" key={item.id} onClick={this.handleToSuccessDetail(item.id)}>
                        {/* 头像头衔 */}
                        <View className="avatars">
                          <img src={item.headImage} className="avatar"></img>
                          <View className="rank">{item.agentLevelName}</View>
                        </View>
                        {/* 个人信息 */}
                        <View className="informations">
                          <p>昵称：{item.nickName}</p>
                          <p>姓名：{item.realName}</p>
                          <p>申请金额：{item.amount}</p>
                          <p>申请时间：{item.applicationTime}</p>
                        </View>
                        {/* 详细信息按钮 */}
                        <View className="detail-btn">
                          <Image
                            src={toIcon}
                            className="toIcon"
                          ></Image>
                        </View>
                      </View>
                    )
                  })}
                  {this.state.isEmpty ? (
                    <CommonEmpty></CommonEmpty>
                  ) : (
                    <Text className="bottomTip">-已经没有数据了-</Text>
                  )}
                </View>
              </View>
            </View>
            <View id="tab1" className={selectIn == 1 ? 'tab tab-active' : 'tab'}>
              <View style="font-size: 24px;">
                {/* 申请列表 */}
                <View className="application-list">
                  {recordFail.map(item => {
                    return (
                      <View className="data-item" onClick={this.handleToSuccessDetail(item.id)}>
                        {/* 头像头衔 */}
                        <View className="avatars">
                          <img src={item.headImage} className="avatar"></img>
                          <View className="rank">{item.agentLevelName}</View>
                        </View>
                        {/* 个人信息 */}
                        <View className="informations">
                          <p>昵称：{item.nickName}</p>
                          <p>姓名：{item.realName}</p>
                          <p>申请金额：{item.amount}</p>
                          <p>申请时间：{item.applicationTime}</p>
                        </View>
                        {/* 详细信息按钮 */}
                        <View className="detail-btn">
                          <Image
                            src={toIcon}
                            className="toIcon"
                          ></Image>
                        </View>
                      </View>
                    )
                  })}
                  {this.state.isEmpty ? (
                    <CommonEmpty></CommonEmpty>
                  ) : (
                    <Text className="bottomTip">-已经没有数据了-</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
