import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './message.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

export default class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageList:[],
      current:1,
      pages: 1,
    }
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () {
    if(this.$router.params.type=='agent'){
      this.getagentMessageList(1)
    } else {
      this.getagentMessageAdminList(1)
    }
   }

  componentDidHide () { }
  onReachBottom() { // 上拉加载
    console.log('到底了',this.state.current);
    if (this.state.current === this.state.pages) {
      console.log("进入");
    } else if (this.state.pages !== 0) {
      if(this.$router.params.type=='agent'){
        this.getagentMessageList(this.state.current + 1)
      } else {
        this.getagentMessageAdminList(this.state.current + 1)
      }
    }
  }
  getagentMessageList(current){ // 获取消息接口
    CarryTokenRequest(servicePath.getagentMessageList,{len:12,current})
    .then(res=>{
      console.log('消息列表',res);
      console.log('111',this.state.messageList);
      this.setState({
        messageList: [...this.state.messageList,...res.data.data.records],
        current:res.data.data.current,
        pages:res.data.data.pages,
      })
      console.log('222',this.state.messageList);
    })
    .catch(err=>{
      console.log('消息列表接口异常--',err);
    })
  }
  getagentMessageAdminList(current){
    CarryTokenRequest(servicePath.getagentMessageAdminList,{len:12,current})
    .then(res=>{
      console.log('消息列表',res);
      console.log('111',this.state.messageList);
      this.setState({
        messageList: [...this.state.messageList,...res.data.data.records],
        current:res.data.data.current,
        pages:res.data.data.pages,
      })
      console.log('222',this.state.messageList);
    })
    .catch(err=>{
      console.log('消息列表接口异常--',err);
    })
  }
  getagentMessageStatus(messageId) {
    CarryTokenRequest(servicePath.getagentMessageStatus,{messageId})
    .then(res=>{
      console.log('更新消息',res);
      
    })
    .catch(err=>{
      console.log('消息列表接口异常--',err);
    })
  }
  getShowModal=(e, index)=> {
    console.log('eeee',e);
    Taro.showModal({
      title: e.title,
      content: e.content,
      showCancel: false,
      confirmColor:'#6F411C',
      success: (res)=> {
        if (res.confirm) {
          console.log('用户点击确定')
          const newArr = this.state.messageList
          newArr[index].readState = 1
          this.setState({
            messageList: newArr
          })
          this.getagentMessageStatus(e.messageId)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
  config = {
    navigationBarTitleText: '消息'
  }

  render () {
    const { messageList,current,pages } = this.state
    return (
      <View className='message'>
        {
          messageList.map((item,index)=>{
          return <View key={index}  className={item.readState==1?'item':'item on'} onClick={this.getShowModal.bind(this,item,index)}>
            <View className='text'>
            {item.content}
            </View>
            <View className='time'>
              <View>
              {item.createTime.split(' ')[1]}
              </View>
              <View>
              {item.createTime.split(' ')[0]}
              </View>
            </View>
          </View>
          })
        }
        {
          current==pages||pages==0?<View className="no-more">-没有更多啦-</View>:''
        }
      </View>
    )
  }
}
