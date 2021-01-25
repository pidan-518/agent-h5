import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./orderlist.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest, postRequest } from "../../common/util/request";
import apiUrl from "../../common/util/api/apiUrl";
// components
import UserInformation from "../../components/userinformation/userinformation";
import nullimg from "../../static/scattered/null.png";
import arrow from "../../static/scattered/arrow.png";
import onarrow from "../../static/scattered/onarrow.png";
import { boxShadow } from "html2canvas/dist/types/css/property-descriptors/box-shadow";

export default class orderlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabList: ["总金额", "订单数量"],
      tabIn: 0, // 当前选中tab   0:金额  1:订单数量
      current: 1, //金额列表当前页
      currentOrder: 1, //订单数量列表当前页
      pages: 1, //金额列表总页数
      pagesOrder: 1, //订单数量列表总页数
      userList: [], //金额列表
      userListOrder: [], //订单数量列表
      visiCount: true, //显示金额列表
      visiOrder: false, //显示订单数量列表
      downBox: false, //头部框状态
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    this.getAmount(1);
    // this.getAmountOrder(1)
  }

  componentDidHide() {}

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

  // 上拉加载数据
  onReachBottom() {
    if (this.state.tabIn === 0) {
      if (!(this.state.current === this.state.pages)) {
        if (this.state.pages !== 0) {
          this.getAmount(this.state.current + 1); //总金额
        }
      }
    } else {
      if (!(this.state.currentOrder === this.state.pagesOrder)) {
        if (this.state.pagesOrder !== 0) {
          this.getAmountOrder(this.state.currentOrder + 1); //订单数量
        }
      }
    }
  }

  // 获取金额列表
  getAmount(current) {
    CarryTokenRequest(apiUrl.teamDetailSelectTeamListByAmount, {
      current,
      len: 8, //每页条数
    })
      .then((res) => {
        console.log(1, res.data.data);
        this.setState(
          {
            userList: [...this.state.userList, ...res.data.data.records],
            current: res.data.data.current,
            pages: res.data.data.pages,
          },
          () => console.log(this.state.userList)
        );
      })
      .catch((err) => {});
  }

  // 获取订单数量列表
  getAmountOrder(current) {
    CarryTokenRequest(apiUrl.teamDetailSelectTeamListOrderNum, {
      current,
      len: 8, //每页条数
    })
      .then((res) => {
        this.setState({
          userListOrder: [
            ...this.state.userListOrder,
            ...res.data.data.records,
          ],
          currentOrder: res.data.data.current,
          pagesOrder: res.data.data.pages,
        });
      })
      .catch((err) => {});
  }

  //  点击切换 显示不同的页面内容
  getSelectTab = (index) => {
    this.setState({
      tabIn: index,
    });
    if (index == 0) {
      this.getAmount(); //请求 总金额接口
      this.setState({
        visiCount: true,
        visiOrder: false,
        userList: [], //每次点击清空金额数据
      });
    } else {
      this.getAmountOrder(); //请求 订单数量接口
      this.setState({
        visiCount: false,
        visiOrder: true,
        userListOrder: [], //每次点击清空订单数据
      });
    }
  };

  config = {
    navigationBarTitleText: "订单排行",
    onReachBottomDistance: 100, //设置距离底部距离(监听页面滑动)
  };

  render() {
    const {
      tabList,
      tabIn,
      userList,
      userListOrder,
      visiCount,
      visiOrder,
      current,
      currentOrder,
      pages,
      pagesOrder,
      downBox,
    } = this.state;
    return (
      // 成员信息 页面
      <View className="h5-orderlist">
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
              <View className="totalprice">
                {tabList.map((item, index) => {
                  return (
                    <View className="btn-block">
                      <View className="btn">
                        <Text
                          onClick={this.getSelectTab.bind(this, index)}
                          className={
                            tabIn == index ? "totalpricecontent" : "ordernum"
                          }
                        >
                          {item}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View className="image" onClick={this.onShowBox}>
                <Image className="icon" src={onarrow} />
              </View>
            </View>
          )}
        </View>
        {/* 头部展示结束 */}
        {/* 总金额列表开始 */}
        <View
          className={
            downBox === false
              ? "orderlist-userinformation count"
              : "orderlist-userinformation-active count"
          }
          style={{ display: visiCount === true ? "" : "none" }}
        >
          <UserInformation userList={userList}></UserInformation>
          {/* 底部文字提示开始 */}
          {current == pages ? (
            <View className="no-more">-没有更多啦-</View>
          ) : (
            ""
          )}
          {/* 底部文字提示结束 */}
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
          {/* 页面数据为空时显示的图片结束 */}
        </View>
        {/* 总金额列表结束 */}
        {/* 订单数量列表开始 */}
        <View
          className={
            downBox === false
              ? "orderlist-userinformation order"
              : "orderlist-userinformation-active order"
          }
          style={{ display: visiOrder === true ? "" : "none" }}
        >
          <UserInformation userList={userListOrder}></UserInformation>
          {/* 底部文字提示开始 */}
          {currentOrder == pagesOrder ? (
            <View className="no-more">-没有更多啦-</View>
          ) : (
            ""
          )}
          {/* 底部文字提示结束 */}
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
          {/* 页面数据为空时显示的图片结束
           */}
        </View>
        {/* 订单数量列表结束 */}
      </View>
    );
  }
}
