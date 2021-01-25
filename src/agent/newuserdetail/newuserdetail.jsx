import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import "./newuserdetail.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest, postRequest } from "../../common/util/request";
import apiUrl from "../../common/util/api/apiUrl";
// components
import servicePath from "../../common/util/api/apiUrl";
import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";

export default class newuserdetail extends Component {
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
    };
  }

  componentWillMount() {}

  componentDidMount() {
    console.log(this.$router.params.incomeTime, "传来的时间");
    this.setState(
      {
        startTime: this.$router.params.incomeTime,
        endTime: this.$router.params.incomeTime,
      },
      () => {
        console.log(this.state.startTime, "时间", this.state.endTime);
        this.selectNewStaffBonusDetail(1);
      }
    );
    // setTimeout(() => {
    //   this.getInitdate();
    //   this.getSelectTab(0);
    // }, 300);
    // this.getInitdate();
  }

  componentWillUnmount() {}

  componentDidShow() {
    //   this.selectNewStaffBonusDetail(startTime + ' 00:00:00', endTime + ' 23:59:59', 1)
  }

  componentDidHide() {}

  //   获取查询新人奖金收益接口
  selectNewStaffBonusDetail(current) {
    CarryTokenRequest(servicePath.selectNewStaffBonusDetail, {
      profitSharingType: 4,
      startTime: this.state.startTime + ' 00:00:00',
      endTime: this.state.endTime  + ' 23:59:59',
      current,
      len: 15,
    })
      .then((res) => {
        console.log("ok了", res);
        let newUserList = res.data.data.records;
        console.log("新的时间", newUserList);
        if (current == 1) {
          this.setState({
            userList: [...newUserList],
            current: res.data.data.current,
            pages: res.data.data.pages,
          },
          ()=>console.log(this.state.userList.length,'changdu')
          );
        } else {
          this.setState({
            userList: [...this.state.userList, ...newUserList],
            current: res.data.data.current,
            pages: res.data.data.pages,
          },
          ()=>console.log(this.state.userList.length,'changdu2')
          );
        }
      })
      .catch((err) => {
        console.log("收益接口异常", err);
      });
  }

  //   上拉加载
    onScrollToLower = () => {
      console.log(1111111);
      if (this.state.current === this.state.pages) {
        console.log("页数相等了");
      }
       else if (this.state.pages !== 0) {
          console.log('进来了');
        this.selectNewStaffBonusDetail(
          this.state.current + 1
        );
      }
    };

  config = {
    navigationBarTitleText: "新人奖金收益明细",
    onReachBottomDistance: 100, //设置距离底部距离(监听页面滑动)
  };

  render() {
    const { userList } = this.state;
    return (
      // 新人奖金收益 页面
      <View className="h5-newuser">
        {/* 头部开始 */}
        <View className="newuser-top">
          <View className="title">代理人账号</View>
          <View className="title">获得收益</View>
          <View className="title">完成时间</View>
        </View>
        {/* 头部结束 */}
        {/* 内容开始 */}
        <ScrollView
          scrollY
          scrollWithAnimation={true}
          style={{ height: '100vh' }}
          onScrollToLower={this.onScrollToLower}
        >
          <View className="newuser-content">
            {userList.length === 0 ? (
              <CommonEmpty content="暂无数据" />
            ) : (
              userList.map((item, index) => {
                return (
                  <View className="contentList">
                    <View className="time">{item.phonenumber}</View>
                    <View className="money">{item.income}</View>
                    <View className="money">{item.updateTime}</View>
                  </View>
                );
              })
            )}

          {
            userList.length === 0 ? null :
            <View className="no-more" style={{display : this.state.current !== this.state.pages ? 'none' : 'block' ,height : '80px' }}>
                -没有更多啦-
            </View>
          }
          </View>
        </ScrollView>
        {/* 内容结束 */}
      </View>
    );
  }
}
