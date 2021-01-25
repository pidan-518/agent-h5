import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import "./income.less";
import { CarryTokenRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";
import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";

export default class Income extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incomeList: [],
      nowDayOfWeek: "", // 今天是本周的第几天
      nowDay: "", // 当前日
      nowMonth: "", // 当前月
      nowYear: "", // 当前年
      selectList: ["全部", "周", "月", "季度"],
      selectIn: -1,
      current: 1,
      pages: 1,
      startTime: "",
      endTime: "",
    };
  }
  componentWillMount() {}

  componentDidMount() {
    console.log(this.$router.params.type, this.state.selectIn);
    setTimeout(() => {
      this.getInitdate();
      this.getSelectTab(0);
    }, 300);
    this.getInitdate();
  }

  componentWillUnmount() {}

  componentDidShow() {
    // new
    const type = Number(this.$router.params.type);
    let text = "";
    switch (type) {
      case 0:
        text = "全部";
        break;
      case 1:
        text = "介绍费";
        break;
      case 2:
        text = "自购/分享";
        break;
      case 3:
        text = "直播";
        break;
      case 4:
        text = "全部待";
        break;
      default:
        break;
    }
    Taro.setNavigationBarTitle({
      title: text + "收益",
    });
  }

  componentDidHide() {}
  // 初始化时间
  getInitdate() {
    /**
     * 获取本周、本季度、本月开端日期、停止日期
     */

    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    console.log(nowDayOfWeek);
    var nowDay = now.getDate(); //当前日
    console.log(nowDay);
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
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
  //格式化日期：yyyy-MM-dd
  formatDate(date) {
    console.log(date);
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();

    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    console.log(myyear + "-" + mymonth + "-" + myweekday + " 23:59:59");
    return myyear + "-" + mymonth + "-" + myweekday;
  }
  //获得某月的天数
  getMonthDays(myMonth) {
    var monthStartDate = new Date(this.state.nowYear, myMonth, 1);
    var monthEndDate = new Date(this.state.nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  }
  //获得本季度的开端月份
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

  getstatisticsList(startTime, endTime, current) {
    // 收益列表接口请求
    CarryTokenRequest(servicePath.getstatisticsList, {
      profitSharingType: Number(this.$router.params.type),
      startTime,
      endTime,
      current,
      len: 25,
    })
      .then((res) => {
        console.log("收益列表", res);
        if (current == 1) {
          this.setState({
            incomeList: [...res.data.data.records],
            current: res.data.data.current,
            pages: res.data.data.pages,
          });
        } else {
          this.setState({
            incomeList: [...this.state.incomeList, ...res.data.data.records],
            current: res.data.data.current,
            pages: res.data.data.pages,
          });
        }
      })
      .catch((err) => {
        console.log("收益列表接口异常--", err);
      });
  }
  gettoBePaidStatisticsList(startTime, endTime, current) {
    // 收益列表接口请求
    CarryTokenRequest(servicePath.gettoBePaidStatisticsList, {
      startTime,
      endTime,
      current,
      len: 25,
    })
      .then((res) => {
        console.log("待收益列表", res);
        if (current == 1) {
          this.setState({
            incomeList: [...res.data.data.records],
            current: res.data.data.current,
            pages: res.data.data.pages,
          });
        } else {
          this.setState({
            incomeList: [...this.state.incomeList, ...res.data.data.records],
            current: res.data.data.current,
            pages: res.data.data.pages,
          });
        }
      })
      .catch((err) => {
        console.log("收益列表接口异常--", err);
      });
  }
  getSelectTab = (index) => {
    // 筛选
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
    if (this.$router.params.type == 4) {
      this.gettoBePaidStatisticsList(
        startTime ? startTime + " 00:00:00" : "",
        endTime ? endTime + " 23:59:59" : "",
        1
      );
    } else {
      this.getstatisticsList(
        startTime ? startTime + " 00:00:00" : "",
        endTime ? endTime + " 23:59:59" : "",
        1
      );
    }
  };
  onScrollToLower = () => {
    // 上拉加载
    console.log("1111");
    if (this.state.current === this.state.pages) {
      console.log("进入");
    } else if (this.state.pages !== 0) {
      if (this.$router.params.type == 4) {
        this.gettoBePaidStatisticsList(
          this.state.startTime ? this.state.startTime + " 00:00:00" : "",
          this.state.endTime ? this.state.endTime + " 23:59:59" : "",
          this.state.current + 1
        );
      } else {
        this.getstatisticsList(
          this.state.startTime ? this.state.startTime + " 00:00:00" : "",
          this.state.endTime ? this.state.endTime + " 23:59:59" : "",
          this.state.current + 1
        );
      }
    }
  };
  getLookMore = (e) => {
    console.log(e);
    Taro.navigateTo({
      url:
        "/agent/incomedetail/incomedetail?time=" +
        e +
        "&type=" +
        this.$router.params.type,
    });
  };
  config = {
    navigationBarTitleText: "收益详情",
  };

  render() {
    const { incomeList, selectList, selectIn } = this.state;
    return (
      <View className="examincome">
        <View className="list title">
          <View className="text">时间</View>
          <View className="text">团队订单金额</View>
          <View className="text">收益</View>
          <View className="text">收益明细</View>
        </View>
        <ScrollView
          scrollY
          style={{ height: "calc(100vh - 120px)" }}
          onScrollToLower={this.onScrollToLower}
        >
          <View className="overflow">
            {incomeList.length === 0 ? (
              <CommonEmpty content="暂无数据" />
            ) : (
              incomeList.map((item, index) => {
                return (
                  <View className="list">
                    <View className="text">{item.incomeTime}</View>
                    <View className="text">{item.orderPrice}</View>
                    <View className="text">{item.income}</View>
                    <View
                      className="text"
                      onClick={this.getLookMore.bind(this, item.incomeTime)}
                    >
                      查看明细
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
        <View className="botton">
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
      </View>
    );
  }
}
