import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import "./newuser.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest, postRequest } from "../../common/util/request";
import apiUrl from "../../common/util/api/apiUrl";
// components
import servicePath from "../../common/util/api/apiUrl";
import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";

export default class newuser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [], //  新人奖金数据
      nowDayOfWeek: "", //今天是本周的第几天
      nowDay: "", //当前日
      nowMonth: "", //当前月
      nowYear: "", //当前年
      selectList: ["全部", "周", "月", "季度"], //底部tabbar
      conList: [1, 2, 3, 4, 5, 6], //内容循环列表
      btnState: 0, //按钮下标
      startTime: "", //开始时间
      endTime: "", //结束时间
      current: 1, //当前页
      pages: 1, //总页数
      selectIn: -1,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    setTimeout(() => {
      this.getInitdate();
      this.getSelectTab(0);
    }, 300);
    this.getInitdate();
    // this.selectNewStaffBonus(1)
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
  //  初始化时间
  getInitdate() {
    let now = new Date();
    let nowDayOfWeek = now.getDay(); //今天是本周的第几天
    let nowDay = now.getDate(); //当前日
    let nowMonth = now.getMonth(); //当前月
    let nowYear = now.getYear(); //当前年
    nowYear += nowYear < 2000 ? 1900 : 0;
    this.setState({
      nowDayOfWeek,
      nowDay,
      nowMonth,
      nowYear,
    });
    console.log(this.state);
    this.getWeekStartDate();
    this.getWeekEndDate();
  }

  //   格式化日期：yyyy-MM-dd
  formatDate(date) {
    console.log(date);
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();

    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    console.log(myyear + "-" + mymonth + "-" + myweekday + " 23:59:59");
    return myyear + "-" + mymonth + "-" + myweekday;
  }

  //   获得某月的天数
  getMonthDays(myMonth) {
    var monthStartDate = new Date(this.state.nowYear, myMonth, 1);
    var monthEndDate = new Date(this.state.nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  }
  //   获得本季度的开端月份
  getQuarterStartMonth() {
    var quarterStartMonth = 0;
    if (this.state.nowMonth < 3) {
      quarterStartMonth = 0;
    }
    if (2 < this.state.nowMonth && this.state.nowMonth < 6) {
      quarterStartMonth = 3;
    }
    if (5 < this.state.nowMonth && this.state.nowMonth < 9) {
      quarterStartMonth = 6;
    }
    if (this.state.nowMonth > 8) {
      quarterStartMonth = 9;
    }
    return quarterStartMonth;
  }
  //获得本周的开端日期
  getWeekStartDate() {
    var weekStartDate = new Date(
      this.state.nowYear,
      this.state.nowMonth,
      this.state.nowDay - this.state.nowDayOfWeek
    );
    return this.formatDate(weekStartDate);
  }
  //获得本周的停止日期
  getWeekEndDate() {
    var weekEndDate = new Date(
      this.state.nowYear,
      this.state.nowMonth,
      this.state.nowDay + (6 - this.state.nowDayOfWeek)
    );
    return this.formatDate(weekEndDate);
  }
  //获得本月的开端日期
  getMonthStartDate() {
    var monthStartDate = new Date(this.state.nowYear, this.state.nowMonth, 1);
    return this.formatDate(monthStartDate);
  }
  //获得本月的停止日期
  getMonthEndDate() {
    var monthEndDate = new Date(
      this.state.nowYear,
      this.state.nowMonth,
      this.getMonthDays(this.state.nowMonth)
    );
    return this.formatDate(monthEndDate);
  }
  //获得本季度的开端日期
  getQuarterStartDate() {
    var quarterStartDate = new Date(
      this.state.nowYear,
      this.getQuarterStartMonth(),
      1
    );
    return this.formatDate(quarterStartDate);
  }

  //获得本季度的停止日期
  getQuarterEndDate() {
    var quarterEndMonth = this.getQuarterStartMonth() + 2;
    var quarterStartDate = new Date(
      this.state.nowYear,
      quarterEndMonth,
      this.getMonthDays(quarterEndMonth)
    );
    return this.formatDate(quarterStartDate);
  }

  //   获取查询新人奖金收益接口
  selectNewStaffBonus(startTime, endTime, current) {
    CarryTokenRequest(servicePath.selectNewStaffBonus, {
      profitSharingType: 4,
      startTime,
      endTime,
      current,
      len: 15,
    })
      .then((res) => {
        console.log("ok了", res);
        let newUserList = res.data.data.records;
        newUserList.forEach((e, index) => {
          if(e.incomeTime){
            newUserList[index].incomeTime = e.incomeTime.substring(0, 10); //截取年月日
          }
        });
        console.log("新的时间", newUserList);
        if (current == 1) {
          this.setState({
            userList: [...newUserList],
            current: res.data.data.current,
            pages: res.data.data.pages,
          },
          ()=>console.log(this.state.userList,'列表')
          );
        } else {
          this.setState({
            userList: [...this.state.userList, ...newUserList],
            current: res.data.data.current,
            pages: res.data.data.pages,
          });
        }
      })
      .catch((err) => {
        // console.log("收益接口异常", err);
      });
      console.log(this.state.userList.length,'changdu');
  }

  getSelectTab = (index) => {   // 筛选
    console.log(index);
    if (index == this.state.selectIn) return;
    const newIndex = index;
    this.setState({
      selectIn: newIndex,
    });
    let startTime = "";
    let endTime = "";
    switch (newIndex) {
      case 0:
        startTime = "";
        endTime = "";
        break;
      case 1:
        startTime = this.getWeekStartDate();
        endTime = this.getWeekEndDate();
        break;
      case 2:
        startTime = this.getMonthStartDate();
        endTime = this.getMonthEndDate();
        break;
      case 3:
        startTime = this.getQuarterStartDate();
        endTime = this.getQuarterEndDate();
        break;
      default:
        break;
    }
    this.setState({
      startTime,
      endTime,
    });
    this.selectNewStaffBonus(
      startTime ? startTime + " 00:00:00" : "",
      endTime ? endTime + " 23:59:59" : "",
      1
    );
    // this.selectNewStaffBonus()
  };

  // 页面跳转传startTime
  getLookMore = (incomeTime) => {
    console.log(incomeTime,'看我');
    Taro.navigateTo({
      url:
        `/agent/newuserdetail/newuserdetail?incomeTime=${incomeTime}` //+ incomeTime
    });
  };

  //   上拉加载
  onScrollToLower = () => {
    console.log(1111111);
    if (this.state.current === this.state.pages) {
      console.log("页数相等了");
    } else if (this.state.pages !== 0) {
      this.selectNewStaffBonus(
        this.state.startTime ? this.state.startTime + " 00:00:00" : "",
        this.state.endTime ? this.state.endTime + " 23:59:59" : "",
        this.state.current + 1
      );
    }
  };

  config = {
    navigationBarTitleText: "新人奖金收益",
    onReachBottomDistance: 100, //设置距离底部距离(监听页面滑动)
  };

  render() {
    const { userList, selectList, selectIn } = this.state;
    return (
      // 新人奖金收益 页面
      <View className="h5-newuser">
        {/* 头部开始 */}
        <View className="newuser-top">
          <View className="title">时间</View>
          <View className="title">收益</View>
          <View className="title">收益明细</View>
        </View>
        {/* 头部结束 */}
        {/* 内容开始 */}
        <ScrollView
          scrollY
          scrollWithAnimation={true}
          style={{ height: "calc(100vh - 100px" }}
          onScrollToLower={this.onScrollToLower}
        >
          <View className="newuser-content">
            {userList.length === 0 ? (
              <CommonEmpty content="暂无数据" />
            ) : (
              userList.map((item, index) => {
                return (
                  <View className="contentList">
                    <View className="time">{item.incomeTime}</View>
                    <View className="money">{item.income}</View>
                    <View className="btn" 
                    onClick={this.getLookMore.bind(this, item.incomeTime)}  //.bind(this, item.incomeTime)
                    >
                      <Text className="text">查看明细</Text>
                    </View>
                  </View>
                );
              })
            )}

          {
            userList.length === 0 ? null :
            <View className="no-more" style={{display : this.state.current !== this.state.pages ? 'none' : 'block' }}>
                -没有更多啦-
            </View>
          }
          </View>
        </ScrollView>
        {/* 内容结束 */}
        {/* 底部tabbar开始 */}
        <View className="newuser-bottom">
          {selectList.map((item, index) => {
            return (
              <View
                className={selectIn == index ? "btn on" : "btn"}
                onClick={this.getSelectTab.bind(this, index)}
              >
                {item}
              </View>
            );
          })}
        </View>
        {/* 底部tabbar结束 */}
      </View>
    );
  }
}
