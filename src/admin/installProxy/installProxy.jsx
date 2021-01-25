import Taro, { Component, getStorageSync } from "@tarojs/taro";
// import { View, Text,RadioProps } from '@tarojs/components'
import { View, Text, Picker } from "@tarojs/components";
import "./installProxy.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest, postRequest } from "../../common/util/request";
import apiUrl from "../../common/util/api/apiUrl";
// components
// picture

export default class installProxy extends Component {
  constructor(props) {
    super(props);
    (this.selector = ["否", "是"]),
      (this.selectord = ["否", "是"]),
      (this.selectora = ["达标后手动申请升级", "达标后自动升级"]),
      (this.selectorb = ["达到条件后管理员审核降级", "达到条件后自动降级"]),
      (this.selectorc = [
        "不展示",
        "在所有代理人界面展示不展示",
        "在未达到该等级的代理人界面展示",
      ]),
      (this.state = {
        userName: "", //路由传参-代理人等级名称
        userId: "", //路由传参-代理人id
        userLevle: "", //路由传参-代理人等级
        code: "", //后台返回的请求状态
        getInfo: {
          name: "", //级别名称
          level: "", //级别 数字越大级别越低
          isDowngrade: 0, //是否可降级 0否1是
          isCompany: 0, //是否属于企业内部员工  0否1是
          isAutoUpgrade: 0, //selectora 是否自动升级  0否1是
          isAutoDowngrade: 0, //selectorb 是否自动降级  0否1是
          conditionShow: 0, //selectorc 条件展示配置  0不展示 1在所有代理人界面展示  2在未达到该等级的代理人界面展示
          upgradeFee: "", //升级费用
          upgradeNumSub: "", //升级需要第一下级人数
          upgradeNumTeam: "", //升级需要团队人数
          upgradeTurnover: "", //升级需要单月营业额
          upgradeMonth: "", //升级需要连续达标月数
          trialMonth: "", //试用期月数
        },
      });
  }

  //表单数据双向绑定
  handlelevelIdChange(e, item) {
    let newInfo = this.state.getInfo;
    newInfo[item] = e.target.value;
    console.log(newInfo[item]);
    this.setState({
      getInfo: newInfo,
    });
  }

  // Picker 绑定value值 点击事件
  //是否可降级 isDowngrade
  change = (e) => {
    const getInfo = {
      ...this.state.getInfo,
      isDowngrade: e.detail.value,
    }; //index=用户选择的值
    this.setState({
      getInfo,
    });
  };
  //是否内部员工 isCompany
  ddd = (e) => {
    const getInfo = {
      ...this.state.getInfo,
      isCompany: e.detail.value,
    };
    this.setState({
      getInfo,
    });
  };
  //升级设置 isAutoUpgrade 自动升级0否 1是
  aaa = (e) => {
    const getInfo = {
      ...this.state.getInfo,
      isAutoUpgrade: e.detail.value,
    };
    this.setState({
      getInfo,
    });
  };
  //降级设置 isAutoDowngrade  自动降级 0否 1是
  bbb = (e) => {
    const getInfo = {
      ...this.state.getInfo,
      isAutoDowngrade: e.detail.value,
    };
    this.setState({
      getInfo,
    });
  };
  //展示设置 conditionShow
  ccc = (e) => {
    const getInfo = {
      ...this.state.getInfo,
      conditionShow: e.detail.value,
    };
    this.setState({
      getInfo,
    });
  };

  componentWillMount() {}

  componentDidMount() {
    //根据ID查询等级详情
    const levelId = this.$router.params.id; //接收路由传参值
    CarryTokenRequest(apiUrl.getById, {
      id: levelId,
    })
      .then((res) => {
        this.setState({
          userName: res.data.data.name,
          userId: res.data.data.id,
          userLevle: res.data.data.level,
          getInfo: res.data.data,
        });
      })
      .catch((err) => {});
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  // 接口 编辑保存等级信息
  setData() {
    CarryTokenRequest(apiUrl.getAgentLevelEdit, {
      id: this.state.userId, //路由传的-id
      name: this.state.userName, //路由传的-等级名称
      level: this.state.getInfo.level, //设置的-等级
      isAutoDowngrade: this.state.getInfo.isAutoDowngrade, //是否自动降级 1是 0否
      isCompany: this.state.getInfo.isCompany, //是否属于企业内部员工： 0不是 1是
      isAutoUpgrade: this.state.getInfo.isAutoUpgrade, //是否自动升级  0否 1是
      isDowngrade: this.state.getInfo.isDowngrade, //是否可降级  0否 1是
      conditionShow: this.state.getInfo.conditionShow, //条件展示配置：0不展示 1在所有代理人界面展示  2在未达到该等级的代理人界面展示
      upgradeFee: this.state.getInfo.upgradeFee, //升级费用
      upgradeNumSub: this.state.getInfo.upgradeNumSub, //升级需要第一下级人数
      upgradeNumTeam: this.state.getInfo.upgradeNumTeam, //升级需要团队人数
      upgradeTurnover: this.state.getInfo.upgradeTurnover, //升级需要单月营业额
      upgradeMonth: this.state.getInfo.upgradeMonth, //升级需要连续达标月数
      trialMonth: this.state.getInfo.trialMonth, //试用期月数
    })
      .then((res) => {
        console.log("编辑保存等级信息成功", res);
        if (res.data.code === -1) {
          Taro.showToast({
            title: "等级已存在",
            icon: "none",
            duration: 2000,
          });
        }
        setTimeout(() => {
          Taro.redirectTo({
            url: `/admin/install/install`,
          });
        });
      })
      .catch((err) => {});
  }

  // 提交 添加等级,编辑保存信息 事件
  submitData = () => {
    const {
      level,
      isAutoDowngrade,
      isCompany,
      isAutoUpgrade,
      isDowngrade,
      conditionShow,
      upgradeFee,
      upgradeNumSub,
      upgradeNumTeam,
      upgradeTurnover,
      upgradeMonth,
      trialMonth,
    } = this.state.getInfo;
    if (
      isAutoDowngrade === "" ||
      isCompany === "" ||
      isAutoUpgrade === "" ||
      isDowngrade === "" ||
      conditionShow === "" ||
      upgradeFee === "" ||
      upgradeNumSub === "" ||
      upgradeNumTeam === "" ||
      upgradeTurnover === "" ||
      upgradeMonth === "" ||
      trialMonth === ""
    ) {
      // || level === ''
      Taro.showToast({
        title: "请将信息填写完成",
        icon: "none",
        duration: 2000,
      });
    } else {
      Taro.showToast({
        title: "保存成功",
        icon: "success",
        duration: 2000,
      });
    }
    this.setData(); //编辑保存等级信息 接口
  };

  config = {
    navigationBarTitleText: "代理设置",
  };

  render() {
    const { userName, getInfo } = this.state;
    return (
      //代理设置 页面
      <View className="h5-installProxy">
        <form>
          {/* 代理设置开始 */}
          <view className="installProxy">
            <view className="installProxy-levelName">
              <text className="levelName-title">等级名称：</text>
              <text className="levelName-content">{userName}</text>
            </view>
            <view className="installProxy-level">
              <text>等级：</text>
              <input
                readOnly={true}
                onChange={(e) => {
                  this.handlelevelIdChange(e, "level");
                }}
                type="number"
                placeholder={this.state.userLevle}
              />
            </view>
            <view className="installProxy-upgrade-cost">
              <text>升级费用：</text>
              <input
                onChange={(e) => {
                  this.handlelevelIdChange(e, "upgradeFee");
                }}
                type="number"
                value={getInfo.upgradeFee || ""}
                placeholder="请输入升级费用"
              />
            </view>
            <view className="installProxy-upgrade-firstNum">
              <text>升级需要第一下级人数：</text>
              <input
                onChange={(e) => {
                  this.handlelevelIdChange(e, "upgradeNumSub");
                }}
                type="number"
                value={getInfo.upgradeNumSub || ""}
                placeholder="请设置升级人数"
              />
            </view>
            <view className="installProxy-upgrade-teamNum">
              <text>升级需要团队人数：</text>
              <input
                onChange={(e) => {
                  this.handlelevelIdChange(e, "upgradeNumTeam");
                }}
                type="number"
                value={getInfo.upgradeNumTeam || ""}
                placeholder="请设置需升级团队人数"
              />
            </view>
            <view className="installProxy-upgrade-monthTurnover">
              <text>升级需要单月营业额：</text>
              <input
                onChange={(e) => {
                  this.handlelevelIdChange(e, "upgradeTurnover");
                }}
                type="number"
                value={getInfo.upgradeTurnover || ""}
                placeholder="请设置需单月营业额"
              />
            </view>
            <view className="installProxy-upgrade-continuousMonth">
              <text>升级需要连续达标月数：</text>
              <input
                onChange={(e) => {
                  this.handlelevelIdChange(e, "upgradeMonth");
                }}
                type="number"
                value={getInfo.upgradeMonth || ""}
                placeholder="请设置需连续达标月数"
              />
            </view>
            <view className="installProxy-level">
              <text>试用月数：</text>
              <input
                onChange={(e) => {
                  this.handlelevelIdChange(e, "trialMonth");
                }}
                type="number"
                value={getInfo.trialMonth || ""}
                placeholder="请输入试用时间"
              />
            </view>
            <Picker
              className="item"
              mode="selector"
              range={this.selector}
              onChange={this.change}
              onClick={(e) => {
                this.handlelevelIdChange(e, "isDowngrade");
              }}
              value={this.state.getInfo.isDowngrade}
            >
              <Text className="item-title">是否可降级：</Text>
              <View className="item-select">
                {this.selector[this.state.getInfo.isDowngrade]}
              </View>
            </Picker>

            <Picker
              className="item"
              mode="selector"
              range={this.selectord} //state里对应selectord数组里的数值
              onChange={this.ddd}
              onClick={(e) => {
                this.handlelevelIdChange(e, "isCompany");
              }}
              value={this.state.getInfo.isCompany}
            >
              <Text className="item-title">是否内部员工：</Text>
              <View className="item-select">
                {this.selectord[this.state.getInfo.isCompany]}
              </View>
            </Picker>

            <Picker
              className="item"
              mode="selector"
              range={this.selectora}
              onChange={this.aaa}
              onClick={(e) => {
                this.handlelevelIdChange(e, "isAutoUpgrade");
              }}
              value={this.state.getInfo.isAutoUpgrade}
            >
              <Text className="item-title">升级设置：</Text>
              <View className="item-select">
                {this.selectora[this.state.getInfo.isAutoUpgrade]}
              </View>
            </Picker>

            {//0 是否自动降级 0否 1是
            this.state.getInfo.isDowngrade == 1 ? (
              <Picker
                className="item"
                mode="selector"
                range={this.selectorb}
                onChange={this.bbb}
                onClick={(e) => {
                  this.handlelevelIdChange(e, "isAutoDowngrade", "isDowngrade");
                }}
                value={this.state.getInfo.isAutoDowngrade}
              >
                <Text className="item-title">降级设置：</Text>
                <View className="item-select">
                  {this.selectorb[this.state.getInfo.isAutoDowngrade]}
                </View>
              </Picker>
            ) : (
              ""
            )}

            <Picker
              className="item"
              mode="selector"
              range={this.selectorc}
              onChange={this.ccc}
              onClick={(e) => {
                this.handlelevelIdChange(e, "conditionShow");
              }}
              value={this.state.conditionShow}
            >
              <Text className="item-title">展示设置：</Text>
              <View className="item-select">
                {this.selectorc[this.state.getInfo.conditionShow]}
              </View>
            </Picker>
          </view>
          {/* 代理设置结束 */}
          {/* 保存按钮开始 */}
          <view className="installProxy-btn">
            <view className="btn" onClick={this.submitData}>
              <text className="btn-content">保存</text>
            </view>
          </view>
          {/* 保存按钮结束 */}
        </form>
      </View>
    );
  }
}
