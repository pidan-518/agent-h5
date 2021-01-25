import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button, Image } from "@tarojs/components";
import "./userinformation.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest, postRequest } from "../../common/util/request";
import apiUrl from "../../common/util/api/apiUrl";
// picture
import goto from "../../static/scattered/goto.png";

export default class userinformation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  // 点击详情事件
  handleDetail = (item) => {
    Taro.navigateTo({
      url: `/agent/team/team?userId=${item.userId}&userName=${item.userName}`,
    });
  };

  config = {
    navigationBarTitleText: "",
  };

  render() {
    return (
      //网红店长信息 组件
      <View className="h5-team-userInformation">
        {this.props.userList.map((item) => {
          return (
            //  网红店长详情列表开始
            <view className="team-userInformation-list">
              <view className="userInformation-list-item">
                <view className="userInformation-list-item-left">
                  <view className="left-content">
                    <img
                      className="left-content-image"
                      src={item.avatar}
                      alt=""
                    />
                    <text className="left-content-text">{item.levelName}</text>
                  </view>
                </view>
                <view className="userInformation-list-item-right">
                  <view className="right-content">
                    <view className="right-content-username">
                      <text className="username">昵称：</text>
                      <text className="username-content">{item.userName}</text>
                    </view>
                    <view className="right-content-region">
                      <text className="region">地区：</text>
                      <text className="region-content-province">
                        {item.region}
                      </text>
                    </view>
                    <view className="right-content-upgrade">
                      <text className="upgrade">升级时间：</text>
                      <text className="upgrade-content">{item.updateTime}</text>
                    </view>
                    {// 判断是否有 income 数据
                    item.income || item.income == 0 ? (
                      <view className="right-content-ordermoney">
                        <text className="ordermoney">订单金额：</text>
                        <text className="ordermoney-content">
                          {item.income}
                        </text>
                      </view>
                    ) : (
                      ""
                    )}
                    {// 判断是否有 orderNum 数据
                    item.orderNum || item.orderNum == 0 ? (
                      <view className="right-content-ordermoney">
                        <text className="ordermoney">订单数量：</text>
                        <text className="ordermoney-content">
                          {item.orderNum}
                        </text>
                      </view>
                    ) : (
                      ""
                    )}
                  </view>
                </view>
                <Button
                  className="detail"
                  onClick={this.handleDetail.bind(this, item)}
                  style={{ display: this.props.hasDetail ? "" : "none" }}
                >
                  <Image className="gogo" src={goto} />
                </Button>
              </view>
            </view>
            // 网红店长列表结束
          );
        })}
      </View>
    );
  }
}
