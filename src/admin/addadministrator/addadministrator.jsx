import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Picker } from '@tarojs/components'
import './addadministrator.less'
export default class addadministrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: { userName: '111', 
      repeatPassword:'',
      passWord:'',
    },
      groupitem: '',
    }
    this.handleClick = this.handleClick.bind(this);
  }
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }
  config = {
    navigationBarTitleText: '添加管理员'
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
  //取出分组值
  onGroupSelect = (item, key) => this.setState({ groupitem: item, num: key });
  group = ['超级管理员', '财务', "运营", '客服']
  //账号格式判断
  bluraccountNumber = (e) => {
    const { value } = e.target;
    const reg = /^(0|86|17951)?(13[0-9]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9]|14[579])[0-9]{8}$/;
    const regHK =/^([5|6|8|9])\d{7}$/
    console.log(value,reg.test(value),regHK.test(value))
    if (((reg.test(value) || regHK.test(value)) && value.length < 12) || value === '') {
      this.setState((prev)=>{
        return {
          list: {
            ...prev.list,
            bluraccountNumber: e.target.value
          }
        }
      })
    }else{
      Taro.showToast({
        title: "请输入正确手机号",
        icon: "none",
        duration: 1500
      })  
    }
  }
  //获取账号
  // adminName = e =>{
  //   this.setState((prev)=>{
  //     return {
  //       list: {
  //         ...prev.list,
  //         adminName: e.target.value
  //       }
  //     }
  //   })
  // }
  //获取密码
  // passWord = e =>{
  //   this.setState((prev)=>{
  //     return {
  //       list: {
  //         ...prev.list,
  //         passWord: e.target.value
  //       }
  //     }
  //   })
  // }
  //获取重复密码
  // repeatPassword = e =>{
  //   this.setState((prev)=>{
  //     return {
  //       list: {
  //         ...prev.list,
  //         repeatPassword: e.target.value
  //       }
  //     }
  //   })
  // }
  //检测密码格式
  blurpassWord = (e) => {
    const { value } = e.target;
    // console.log(value)
    if (value.length >= 6 && value.length <=21 ||value === '') {
      this.setState((prev)=>{
        return {
          list: {
            ...prev.list,
            passWord:value
          }
        }
      },()=>{
        console.log(this.state.list.passWord)
      })
    }else{
      this.setState((prev)=>{
        return {
          list: {
            ...prev.list,
            passWord:''
          }
        }
      })
      Taro.showToast({
        title: "密码长度在6-21位",
        icon: "none",
        duration: 1500
      })  
    }
  }
  //检测重复密码
  blurrepeatPassword = (e) => {
    const { value } = e.target;
    console.log(value)
    if (value.length >= 6 && value.length <=21||value === '') {
      if(value){
        if(this.state.list.passWord == value){
          console.log(value)
          this.setState((prev)=>{
            return {
              list: {
                ...prev.list,
                repeatPassword:value
              }
            }
          })
        }else{
          console.log(this.repeatPassword)
          console.log(this.passWord)
          this.setState((prev)=>{
            return {
              list: {
                ...prev.list,
                repeatPassword:''
              }
            }
          })
          Taro.showToast({
            title: "重复密码与密码不等",
            icon: "none",
            duration: 1500
          })  
        }
      } return
    }else{
      Taro.showToast({
        title: "密码长度在6-21位",
        icon: "none",
        duration: 1500
      })  
    }
  }
  determine=()=>{
    if(this.state.list.repeatPassword&&this.state.list.passWord&&this.state.groupitem){
      if(this.state.list.repeatPassword==this.state.list.passWord){  
         // postList()
       
      }else{
        Taro.showToast({
          title: "两次密码输入不相同",
          icon: "none",
          duration: 1500
        })  
      }
    }else(
      console.log(this.state.list.repeatPassword),
      console.log(this.state.list.passWord),
      console.log(this.state.list.groupitem),
      Taro.showToast({
        title: "输入不能为空",
        icon: "none",
        duration: 1500
      })  
    )
  }
  render() {
    const { list } = this.state;
    return (
      <View className='addadministrator'>
        <View className='addForm'>
          <View className='additem'>
            <Text className='itemText'>管理员姓名：</Text>
            <input className='itemInput'  placeholder='管理员姓名' ref={el => this.adminName = el}  />
          </View >
          <View className='additem'>
            <Text className='itemText'>账号：</Text>
            <input className='itemInput'  placeholder='请输入手机号' onBlur={this.bluraccountNumber} ref={el => this.accountNumber = el}/>
          </View >
          <View className='additem'>
            <Text className='itemText'>密码：</Text>
            <input className='itemInput'  placeholder='密码长度在6-21位' type="password"  value={this.state.list.passWord} ref={el => this.passWord = el} onBlur={this.blurpassWord} />
          </View >
          <View className='additem'>
            <Text className='itemText'>重复密码：</Text>
            <input className='itemInput'  placeholder='密码长度在6-21位' type="password" value={this.state.list.repeatPassword} ref={el => this.repeatPassword = el} onBlur={this.blurrepeatPassword}/>
          </View >
          <View className='additem'>
           <Text className='itemText'>所属分组：</Text>
            <View
              tabIndex="1"
              className='group'
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              ref={el => (this.levelSelector = el)}
              onClick={this.handleClick}
            >
              <Text>{this.state.groupitem || '请选择'}</Text><img src={require('../../static/adminright/dropdown.png')} alt="" />
              <View className='dropdown' >
                <ul className='dropdownList'>
                  {this.group.map((item, idx) => {
                    return <li className='groupName' key={idx} onClick={() => this.onGroupSelect(item, idx)}>{item}</li>
                  })}
                </ul>
              </View>
            </View>
          </View>
        </View>
        <View className='addButtom'>
          <Button className='btn' onClick={this.determine}>确定</Button>
        </View>
      </View>
    )
  }
}