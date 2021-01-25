import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./install.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest, postRequest } from "../../common/util/request";
import apiUrl from "../../common/util/api/apiUrl";
// components
// picture
export default class install extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [], //获取到的等级列表
    };
  }
  // 路由跳转到 admin/installProxy/installProxy 页面 传id值
  toInstallProxy = (id) => () => {
    Taro.navigateTo({
      url: `/admin/installProxy/installProxy?id=${id}`,
    });
  };

  componentWillMount() {}

  componentDidMount() {
    this.getList();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  //接口 获取到的等级列表
  getList() {
    CarryTokenRequest(apiUrl.getAgentLevelList, {})
      .then((res) => {
        // 定义 List 获取代理等级列表
        const List = res.data.data;
        // 往数据里添加 img属性-图片地址
        List.forEach((item, index) => {
          switch (item.name) {
            case "区域总监":
              List[
                index
              ].img = require("../../static/scattered/regionalDirector.png");
              break;
            case "业务总监":
              List[
                index
              ].img = require("../../static/scattered/salesDirector.png");
              break;
            case "区域经理":
              List[
                index
              ].img = require("../../static/scattered/areamanager.png");
              break;
            case "业务经理":
              List[index].img = require("../../static/scattered/manager.png");
              break;
            case "网红店长":
              List[
                index
              ].img = require("../../static/scattered/shopOrdersToReview.png");
              break;
            case "电商达人":
              List[index].img = require("../../static/scattered/expert.png");
              break;
            default:
              break;
          }
        });
        this.setState({
          items: List,
        });
      })
      .catch((err) => {});
  }
  config = {
    navigationBarTitleText: "代理人设置",
  };

  render() {
    const { items } = this.state;
    return (
      //代理人设置 页面
      <View className="h5-agentInstall">
        {/* 功能栏开始 */}
        <view className="agentInstall-function">
          <view className="function-list">
            {// 遍历后台返回的数组对象
            items.map((item, index) => {
              return (
                <view
                  id={item.id}
                  className="function-list-item"
                  onClick={this.toInstallProxy(item.id)}
                >
                  <view className={"item-expert"}>
                    <img src={item.img} alt="" />
                  </view>
                  <text>{item.name}</text>
                </view>
              );
            })}
          </view>
        </view>
        {/* 功能栏结束 */}
      </View>
    );
  }
}
