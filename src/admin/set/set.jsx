import Taro, { Component, onAppShow, } from '@tarojs/taro'
import { View, Text, Button, Input, Picker } from '@tarojs/components'
import './set.less'
import { CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';
import RegionPicker from '../../components/taro-region-picker'
import dropdown from '../../static/common/down.png'
import { AtToast } from "taro-ui"
import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/icon.scss";
export default class Set extends Component {
  state = {
    selectorChecked: null,
    list: {},
    isOpened:false,
    loading:false
  };
  selector = ['否','是'];
  config = {
    navigationBarTitleText: '设置'
  }
  form = {}
  userId = null;

  componentWillMount() { }

  componentDidMount() {
    const userId = this.$router.params
    this.userId = parseInt(userId.userId)
    this.postList(userId)
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  //地区选择
  onGetRegion(region) {
    // 参数region为选择的省市区
    this.form.region = region
  }

  //佣金余额
  // balanceCommission = e => this.form.Commission = e.target.value;
  balanceCommission = e =>{
    this.setState((prev)=>{
      return {
        isOpened:false,
        list: {
          ...prev.list,
          balanceCommission: e.target.value
        }
      }
    })
  }

  //冻结金额
  // frozenAmount = e => this.form.frozen = e.target.value;
  frozenAmount = e =>{
    this.setState((prev)=>{
      return {
        isOpened:false,
        list: {
          ...prev.list,
          frozenAmount: e.target.value
        }
      }
    })
  }
  
  //选项按钮
  onChangeSele = e => {
    this.setState({
      isOpened:false,
      selectorChecked: `${e.detail.value}`,
    });
  }

  showModal = () => this.setState({ modalVisible: true ,isOpened:false});
  handleConfirm = () => {
    console.log(this.userId)
    this.setState({ modalVisible: false, loading: true }, () => {
      // request(url.settings, this.form)
      // .then(response => {
      //     getInfo()
      //     .then((response) => {
      //         this.setState({ loading: false });
      //     })
      // })
      console.log(this.state.selectorChecked)
      CarryTokenRequest(apiUrl.updateAgentUserAdmin, {
        userId: this.userId,
        // userName: this.form.nickname,
        region: this.form.region,
        balanceCommission: +this.state.list.balanceCommission,
        frozenAmount: +this.state.list.frozenAmount,
        status: this.state.selectorChecked
      })
        .then(response => {
          this.setState({ loading: false });
          this.gotodata()
          console.log(response)
        })
    });
  };

  postList = () => {
    CarryTokenRequest(apiUrl.selectAgentUserDetail,
      { userId: this.userId })
      .then(response => {
        const list = response.data.data || {};
        this.setState({ list, selectorChecked: list.status });
      })
  }
  //返回详细信息页面
  gotodata = () => {
    Taro.navigateBack({
      delta: 1
    });
  }
//佣金余额输入验证
  blurCheckCommission = (e) => {
    const { value } = e.target;
    const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;		
    if ((reg.test(value)) || value === '') {
      return
    }else{
      setTimeout(() => {
        this.setState({ isOpened:false})
      }, 1000);
      this.setState((prev)=>{
        return{ 
          isOpened:true,
          list: {
          ...prev.list,
          balanceCommission:null 
        }}
      }) 
    }
  }
  //冻结金额输入验证
  blurCheckAmount = (e) => {
    const { value } = e.target;
    const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;		
    if ((reg.test(value)) || value === '') {
      return
    }else{
      setTimeout(() => {
        this.setState({ isOpened:false})
      }, 1000);
      this.setState((prev)=>{
        return{ 
          isOpened:true,
          list: {
          ...prev.list,
          frozenAmount: null, 
        }}
      }) 
    }
  }

  render() {
    const { list, selectorChecked } = this.state;
    return (
      <View className='box'>
        <View className='set'>
          <View className='setitem'>
            <Text >昵称</Text>:
            <Input value={list.userName} placeholder='昵称'  readonly="true" />
          </View >
          <View className='setitem'>
            <Text>姓名</Text>:
            <Input value={list.realName} placeholder='姓名' readonly="true" />
          </View>
          <View className='setitem'>
            <Text>手机号码</Text>:
            <Input value={list.phonenumber} placeholder='手机号' readonly="true" />
          </View>
          <View className='setitem'>
            <Text>地区选择</Text>:
            <RegionPicker  onGetRegion={this.onGetRegion.bind(this)} value={list.region} />
            {/* <img className='downImg' src={dropdown} /> */}
          </View>
          <View className='setitem'>
            <Text>佣金余额</Text>:
            <Input value={list.balanceCommission} placeholder='输入佣金金额'  onBlur={this.blurCheckCommission}  onChange={this.balanceCommission} readonly="true"/>
          </View>         
          <View className='setitem'>
            <Text>冻结金额</Text>:
            <Input value={list.frozenAmount} placeholder='输入冻结金额'  onBlur={this.blurCheckAmount} onChange={this.frozenAmount} />
          </View>
          <View className='setitem'>
            <Text>冻结账号</Text>: 
            <Picker mode='selector' className='choice' value={+selectorChecked} range={this.selector} onChange={this.onChangeSele}>
              <View className='picker'>
                {selectorChecked === '1' ? '是' : '否'}
              </View>
              <img className='downImg' src={dropdown} />
            </Picker>
          </View>
          <Button className='btn' onClick={this.showModal}>确定</Button>
        </View>
        <View className={this.state.modalVisible ? '' : 'hid'}>
          <View className='mask' onClick={() => this.setState({ modalVisible: false })}></View>
          <View className='warn'>
            <View className='content'>确定进行修改吗？</View>
            <View className='determine' onClick={this.handleConfirm}>确定</View>
          </View>
        </View>
        <AtToast isOpened={this.state.isOpened} text="您输入的格式有误请重新输入" ></AtToast>
        <AtToast isOpened={this.state.loading} text="修改中..."  status={'loading'} duration={0}></AtToast>  
      </View>
    )
  }
}
