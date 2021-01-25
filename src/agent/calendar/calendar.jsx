import { AtCalendar } from "taro-ui"
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './calendar.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import globalData from '../../common/util/global-data';


export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeList:[],
      num: 0,
      currentDate:'', // 第一个显示的时间
      minDate: '', //最小的可选时间
      validDates: '',
      time: '',
      date: '',
      allList: [],
    }
  }
  componentWillMount () { }

  componentDidMount () { 
    Taro.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      Taro.hideLoading()
    }, 1000)
    let time = new Date()
    this.setState({
      minDate:time.toLocaleDateString()
    })
    const year = new Date().getFullYear() // 年
    let month = new Date().getMonth() + 1 // 月
    // const day = time.toLocaleDateString().split('/')[1]<10?`0${time.toLocaleDateString().split('/')[1]}`:time.toLocaleDateString().split('/')[1]
    // time = time.toLocaleDateString().split('/')[0]+'-'+day
    month = month<10?`0${month}`:month
    time = year+'-'+month
    console.log('time',time);
    this.getTeacherTime(time)
  }

  componentWillUnmount () { }

  componentDidShow () { 
    const time = window.sessionStorage.getItem('time')
    console.log(time);
    if(time==='0'){
      window.location.reload()
    }
    window.sessionStorage.setItem('time',1)
  }

  componentDidHide () {
    window.sessionStorage.setItem('time',0)
  }
  onDayClick=(e)=> {
    console.log('点击日期',e);
    this.setState({
      date:e.value
    })
    this.getTeacherTime(e.value)
    Taro.showLoading({
      title: '加载中',
    })
  }
  onMonthChange=(e)=>{
    console.log('月份改变',e);
    this.setState({
      timeList: [],
    })
    const month = e.split('-')[0]+'-'+e.split('-')[1]
    this.getTeacherTime(month)
  }
  getSelectTime=(e,index)=>{ // 选择时间
    const list = this.state.timeList
    console.log(list[index]);
    list[index].select = !list[index].select
    const allList = this.state.allList
    this.state.allList.forEach((item,index)=>{
      if(item.date==this.state.date){
        allList[index].time = list
      }
    })
    this.setState({
      timeList: list,
      allList,
    })
    if(list[index].select){
      this.getTeacherInTime(this.state.date+' '+e.time+':00', index)
    }
  }
  getSubmit=()=>{ // 提交预约
    let subList = []
    console.log(this.state.allList);
    this.state.allList.forEach((item,index)=>{
      item.time.forEach(items=>{
        if(items.select){
          subList.push({
            teacherId:this.$router.params.teacherId,
            startTime:item.date+' '+items.time+':00'
          })
        }
      })
    })
    if(subList.length===0){
      Taro.showToast({
        title: '您还没有选择时间噢',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!globalData.throttle()) return
    this.getTeacherSubmit(subList)
  }
  getTeacherSubmit(subList) {
    CarryTokenRequest(servicePath.getTeacherSubmit,subList)
    .then(res=>{
      console.log('提交预约',res);
      if(res.data.code==0){
        Taro.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(() => {
          window.history.back(-1)
        }, 3000);
      }
    })
    .catch(err=>{
      console.log('提交预约接口异常--',err);
    })
  }
  getTeacherInTime(startTime,index){
    CarryTokenRequest(servicePath.getTeacherInTime,{startTime})
    .then(res=>{
      if(res.data.data.createTime){
        Taro.showToast({
          title: '您已在当前时间预约过啦~',
          icon: 'none',
          duration: 2000
        })
        this.getSelectTime('',index)
      }
      
      console.log('检查当前时间段是否已预约',res);
    })
    .catch(err=>{
      console.log('检查当前时间段是否已预约接口异常--',err);
    })
  }
  getTeacherTime(startTime) {
    CarryTokenRequest(servicePath.getTeacherTime,{
      teacherId:this.$router.params.teacherId,
      startTime,
    })
    .then(res=>{
      console.log('时间列表',res);
      Taro.hideLoading()
      const leng = startTime.split('-')
      if(leng.length==2){ // 取有效时间
        let validDatesList = res.data.data
        let newList = []
        let newAllList = []
        validDatesList.forEach(item=>{
          newList.push({value:item.startTime.split(' ')[0].replace(/-/g,'/')})
          const timeList = item.timeFrame.split('-')
          let newTime = []
          timeList.forEach(itemN=>{
            newTime.push({select:false,time:itemN})
          })
          newAllList.push({date:item.startTime.split(' ')[0],time:newTime})
        })
        this.setState({
          validDates:newList,
          currentDate:newList[0].value,
          allList: newAllList
        })
      }
      if(leng.length==2){ // 第一次请求当月所有日期，第二次请求第一个有效日的时间段（也可以不请求。。。稍后改）
        const time = res.data.data[0].startTime.split(' ')[0]
        this.getTeacherTime(time)
        return
      }
      let newTimeList = []
      const year = new Date().getFullYear() // 年
      const month = new Date().getMonth() + 1 // 月
      const date = new Date().getDate() // 日
      let hour = new Date().getHours()
      let minu = new Date().getMinutes()
      const start = startTime.split('-')
      console.log(this.state.allList,'this.state.allList');
      this.state.allList.forEach((item,index)=>{
        if(item.date==startTime){
          item.time.forEach(items=>{
            if(start[0]==year&&start[1]==month&&start[2]==date){ // 判断比当前时间大
              if(minu+20>=60){
                minu = (minu + 20 -60)
                hour = hour + 1
              }
              if(Number(items.time.split(':')[0])==hour&&Number(items.time.split(':')[1]-20>minu)){
                console.log('item1',item,minu);
                newTimeList.push({select:items.select,time:items.time})
              }
              if(Number(items.time.split(':')[0])>hour){
                console.log('item2',item,minu);
                newTimeList.push({select:items.select,time:items.time})
              }
            } else{
              newTimeList.push({select:items.select,time:items.time})
            }
          })
        }
      })
      this.setState({
        currentDate:this.state.validDates[0].value,
        timeList: newTimeList,
        date:res.data.data[0].startTime.split(' ')[0],
      })
    })
    .catch(err=>{
      console.log('时间列表接口异常--',err);
    })
  }
  config = {
    navigationBarTitleText: '选择时间'
  }

  render () {
    const { timeList,minDate,validDates,currentDate,time } = this.state
    return (
      <View className='calendar'>
        <AtCalendar onDayClick={this.onDayClick} onMonthChange={this.onMonthChange} minDate={minDate} validDates={validDates} currentDate={currentDate}/>
        {
          timeList.length==0?<View className="time-no">当日无时间段可约</View>:<View className="time">
          {
            timeList.map((item,index)=>{
              return <View className={item.select?'item on':'item'} onClick={this.getSelectTime.bind(this,item,index)}>
              {item.time}
              <View className="text">可约</View>
              </View>
            })
          }
        </View>
        }
        
        <View className="bg" onClick={this.getSubmit}>
          <View className="submit">提交预约</View>
        </View>
      </View>
    )
  }
}
