import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form, Input } from '@tarojs/components'
import './index.less'
import { AtToast } from 'taro-ui'
// icon图标
import agent from './static/agent.png'//代理人
import finance from './static/finance.png'//财务
import team from './static/team.png'//团队
import lecturer from './static/lecturer.png'//讲师
import news from './static/news.png'//消息
import appointment from './static/appointment.png'//预约
// import jurisdiction from './static/jurisdiction.png'//权限
import examine from './static/jurisdiction.png'//审核
import marketing from './static/marketing.png'//海报
import search from '../../static/scattered/search.png'
import down from './static/dropDown.png'
//请求
import { CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';
//组件
import "taro-ui/dist/style/components/toast.scss";
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty'
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navlist: [{ text: '代理人信息', img: agent, to: '/admin/agentinfo/agentinfo' },
      { text: '财务', img: finance, to: '/admin/financialstatement/financialstatement' },
      { text: '团队管理', img: team, to: '/admin/agentmanage/agentmanage' },
      { text: '系统消息', img: news, to: '/agent/message/message?type=admin' },
      { text: '讲师', img: lecturer, to: '/admin/lecturer/lecturer' },
      { text: '课程预约', img: appointment, to: '/admin/reservelist/reservelist' },
      // { text: '管理权限', img: jurisdiction, to: '/admin/permissions/permissions' },
      { text: '营销', img: marketing, to: '/admin/marketing/marketing' },
      { text: '审核', img: examine, to: '/admin/examiner/examiner', remind: false, examine: false },
      ],
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
      text: false//头部导航栏是否下拉
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
  componentDidShow(){
    console.log('1236416214465')
    location.reload()
  }
  componentDidShow() {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (userInfo.isAudit == 1) {
      this.setState({ isAudit: userInfo.isAudit })
      this.postCount()
    } else {
      this.setState(
        prevState => {
          const navlist = [...prevState.navlist]
          navlist[navlist.length - 1].examine = true
          // list.pop()
          return {
            navlist: navlist
          }
        }
      )
    }
  }
  postList = (params = {}) => {
    // this.ended = true;
    // if(!this.limit){return;}
    // this.limit = false;	
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
    // this.nicknameInput.value == null ? this.nickname = null : this.nickname = this.nicknameInput.value,
    // this.phoneNumberInput.value == null ? this.phoneNumber = null : this.phoneNumber = this.phoneNumberInput.value
      this.postList({
        userName: this.state.nickname,
        phonenumber: this.state.phoneNumber,
        agentLevelId: this.state.num,
        current: 1
      })
      console.log(this.state.nickname, this.state.phoneNumber, this.state.num);
    
   
    this.setState({ list: [] })
  }
  
  goto(url) {
    Taro.navigateTo({
      url: url
    })
    this.setState({
      text: !this.state.text
    }) 
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
  //未审核数量
  postCount = () => {
    CarryTokenRequest(apiUrl.getCount)
      .then(response => {
        if (response.data.data) {
          this.setState(
            prevState => {
              const navlist = [...prevState.navlist]
              navlist[navlist.length - 1].remind = true
              return {
                navlist: navlist,
                number: response.data.data
              }
            }
          )
        }
      })
  }
  navClick = () => {
      this.setState({
        text: !this.state.text
      }) 
  }

  //手机号输入判断
  blurCheck = (e) => {
    console.log( e.target.value,'32525')
    const  value  = e.target.value;
    const reg = /^(0|86|17951)?(13[0-9]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9]|14[579])[0-9]{8}$/;
    const regHK = /^([5|6|8|9])\d{7}$/
    console.log(value,reg.test(value),regHK.test(value))
    if(value == ''){
      this.setState({
        phoneNumber:null,
      })
    }else{
      if (reg.test(value) || regHK.test(value)) {
        this.setState({
          phoneNumber:Number(value),
        })
        console.log(value)
      // return
      }else{
        setTimeout(() => {
          this.setState({ isOpened:false})
        }, 2000);
        this.setState({
          isOpened: true
        })
      }
    }
  }
  nameBlur=(e)=>{
    console.log(e.target.value,'nameBlur')
    e.target.value == ''?
    this.setState({
      nickname:null,
    }):
    this.setState({
      nickname:e.target.value,
    })
  }
  render() {
    const remi = this.state.navlist[this.state.navlist.length - 1].examine ? 'mangeLi ' : 'mangeLi rem'
    return (
      <View className='index' /* style={{minHeight: '2000px'}} */>
        <View className={this.state.text ? 'head' : 'head toggle'}> 
        {/*!this.state.text */ true ? <View className='dropDown' >
          <View className='search'>
            <Form className='form'>
              <View className='name headSearch'>
                <Input type='text' className='text' placeholder='昵称' onBlur={this.nameBlur} />
              </View>
              <View className='number headSearch'>
                <Input className='text' type="tell" placeholder='手机号码' maxLength={11} onBlur={this.blurCheck} />
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
                    <View className='triangle'>
                      <img src={down} alt=""/>
                    </View>
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
          <View className='headNav'>
            <View className={this.state.navlist[this.state.navlist.length - 1].examine ? 'rem1 remu' : 'remu'}>
              {this.state.navlist.map((item, idx) => {
                return (item.examine ? null : <View className={item.remind ? remi : remi} key={idx} onClick={() => this.goto(item.to)}>
                  <View className='remind' hidden={!item.remind}><span>{this.state.number}</span></View>
                  <View className='listItem' style={{ background: item.backgroundColor }}>
                    <img className='mangeimg' src={item.img} alt={item.text} />
                  </View>
                  <p>{item.text}</p>
                </View>)
              })}
            </View>
          </View>

        </View> : null}
        <View className='downControl' onClick={this.navClick}>
          <View className='text' > {!this.state.text ? <span>下拉查看更多信息</span> : null} </View>
          <View className={!this.state.text ? 'icon' : " icon rotate"} >
            <img className='iconimg' src={require('./static/down.png')} alt="" />
            <img className='iconimg' src={require('./static/down.png')} alt="" />
          </View>
        </View>
        </View>
       
        {this.state.text ? <View className='mask' onClick={this.navClick}></View>:null}
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
            <View className='itemRight' onClick={() => this.gotodata(item.userId)}>
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
