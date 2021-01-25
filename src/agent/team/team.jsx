import Taro, { Component } from "@tarojs/taro";
import { View, Text, Form, Input, Button, Image } from "@tarojs/components";
import "./team.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest, postRequest } from "../../common/util/request";
import apiUrl from "../../common/util/api/apiUrl";
// components
import UserInformation from "../../components/userinformation/userinformation";
// picture
import people from "../../static/scattered/people.png";
import financial from "../../static/scattered/financial.png";
import earnings from "../../static/scattered/earnings.png";
import nullimg from "../../static/scattered/null.png";
import arrow from "../../static/scattered/arrow.png";
import onarrow from "../../static/scattered/onarrow.png";
import { fontStyle } from "html2canvas/dist/types/css/property-descriptors/font-style";
import { fontVariant } from "html2canvas/dist/types/css/property-descriptors/font-variant";
import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";

export default class team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: "", //总人数(所有数据)
      thisMonth: "", //本月新增人数
      lastMonth: "", //上月增长人数
      current: 1, //当前页
      pages: 1,
      userList: [],
      userId: null, //查看的用户id
      userName: "", //所填昵称
      agentLevelId: "", //所选等级
      downBox: false, //头部框状态
      levelList: [
        //等级列表
        { name: "所有等级", id: 0 },
        { name: "电商达人", id: 6 },
        { name: "网红店长", id: 5 },
        { name: "业务经理", id: 4 },
        { name: "区域经理", id: 3 },
        { name: "业务总监", id: 2 },
        { name: "区域总监", id: 1 },
      ],
      statisticsList: [
        //统计列表
        { txt: "总人数", amount: 0 },
        { txt: "本月添加", amount: 0 },
        { txt: "上月增长", amount: 0 },
        { txt: "电商达人", amount: 0 },
        { txt: "网红店长", amount: 0 },
        { txt: "业务经理", amount: 0 },
        { txt: "区域经理", amount: 0 },
        { txt: "业务总监", amount: 0 },
        { txt: "区域总监", amount: 0 },
      ],
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    this.setState(
      {
        // 设置用户id
        userId: JSON.parse(this.$router.params.userId || "null"),
      },
      () => {
        this.getTotalNum(1);
        this.countLevelNum();
      }
    );
  }

  componentDidHide() {
    this.setState({
      userList: [],
      current: 1,
      pages: 1,
    });
  }

  // 上拉加载数据
  onReachBottom() {
    if (this.state.current === this.state.pages) {
      console.log("进入了");
    } else if (this.state.pages !== 0) {
      this.getTotalNum(this.state.current + 1);
    }
  }

  // 接口 总人数-列表展示
  getTotalNum(current) {
    CarryTokenRequest(apiUrl.teamDetailSelectTeamList, {
      userId: this.state.userId,
      userName: this.state.userName,
      agentLevelId: this.state.agentLevelId,
      current,
      len: 6,
    })
      .then((res) => {
        this.setState({
          userList: [...this.state.userList, ...res.data.data.records],
          current: res.data.data.current,
          pages: res.data.data.pages,
          total: res.data.data.total,
        });
        Taro.hideLoading();
      })
      .catch((err) => {});
  }

  // 接口 总人数-统计本月新增人数
  getcountByMonth() {
    CarryTokenRequest(apiUrl.teamDetailCountByMonth, {})
      .then((res) => {
        this.setState({
          thisMonth: res.data,
        });
      })
      .catch((err) => {});
  }

  // 接口 总人数-统计上月新增人数
  getcountByLastMonth() {
    CarryTokenRequest(apiUrl.teamDetailCountByLastMonth, {})
      .then((res) => {
        this.setState({
          lastMonth: res.data,
        });
      })
      .catch((err) => {});
  }

  // 获取各等级人数
  countLevelNum = () => {
    const postData = {
      userId: this.state.userId,
    };
    CarryTokenRequest(apiUrl.countLevelNum, postData).then((res) => {
      if (res.data.code === 0) {
        const data = res.data.data;
        this.setState({
          statisticsList: [
            { txt: "总人数", amount: data.allNum },
            { txt: "本月添加", amount: data.nowMonthNum },
            { txt: "上月增长", amount: data.lastMonthNum },
            { txt: "电商达人", amount: data.dsdrNum },
            { txt: "网红店长", amount: data.whdzNum },
            { txt: "业务经理", amount: data.ywjlNum },
            { txt: "区域经理", amount: data.qyjlNum },
            { txt: "业务总监", amount: data.ywzjNum },
            { txt: "区域总监", amount: data.qyzjNum },
          ],
        });
      } else {
        Taro.showModal({
          title: "提示",
          content: res.data.msg,
          showCancel: false,
        });
      }
    });
  };

  //-------------------------------------搜索相关
  // 昵称输入
  inputUserName = (e) => {
    this.setState({
      userName: e.target.value,
    });
  };

  // 等级选择
  selectLevel = (e) => {
    const value = JSON.parse(e.target.value || "null");
    this.setState({
      agentLevelId: value !== 0 ? value : null,
    });
  };

  // 搜索事件
  handleSearch = () => {
    const postData = {
      userId: this.state.userId,
      userName: this.state.userName,
      agentLevelId: this.state.agentLevelId,
      current: 1,
      len: 6,
    };
    CarryTokenRequest(apiUrl.teamDetailSelectTeamList, postData).then((res) => {
      if (res.data.code === 0) {
        this.setState({
          userList: res.data.data.records,
          current: 1,
          pages: res.data.data.pages,
        });
      } else {
        Taro.showModal({
          title: "提示",
          content: res.data.msg,
          showCancel: false,
        });
      }
    });
  };

  // 置顶头部框事件
  onShowBox = () => {
    if (this.state.downBox === false) {
      console.log("变!!!");
      this.setState({
        downBox: true,
      });
    } else {
      console.log("继续变!!!");
      this.setState({
        downBox: false,
      });
    }
  };
  //---------------------------------------------

  config = {
    navigationBarTitleText: "成员信息",
    onReachBottomDistance: 100,
  };

  render() {
    const {
      total,
      thisMonth,
      lastMonth,
      userList,
      current,
      pages,
      levelList,
      statisticsList,
      downBox,
    } = this.state;
    return (
      //团队详情 页面
      <View className="h5-team-details">
        {/* 头部展示开始 */}
        <View className="header">
          {downBox === false ? (
            <View className="hide-header">
              <Text className="content">下拉查看更多信息</Text>
              <View className="image" onClick={this.onShowBox}>
                <Image className="icon" src={arrow} />
              </View>
            </View>
          ) : (
            <View className="block-header">
              {/* 搜索 */}
              <View className="search_wrap">
                <View className="item_list">
                  <View className="input">
                    <Input
                      className="search_item userName"
                      placeholder="昵称"
                      maxLength="13"
                      onInput={(e) => this.inputUserName(e)}
                    />
                  </View>
                  <View className="select_wrap">
                    <select
                      className="search_item level"
                      placeholder="等级"
                      onChange={(e) => this.selectLevel(e)}
                    >
                      {levelList.map((itemLevel) => {
                        return (
                          <option className="option" value={itemLevel.id}>
                            <Text>{itemLevel.name}</Text>
                          </option>
                        );
                      })}
                    </select>
                    <img
                      className="arrow"
                      src={require("../../static/common/dropDown.png")}
                    />
                  </View>
                  <View className="action_wrap">
                    <Button className="action" onClick={this.handleSearch}>
                      <img
                        className="img_search"
                        src={require("../../static/common/search.png")}
                      />
                    </Button>
                  </View>
                </View>
              </View>
              {/* 统计 */}
              <View className="statistics">
                {statisticsList.map((itemStatistics) => {
                  return (
                    <View className="statistics_item">
                      <Text className="amount text">
                        {itemStatistics.amount}
                      </Text>
                      <Text className="txt text">{itemStatistics.txt}</Text>
                    </View>
                  );
                })}
                <View className="image" onClick={this.onShowBox}>
                  <Image className="icon" src={onarrow} />
                </View>
              </View>
            </View>
          )}
        </View>
        {/* 头部展示结束 */}
        {/* 顶部分类开始  ---remove 8.25 */}
        {/* <view className='team-details-top'>
          <view className='top-list'>
            <view className='top-list-item'>
              <view className='item-block-total'>
                <img src={people} alt="" />
              </view>
              <text className='num'>{total}</text>
              <text className='content'>总人数</text>
            </view>
            <view className='top-list-item'>
              <view className='item-block-new'>
                <img src={financial} alt="" />
              </view>
              <text className='activenum'>{thisMonth.data}</text>
              <text className='content'>本月新增</text>
            </view>
            <view className='top-list-item'>
              <view className='item-block-growth'>
                <img src={earnings} alt="" />
              </view>
              <text className='activenum'>{lastMonth.data}</text>
              <text className='content'>上月增长</text>
            </view>
          </view>
        </view> */}
        {/* 顶部分类结束 */}
        {/* 团队详情列表开始 */}
        <View
          className={
            downBox === false
              ? "content-team-details"
              : "active-content-team-details"
          }
        >
          <View className="mask"></View>
          <UserInformation
            userList={userList}
            hasDetail={true}
          ></UserInformation>
        </View>
        {/* 团队详情列表结束 */}
        {/* 底部文字提示开始 */}
        {current == pages ? <View className="no-more">-没有更多啦-</View> : ""}
        {/* 底部文字提示开始 */}
        {/* 页面数据为空时显示的图片开始 */}
        {pages == 0 ? (
          <View className="withoutContent">
            <View className="withoutContent-img">
              <img src={nullimg} alt="" />
            </View>
            <Text className="withoutContent-text">该页面暂无内容</Text>
          </View>
        ) : (
          ""
        )}
        {/* 页面数据为空时显示的图片开始 */}
      </View>
    );
  }
}
