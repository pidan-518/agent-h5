import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './lecturerdetails.less'
import '../../common/globalstyle.less';
import { CarryTokenRequest } from '../../common/util/request';
import { AtCalendar } from "taro-ui";
import servicePath from '../../common/util/api/apiUrl';

// 讲师详情
export default class LecturerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lecturerDetails: {}, // 讲师详情数据
      isShow: true, // 显示隐藏日历组件
      reserveData: [], // 预约时间的数据
      reserveTimes: [
        {
          timeId: 1,
          checkout: false,
          timeText: "9:00"
        },
        {
          timeId: 2,
          checkout: false,
          timeText: "9:30"
        },
        {
          timeId: 3,
          checkout: false,
          timeText: "10:00"
        },
        {
          timeId: 4,
          checkout: false,
          timeText: "10:30"
        },
        {
          timeId: 5,
          checkout: false,
          timeText: "11:00"
        },
        {
          timeId: 6,
          checkout: false,
          timeText: "11:30"
        },
        {
          timeId: 7,
          checkout: false,
          timeText: "12:00"
        },
        {
          timeId: 8,
          checkout: false,
          timeText: "14:00"
        },
        {
          timeId: 9,
          checkout: false,
          timeText: "14:30"
        },
        {
          timeId: 10,
          checkout: false,
          timeText: "15:00"
        },
        {
          timeId: 11,
          checkout: false,
          timeText: "15:30"
        },
        {
          timeId: 12,
          checkout: false,
          timeText: "16:00"
        },
        {
          timeId: 13,
          checkout: false,
          timeText: "16:30"
        },
        {
          timeId: 14,
          checkout: false,
          timeText: "17:00"
        },
        {
          timeId: 15,
          checkout: false,
          timeText: "17:30"
        },
        {
          timeId: 16,
          checkout: false,
          timeText: "18:00"
        },
      ], // 当天可预约时间数组
      startTimes: [], // 这个月可预约的日期
    }
  }

  // 下一步点击事件
  nextStepClick = () => {
    this.setState({
      isShow: false
    })
  }

  // 日历日期点击事件
  onDayClick = ({ value }) => {
    console.log(value);
    this.getSysCourseTimeSelectAll(value);
  }

  // 日历月份改变时触发事件
  onMonthChange = (value) => {
    let { reserveTimes } = this.state;
    reserveTimes.map(item => {
      item.checkout = false
      return item;
    })
    this.setState({
      reserveTimes
    }, () => {
      this.getSysCourseTimeSelectAll(value.slice(0, 7));
    })
  }

  // 选中日历日期事件
  handleSelectDate = ({ value }) => {
    const { reserveData } = this.state;
    let times = reserveData.filter(item => item.startTime.substring(0, 10) === value.start);
    let reserveTimes = [];
    if (times.length !== 0) {
      times[0].timeFrame.forEach((item, index) => {
        reserveTimes.push({ checkout: false, timeId: index, timeText: item });
      });
    }
    this.setState({
      reserveTimes
    });
  }

  // 可预约时间点击事件
  handleReserveTimeClick = (times) => {
    const { reserveTimes } = this.state;
    reserveTimes.map(item => {
      if (item.timeId === times.timeId) {
        if (item.checkout) {
          item.checkout = false;
        } else {
          item.checkout = true;
        }
      }
      return item;
    })
    this.setState({
      reserveTimes
    })
  }

  // 查看讲师基本信息
  getSysTeacherInfoGetById() {
    CarryTokenRequest(servicePath.getSysTeacherInfoGetById, {
      teacherId: this.$router.params.teacherId
    })
      .then(res => {
        console.log("查询讲师基本信息成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            lecturerDetails: res.data.data
          })
        }
      })
      .catch(err => {
        console.log("查询讲师基本信息失败", err);
      })
  }

  // 查询指定月份发布的记录
  getSysCourseTimeSelectAll(month = this.getNowFormatDate(1)) {
    CarryTokenRequest(servicePath.getSysCourseTimeSelectAll, {
      "teacherId": this.$router.params.teacherId,
      "startTime": month
    })
      .then(res => {
        console.log("查询指定月份发布记录成功", res.data);
        if (res.data.code === 0) {
          let startTimes = []; // 当月可预约日期
          let timeFrames = []; // 当天可预约时间段
          let reserveTimes = []; // 经过修改的时间段数据
          let reserveData = res.data.data.map((item, index) => {
            startTimes.push({value: item.startTime});
            item.timeFrame = item.timeFrame.split("-");
            if (item.startTime.substring(0, 10) === this.getNowFormatDate()) {
              timeFrames = item.timeFrame;
            }
            return item;
          });
          timeFrames.forEach((item, index) => {
            reserveTimes.push({ timeId: index, timeText: item });
          })
          this.setState({
            startTimes,
            reserveData,
            reserveTimes
          });
        }
      })
      .catch(err => {
        console.log("查询指定月份发布记录失败", err);
      });
  }

  // 获取年月日
  getNowFormatDate(obtainMonth = "") {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    if ( obtainMonth === 1) {
      return year + seperator1 + month;
    }
    return currentdate;
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getSysTeacherInfoGetById();
    this.getSysCourseTimeSelectAll();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '讲师详情'
  }

  render () {
    const { lecturerDetails, isShow, reserveTimes, startTimes } = this.state
    return (
      <View>
        <View id='lecturer-details'>
          <View className="lecturer-img">
            <img src={lecturerDetails.teacherImg} alt=""/>
          </View>
          <View className="lecturer-info">
            <View className="lecturer-name">{lecturerDetails.teacherName}</View>
            <View className="lecturer-detail-info">
              {lecturerDetails.personalProfile}
            </View>
            <View className="course">
              <View className="course-title">主讲课程</View>
              <View className="course-list">
                {lecturerDetails.courseContent}
              </View>
            </View>
          </View>
          <View className="calendar-box">
            <View className="calender-com">
              <AtCalendar
                isSwiper={false}
                marks={startTimes}
                name="reserveTime"
                onMonthChange={this.onMonthChange}
                onSelectDate={this.handleSelectDate}
              />
            </View>
            <View className="reserve-time-list">
              {
                reserveTimes.map(item =>
                  <View 
                    className='list-item'
                    key={item.timeId} 
                    onClick={this.handleReserveTimeClick.bind(this, item)}
                  >
                    <View>{item.timeText}</View>
                  </View>
                )
              }
            </View>
          </View>
        </View>
      </View>
    )
  }
}
