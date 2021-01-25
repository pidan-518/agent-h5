import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Form, Image, Picker } from '@tarojs/components'
import './adminaddagent.less'

// 引入图片
import addAgent from '../../static/common/addAgent.png'
import searchIcon from '../../static/common/search.png'
import popUpBtn from '../../static/satementPart/popUpBtn.png'

// 导入 空白状态 组件
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty'

// 引入接口
import servicePath from '../../common/util/api/apiUrl'
import { CarryTokenRequest } from '../../common/util/request'

// 财务报表界面
export default class statement extends Component {
  constructor(props) {
    super(props)

    // 获取级别列表
    this.getLevelList()

    // 发送-代理人信息列表-请求
    this.getAgentUserList({ current: 1, len: 8 })

    this.state = {
      records: [{}], // 财务申请列表
      levelId: 0, // 等级ID
      len: 8, // 申请数据长度
      submitCash: false, // 模态框显示-->审核
      actionType: '', // 审核类型
      total: null, // 所有数据
      searchData: {}, // 筛选条件
      dataLength: null, // 当前的数据长度
      drawDetail: {}, // 提现详情
      levelList: [{}], // 等级列表
      isEmpty: false, // 空白组件是否展示
      popUp: false, // 弹出层
      overLoad: false, // 页面加载是否完成
    }
  }

  config = {
    navigationBarTitleText: '添加代理人',
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

  // 请求级别列表
  getLevelList = () => {
    CarryTokenRequest(servicePath.getAgentLevelList)
      .then(res => {
        const levelList = [{ level: 0, name: '级别' }, ...res.data.data]
        // console.log('等级列表', levelList)

        this.setState({
          levelList,
        })
      })
      .catch(err => console.log(err))
  }

  // 上拉加载
  onReachBottom() {
    this.setState({ len: this.state.len + 8 }, () => {
      console.log(this.state.dataLength, this.state.total)
      if (this.state.dataLength < this.state.total) {
        CarryTokenRequest(servicePath.getListAdminAgent, {
          ...this.state.searchData,
          current: 1,
          len: this.state.len,
          state: 0,
        })
          .then(res => {
            console.log('上拉加载', res)
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

  // 发送-代理人信息列表-请求
  getAgentUserList = data => {
    const dataObj = data
    CarryTokenRequest(servicePath.getListAdminAgent, dataObj)
      .then(res => {
        console.log('代理人信息列表', res.data)
        const data = res.data.data.records
        let isShowEmpty = false
        if (data.length === 0) {
          isShowEmpty = true
        }

        this.setState({
          records: data,
          total: res.data.data.total,
          dataLength: res.data.data.records.length,
          isEmpty: isShowEmpty,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 表单提交——搜索条件
  formSubmit = e => {
    const dataNickName = {
      ...e.detail.value,
      current: 1,
      len: 8,
    }

    // 如果有条件为空，则删除这个属性
    if (dataNickName.phonenumber === '') {
      delete dataNickName.phonenumber
    } else if (dataNickName.userName === '') {
      delete dataNickName.userName
    }
    console.log(dataNickName)

    CarryTokenRequest(servicePath.getListAdminAgent, dataNickName)
      .then(res => {
        console.log('查询结果', res.data)
        const data = res.data.data.records

        if (data.length === 0) {
          // 显示空白状态
          this.setState({
            isEmpty: true,
          })
        } else {
          // 关闭空白状态
          this.setState({
            isEmpty: false,
          })
        }
        this.setState({
          records: data,
          dataLength: res.data.data.records.length,
          searchData: dataNickName,
          total: res.data.data.total,
          popUp: !this.state.popUp,
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  // 跳转到-新增代理人-页面
  handleToAddagent = () => {
    Taro.navigateTo({
      url: '/admin/addagent/addagent',
    })
  }

  // 跳转到-个人详情-页面
  handleToEditAgent = userId => () => {
    console.log(userId)
    Taro.navigateTo({
      url: `/admin/updateagent/updateagent?uid=${userId}`,
    })
  }

  // 弹出层控制
  handlePopUp = () => {
    this.setState({
      popUp: !this.state.popUp,
    })
  }

  render() {
    let selectLevel = 0
    this.state.levelList.forEach((item, index) => {
      if (item.level === this.state.levelId) {
        selectLevel = index
      }
    })

    return (
      <View id="addagent">
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
                    name="userName"
                    placeholder="昵称"
                    className="search-condition"
                  />
                  <Input
                    type="text"
                    name="phonenumber"
                    placeholder="手机号码"
                    className="search-condition"
                  />
                  <Button className="search-condition" id="search-btn">
                    <img src={searchIcon} />
                    <span>查询</span>
                  </Button>
                </View>
              </Form>
            </View>
            {/* 分类 */}
            <View className="options">
              <View className="button-item">
                <Button className="button-box" onClick={this.handleToAddagent}>
                  <Image src={addAgent} className="button-img" />
                </Button>
                <Text className="button-name">新增代理人</Text>
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

          {/* 详细信息 */}
          <View className="detail">
            {this.state.records.map(item => {
              return (
                <View className="detail-items" onClick={this.handleToEditAgent(item.userId)}>
                  {/* 头像头衔 */}
                  <View className="avatars">
                    <img src={item.avatar} className="avatar"></img>
                    <View className="rank">{item.levelName}</View>
                  </View>
                  {/* 个人信息 */}
                  <View className="informations">
                    <p>昵称：{item.userName}</p>
                    <p>账号：{item.phonenumber}</p>
                    <p>新增时间：{item.updateTime}</p>
                  </View>
                  {/* 详细信息按钮 */}
                  <View className="detail-btn">
                    <Button className="com-btn"></Button>
                  </View>
                </View>
              )
            })}
            {this.state.isEmpty ? (
              <CommonEmpty></CommonEmpty>
            ) : null || this.state.dataLength === this.state.total ? (
              <Text className="bottomTip">-已经没有数据了-</Text>
            ) : null}
          </View>
        </View>
      </View>
    )
  }
}
