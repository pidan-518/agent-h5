
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Input,} from '@tarojs/components'
import './agentinfo.less'
import { AtToast } from 'taro-ui'
// icon图标
import search from '../../static/scattered/search.png'
//请求
import { CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';
//组件
import "taro-ui/dist/style/components/toast.scss";
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty'

export default class agentinfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      noMoreData : false,//到底显示
      num: null,//级别数
      isOpened:false,
      pageNo :1,//请求页数
      pages :1,//总页数
      loading : false,//上拉加载动画
      number: null,//未审核数量
      isAudit: 0,//是否有审核权限
      levelitem: '',//级别项
      text: true//头部导航栏是否下拉
    }
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidHide() { }
  config = {
    navigationBarTitleText: '管理后台'
  }
  componentWillMount() { }

  componentDidMount() { 
    this.postList()
  }
  componentWillUnmount() { }

  componentDidShow() {
    
  }
  postList = (params = {}) => {	
    CarryTokenRequest(apiUrl.selectAgentUserList, {
      current: this.state.pageNo, len: 10,
      ...params
    })
      .then(response => {
        const newList = response.data.data.records
       
        console.log(response)
        this.limit = true
        if (newList.length) {
          this.setState(prevState => {
            return {
              list: [...prevState.list, ...newList], 
              pageNo:response.data.data.current+1,
              pages:response.data.data.pages,
              loading:false
            };
          });
        }
      })
  }


  //级别显示与隐藏
  _levelFocused = -1;
  onFocus = () => {
    this._levelFocused = 0;
  }
  handleClick() {
    if (this._levelFocused === 1) {
      this.levelSelector.vnode.dom.blur();
    } else {
      this._levelFocused = 1;
    }
  }
  //取出级别值
  onLevelSelect = (item, key) => this.setState({ levelitem: item, num: key });

  //搜索
  search = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.nicknameInput.value == null ? this.nickname = null : this.nickname = this.nicknameInput.value,
    this.phoneNumberInput.value == null ? this.phoneNumber = null : this.phoneNumber = this.phoneNumberInput.value
    this.postList({
      userName: this.nickname,
      phonenumber: this.phoneNumber,
      agentLevelId: this.state.num,
      current: 1
    })
    console.log(this.nickname, this.phoneNumber, this.state.num);
    this.setState({ list: [] })
  }
  
  //详细信息跳转
  gotodata(userId) {
    Taro.navigateTo({
      url: `/admin/detaInfo/detaInfo?userId=${userId}`
    })
  }
  //上拉加载
  onReachBottom() {
    if (this.state.pageNo <= this.state.pages) {
      
      this.setState({loading :true},()=>{this.postList({
        userName: this.nickname,
        phonenumber: this.phoneNumber,
        agentLevelId: this.state.num,
      })})
      
    }else{
      this.setState({noMoreData : true}) 
    }
  }
 
  navClick = () => {
    this.state.text ?
      this.setState({
        text: false
      }) : this.setState({
        text: true
      })
  }

  //手机号输入判断
  blurCheck = (e) => {
    const { value } = e.target;
    const reg = /^(0|86|17951)?(13[0-9]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9]|14[579])[0-9]{8}$/;
    const regHK = /^([5|6|8|9])\d{7}$/
    console.log(value,reg.test(value),regHK.test(value))
    if (((reg.test(value) || regHK.test(value)) && value.length < 12) || value === '') {
      return
    }else{
      setTimeout(() => {
        this.setState({ isOpened:false})
      }, 2000);
      this.setState({
        isOpened: true
      })
    }
  }
  render() {
    return (
      <View className='agentinfo' /* style={{minHeight: '2000px'}} */>
        <View className='head'> 
        {!this.state.text ? <View className='dropDown'>
          <View className='search'>
            <Form className='form'>
              <View className='name headSearch'>
                <Input type='text' className='text' placeholder='昵称' ref={el => this.nicknameInput = el} />
              </View>
              <View className='number headSearch'>
                <Input className='text' type="tell" placeholder='手机号码' maxLength={11} value={this.state.value} onBlur={this.blurCheck} ref={el => this.phoneNumberInput = el} />
              </View>
              <View className='grade headSearch'>

                <View className='flexItem'>
                  <View
                    tabIndex="1"
                    className='level'
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    ref={el => (this.levelSelector = el)}
                    onClick={this.handleClick}
                  >
                    <Text>{this.state.levelitem || '级别'}</Text>
                    <View className='triangle'></View>
                    <View className='dropdown' style={{ display: this.state.display }}>
                      <ul className='dropdownList'>
                        {/* {this.level.map((item,idx)=>{
                        return <li className='levelName' key={idx} onClick={() => this.onLevelSelect(item,idx)}>{item}</li>
                      })}  */}
                        <li onClick={() => this.onLevelSelect('电商达人', 6)}>电商达人</li>
                        <li onClick={() => this.onLevelSelect('网红店长', 5)}>网红店长</li>
                        <li onClick={() => this.onLevelSelect('业务经理', 4)}>业务经理</li>
                        <li onClick={() => this.onLevelSelect('区域经理', 3)}>区域经理</li>
                        <li onClick={() => this.onLevelSelect('业务总监', 2)}>业务总监</li>
                        <li onClick={() => this.onLevelSelect('区域总监', 1)}>区域总监</li>
                      </ul>
                    </View>
                  </View>
                </View>
              </View>
              <View className='formSearch' onClick={this.search}>
                <img src={search} className='searchimg' alt=""/>
              </View>
            </Form>
          </View>
        </View> : null}
        <View className='downControl' onClick={this.navClick}>
          <View className='text' > {this.state.text ? <span>下拉查看更多信息</span> : null} </View>
          <View className={this.state.text ? 'icon' : " icon rotate"} >
            <img className='iconimg' src={require('./static/down.png')} alt="" />
            <img className='iconimg' src={require('./static/down.png')} alt="" />
          </View>
        </View>
        </View>
       
        {!this.state.text ? <View className='mask' onClick={this.navClick}></View>:null}
        <View className='content'>
           {this.state.list.length != 0 ? (this.state.list.map((item) => (
          <View className='conItem' onClick={() => this.gotodata(item.userId)}>
            <View className='itemLeft'>
              <View className='avatar'>
                <img src={item.avatar} alt="" />
                <p>{item.levelName}</p>
              </View>
              <View className='info'>
                <p>昵称: {item.userName}</p>
                <p>姓名:{item.realName}</p>
                <p>手机号码：{item.phonenumber}</p>
                <p>注册时间：{item.createTime.split(' ')[0]}</p>
                <p>升级时间：{item.degradationDate.split(' ')[0]}</p>
              </View>
            </View>
            <View className='itemRight' >
              <img src={require('./static/goto.png')} alt=""/>
            </View>
          </View>
        ))):(<CommonEmpty/>)
          }
        <AtToast isOpened={this.state.isOpened} text="您输入的手机号码有误请重新输入" ></AtToast>
        {this.state.loading == true 
        ? <View className='load-more'>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span></View>
        : ''}
        <View className={this.state.noMoreData ? 'block' : 'hid'} >--没有更多了--</View>
        </View>
      </View>
    )
  }
}
