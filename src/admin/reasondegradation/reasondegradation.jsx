import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import './reasondegradation.less'
import dele from '../../static/examPart/downReason/delete.png'
import evaluate from '../../static/examPart/downReason/evaluate.png'
import { AtModal, AtInput, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import { postRequest, CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';
import "taro-ui/dist/style/components/modal.scss"
export default class reasondegradation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      isOpened1: false,
      isOpened2: false,
      activeIdx: ''
    }
  }
  config = {
    navigationBarTitleText: '降级原因'
  }
  componentWillMount() { }

  componentDidMount() {
    this.postList();
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  postList = () => {
    CarryTokenRequest(apiUrl.selectList, {})
      .then(response => {
        this.setState({ list: response.data.data });
        // console.log(response.data.data)
      })
  }

  cencelclick = (idx) => {
    const { list, activeIdx } = this.state;
    this.setState({ isOpened1: true, activeIdx: idx })
  }
  addclick = idx => {
    this.setState({ isOpened2: true, activeIdx: idx });
  }
  //删除取消
  handleCancelDelete = () => this.setState({ isOpened1: false });
  //修改取消
  handleCancelModify = () => {
    this.modifyReason = '';
    this.setState({ isOpened2: false });
  };
  //修改确认
  handleConfirmModify = () => {
    const { list, activeIdx } = this.state;
    CarryTokenRequest(apiUrl.update, { contentReason: this.modifyReason, downgradeId: list[activeIdx].downgradeId })
      .then(response => {
        if (response) {
          this.postList();
        }
      })
    // list.splice(activeIdx, 1, this.modifyReason);
    this.setState({ isOpened2: false });
  };
  //删除确认
  handleConfirm = () => {
    this.postdelete()
  }
  onModifyReasonInput = value => { this.modifyReason = value }

  postdelete = () => {
    const { list, activeIdx } = this.state;
    CarryTokenRequest(apiUrl.delete, { downgradeId: list[activeIdx].downgradeId })
      .then(response => {
        if (response) {
          // const {list, activeIdx} = this.state;
          // list.splice(activeIdx, 1);
          this.setState({ list, isOpened1: false });;
          // console.log( response.data)
          this.postList()
        }
      })
  }
  render() {
    const { activeIdx, isOpened1, isOpened2, list } = this.state;
    return (
      <View className='downSet'>
        <View className='set'>
          <ul>
            {list.map((item, idx) => {
              return <li key={item} >
                <p className='listItem'>{item.contentReason}</p>
                <View className='itemRight'>
                  <span onClick={() => this.cencelclick(idx)}><img src={dele} /></span>
                  <span onClick={() => this.addclick(idx)}> <img src={evaluate} /></span>
                </View>
              </li>
            })}
          </ul>
        </View>
        <View className='delet'>
          <AtModal
            isOpened={isOpened1}
            cancelText='取消'
            confirmText='确认'
            closeOnClickOverlay={false}
            onClose={this.handleClose}
          >
            <AtModalContent>
              <Text>{`“${(list[activeIdx] || '').contentReason}” 删除后，该原因下代理人降级原因将会发生变动，您确定删除该条件吗？`}</Text>
            </AtModalContent>
            <AtModalAction>
              <Button onClick={this.handleCancelDelete}>取消</Button>
              <Button onClick={this.handleConfirm}>确认</Button>
            </AtModalAction>
          </AtModal>
        </View>
        <View className='modify'>
          <AtModal
            isOpened={isOpened2}
            closeOnClickOverlay={false}
          >
            <AtModalHeader>修改原因</AtModalHeader>
            <AtModalContent>
              <AtInput value={(list[activeIdx] || '').contentReason} onChange={this.onModifyReasonInput} />
            </AtModalContent>
            <AtModalAction>
              <Button onClick={this.handleCancelModify}>取消</Button>
              <Button onClick={this.handleConfirmModify}>确认</Button>
            </AtModalAction>
          </AtModal>
        </View>
      </View>
    )
  }
}