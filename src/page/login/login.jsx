import Taro, { Component } from "@tarojs/taro";
import { View, Text, Form, Input, Button } from "@tarojs/components";
import "./login.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 表单提交事件
  handleSubmit = (e) => {
    const { phone, password } = e.detail.value;
    // const phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$/;
    if (phone === "") {
      Taro.showToast({
        title: "请输入手机号",
        duration: 1500,
        icon: "none",
      });
      return false;
    } /* else if (!phoneReg.test(e.detail.value.phone)) {
      Taro.showToast({
        title: "请输入正确的手机号",
        duration: 1500,
        icon: 'none'
      })
      return false;
    } */ else if (
      password === ""
    ) {
      Taro.showToast({
        title: "请输入密码",
        duration: 1500,
        icon: "none",
      });
      return false;
    } else {
      const postData = {
        loginName: `${e.detail.value.phone}`,
        password: `${e.detail.value.password}`,
        /* source: 'smallRoutine' */
      };
      this.getLogin(postData);
    }
  };

  // 登录请求
  getLogin(params) {
    CarryTokenRequest(servicePath.getLogin, params)
      .then((res) => {
        console.log("登录成功", res.data);
        const data = res.data;
        if (data.code === 0) {
          Taro.showToast({
            title: "登录成功",
            duration: 1500,
            icon: "success",
            success: (toastRes) => {
              window.sessionStorage.setItem(
                "userInfo",
                JSON.stringify(data.data)
              );
              /* const loginMark = window.sessionStorage.getItem("loginMark"); */
              setTimeout(() => {
                switch (data.data.userType) {
                  case "00":
                    // 跳到管理员页面
                    Taro.redirectTo({
                      url: "/admin/index/index",
                    });
                    window.location.reload();
                    break;
                  case "02":
                    // 跳到代理人页面
                    Taro.redirectTo({
                      url: "/agent/index/index",
                    });
                    window.location.reload();
                    break;
                  default:
                    break;
                }
              }, 1000);
            },
          });
        } else {
          Taro.showToast({
            title: data.msg,
            duration: 1500,
            icon: "none",
          });
        }
      })
      .catch((err) => {
        console.log("登录接口异常----", err);
      });
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  config = {
    navigationBarTitleText: "登录",
  };

  render() {
    return (
      <View id="login">
        <View className="login-bg-img"></View>
        <View className="form-content">
          <Form onSubmit={this.handleSubmit}>
            <View className="form-item">
              <Input
                name="phone"
                className="item-input"
                placeholder="请输入手机号码"
              />
            </View>
            <View className="form-item">
              <Input
                className="item-input"
                type="password"
                name="password"
                placeholder="请输入密码"
              />
            </View>
            <View className="submit-btn">
              <Button formType="submit">登录</Button>
            </View>
          </Form>
        </View>
      </View>
    );
  }
}
