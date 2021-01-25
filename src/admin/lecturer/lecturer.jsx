import Taro, { Component } from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import Navigation from "../../components/Navigation/Navigation";
import "./lecturer.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";
import CommonEmpty from "../../components/CommonEmpty/CommonEmpty";

// 讲师
export default class Lecturer extends Component {
  state = {
    lecturerList: [], // 讲师列表数据
    pages: 1, // 总页数
    current: 1, // 当前页
    isTop: false,
  };

  handleNavigation = (item) => {
    document.body.style.overflow = "auto";
    Taro.navigateTo({
      url: item.pagePath,
    });
  };

  handleClick = () => {
    this.setState({
      isTop: true,
    });
    document.body.style.overflow = "hidden";
  };

  handleMaskClick = () => {
    this.setState({
      isTop: false,
    });
    document.body.style.overflow = "auto";
  };

  // 获取讲师列表
  getLecturerList(current = 1) {
    CarryTokenRequest(servicePath.getSysTeacherInfoSelectAll, {
      len: 10,
      current: current,
    })
      .then((res) => {
        console.log("获取讲师列表成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            lecturerList: [
              ...this.state.lecturerList,
              ...res.data.data.records,
            ],
            pages: res.data.data.pages,
            current: res.data.data.current,
          });
        }
      })
      .catch((err) => {
        console.log("获取讲师列表接口异常", err);
      });
  }

  onReachBottom() {
    if (this.state.current < this.state.pages) {
      this.getLecturerList(this.state.current + 1);
    }
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    if (this.state.isTop) {
      document.body.style.overflow = "hidden";
    }
    this.setState(
      {
        lecturerList: [],
      },
      () => {
        this.getLecturerList();
      }
    );
  }

  componentDidHide() {}

  config = {
    navigationBarTitleText: "讲师",
  };

  render() {
    const { lecturerList, isTop } = this.state;

    const menuItem = [
      {
        menuImage: require("../../static/lecturer/lecturer-list-icon.png"),
        text: "讲师列表",
        pagePath: "/admin/lecturerlist/lecturerlist",
      },
      {
        menuImage: require("../../static/lecturer/add-lecturer-icon.png"),
        text: "添加讲师",
        pagePath: "/admin/addlecturer/addlecturer",
      },
      {
        menuImage: require("../../static/lecturer/lecturer-admin-icon.png"),
        text: "讲师管理",
        pagePath: "/admin/lectureradmin/lectureradmin",
      },
    ];

    return (
      <View>
        <View id="lecturer">
          <View className="more" onClick={this.handleClick.bind(this)}>
            <div>点击查看更多信息</div>
            <div className="image">
              <img
                className="top-image"
                src={require("../../static/agentPart/ic_more.png")}
                alt=""
              />
            </div>
          </View>
          <View
            className="mask"
            onClick={this.handleMaskClick.bind(this)}
            style={{ display: isTop ? "block" : "none" }}
          ></View>
          <View className={`menu-list ${isTop ? "menu-list-ac" : ""}`}>
            {menuItem.map((item) => (
              <View
                className="menu-item"
                onClick={this.handleNavigation.bind(this, item)}
              >
                <img className="item-img" src={item.menuImage} alt="" />
                <View className="item-text">{item.text}</View>
              </View>
            ))}
            <img
              className="top-image"
              onClick={this.handleMaskClick.bind(this)}
              src={require("../../static/lecturer/top-img.png")}
              alt=""
            />
          </View>

          {lecturerList.length === 0 ? (
            <CommonEmpty content="暂无数据" />
          ) : (
            <View id="lecturer-list">
              {lecturerList.map((item) => (
                <Navigation
                  url={`/admin/lecturerdetails/lecturerdetails?teacherId=${item.teacherId}`}
                  key={item.teacherId}
                >
                  <View className="lecturer-item">
                    <img
                      className="lecturer-item-img"
                      src={item.teacherImg}
                      alt=""
                    />
                    <View className="lecturer-info">
                      <View className="left-box">
                        <View
                          className="lecturer-name"
                          style={{ "-webkit-box-orient": "vertical" }}
                        >
                          {item.teacherName}
                        </View>
                        <View
                          className="lecturer-details"
                          style={{ "-webkit-box-orient": "vertical" }}
                        >
                          {item.personalProfile}
                        </View>
                      </View>
                      <View className="right-box">
                        <View className="details-btn">详情</View>
                      </View>
                    </View>
                  </View>
                </Navigation>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  }
}
