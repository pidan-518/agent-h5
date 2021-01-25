import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.less";
import { CarryTokenRequest } from "../../common/util/request";
import servicePath from "../../common/util/api/apiUrl";

// 静态图
import noticeImg from '../../static/agentPart/ic_agent_msg.png'
import withdrawImg from '../../static/agentPart/ic_agent_yetx.png'
import settingImg from '../../static/agentPart/ic_settings.png'
import huangIc from '../../static/agentPart/ic_huangguan.png'

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "https://cdn.zhifualliance.com/assets/images/pic_order_none.png",
      teamList: [
        {
          name:'成员信息',
          icon:require('../../static/agentPart/ic_agent_cyxx.png'),
          path:'/agent/team/team',
        },
        {
          name: "订单排行",
          icon: require("../../static/agentPart/ic_agent_ph.png"),
          path: "/agent/orderlist/orderlist",
        },
        {
          name: "消费者会员",
          icon: require("../../static/agentPart/ic_agent_xfzhy.png"),
          path: "/agent/consume/consume",
        },
      ],
      incomeList: [
        {
          name: "综合收益",
          icon: require("../../static/agentPart/ic_agent_all.png"),
          path: "/agent/income/income?type=0",
        },
        {
          name: "自购/分享",
          icon: require("../../static/agentPart/ic_agent_fx.png"),
          path: "/agent/income/income?type=2",
        },
        {
          name: "介绍费",
          icon: require("../../static/agentPart/ic_agent_jies.png"),
          path: "/agent/income/income?type=1",
        },
        {
          name: "直播",
          icon: require("../../static/agentPart/ic_agent_zb.png"),
          path: "/agent/income/income?type=3",
        },
        {
          name: "额外收益",
          icon: require("../../static/agentPart/ic_agent_xrjj.png"),
          path: "/agent/newuser/newuser",
        },
        {
          name: "待收益",
          icon: require("../../static/agentPart/ic_agent_wait.png"),
          path: "/agent/income/income?type=4",
        },
      ],
      otherList: [
        {
          name: "预约讲师",
          icon: require("../../static/agentPart/ic_agent_js.png"),
          path: "/agent/lecturer/lecturer",
        },
        {
          name: "预约记录",
          icon: require("../../static/agentPart/ic_agent_yyjl.png"),
          path: "/agent/reserve/reserve",
        },
        {
          name: "达人邀请",
          icon: require("../../static/agentPart/ic_agent_yq.png"),
          path: "/agent/sharedetail/sharedetail?type=invitation", // /agent/invitation/invitation
        },
        {
          name: "平台分享",
          icon: require("../../static/agentPart/ic_agent_pt.png"),
          path: "/agent/share/share",
        },
        {
          name: "招商海报",
          icon: require("../../static/agentPart/ic_agent_zshb.png"),
          path: "/agent/investmentposter/investmentposter",
        },
        {
          name: "推广海报",
          icon: require("../../static/agentPart/ic_agent_tghb.png"),
          path: "/agent/promotionposter/promotionposter",
        },
        {
          name: "邀请消费者会员",
          icon: require("../../static/agentPart/ic_agent_yqxfzhy.png"),
          path: "/agent/sharedetail/sharedetail?type=consume",
        },
      ],
      info: {},
      income: "",
      number: "",
    };
  }
  componentWillMount() {}

  componentDidMount() {
    console.log(this.state.teamList);
  }

  componentWillUnmount() {}

  componentDidShow() {
    if (window.sessionStorage.getItem("userInfo")) {
      const userId = JSON.parse(window.sessionStorage.getItem("userInfo"))
        .userId;
      this.getAgentUserDetail(userId);
      this.getAgentUserDetailPaid(userId);
    } else {
      Taro.redirectTo({
        url: "/page/login/login",
      });
    }
    const number = Math.random() * 100000;
    this.setState({
      number,
    });
  }

  componentDidHide() {}
  handleNavigateTo = (url) => {
    Taro.navigateTo({
      url,
    });
  };
  getCopy = () => {
    Taro.setClipboardData({
      data: this.state.info.recommendAgentCode,
      success: function(res) {
        Taro.showToast({
          title: "复制成功",
          icon: "success",
          duration: 2000,
        });
      },
    });
  };
  getAgentUserDetail(userId) {
    CarryTokenRequest(servicePath.getAgentUserDetail, { userId })
      .then((res) => {
        console.log("获取代理人信息接口", res);
        this.setState({
          info: res.data.data,
        });
      })
      .catch((err) => {
        console.log("获取代理人信息接口异常--", err);
      });
  }
  getAgentUserDetailPaid(userId) {
    CarryTokenRequest(servicePath.getAgentUserDetailPaid, { userId })
      .then((res) => {
        console.log("获取代理人信息接口", res);
        this.setState({
          income: res.data.data,
        });
      })
      .catch((err) => {
        console.log("获取代理人信息接口异常--", err);
      });
  }
  navigateToWithdrawal = () => {
    const money = this.state.info.canWithdrawalAmount;
    if (Number(money) < 100) {
      Taro.showToast({
        title: "余额不足100元不能申请提现",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    Taro.navigateTo({
      url:
        "/agent/withdrawal/withdrawal?money=" +
        this.state.info.canWithdrawalAmount,
    });
  };
  config = {
    navigationBarTitleText: "代理人",
  };

  render() {
    const {
      teamList,
      incomeList,
      otherList,
      info,
      income,
      number,
    } = this.state;
    return (
      <View className='container'>
        <View className="bg">
          <View className='top'>
            <View className='info'>
              <Image className='header' src={`${info.avatar}?num=${number}`} />
              <View className="right">
                <View className="name-top">
                  <View className='name'>{info.userName}</View>
                  {
                    info.levelName?<View className='tag'><Image className='ic' src={huangIc} />{info.levelName}</View>:''
                  }
                </View>
                <View className="code-invite">
                  <View className="red">我的邀请码：</View>
                  <View className="number">{info.recommendAgentCode}</View>
                  <View className="btn" onClick={this.getCopy}>复制</View>
                </View>
              </View>
              
            </View>
            <View className='number-view'>
              <View className='item'>
                <View className='num'>
                  {info.degradationDate?info.degradationDate.split(' ')[0]:'暂无'}
                </View>
                <View className='text'>
                  升级时间
                </View>
              </View>
              <View className='item'>
                <View className='num'>
                  {info.totalOrderCommission?info.totalOrderCommission:0}
                </View>
                <View className='text'>
                  订单总额
                </View>
              </View>
              <View className='item'>
                <View className='num'>
                  {info.numsOrders?info.numsOrders:0}
                </View>
                <View className='text'>
                  订单总数
                </View>
              </View>
              {/* <View className="text">订单总数</View> */}
            </View>
            <View className='notice'onClick={this.handleNavigateTo.bind(this,'/agent/message/message?type=agent')}>
              <Image className='notice-img' src={noticeImg} />
              <View className='number'>{info.noReadState}</View>
            </View>
            <View className='notice set'onClick={this.handleNavigateTo.bind(this,'/agent/setting/setting')}>
              <Image className='notice-img' src={settingImg} />
            </View>
          </View>
          <View className='mean-view'>
            <View className='number-view'>
              <View className='item'>
                <View className='num'>
                  {info.totalCommission}
                </View>
                <View className='text'>
                佣金总额
                </View>
              </View>
              <View className='item'>
                <View className='num'>
                {info.balanceCommission}
                </View>
                <View className='text'>
                佣金余额
                </View>
              </View>
              <View className='item'>
                <View className='num'>
                  {income?income:0}
                </View>
                <View className='text'>
                待收益
                </View>
              </View>
            </View>
            <Image className='withdraw-img' onClick={this.navigateToWithdrawal} src={withdrawImg}/>
          </View>
        </View>
        <View className="plate-view">
          <View className="title">团队详情</View>
          <View className="item-list">
            {teamList.map((item, index) => {
              return (
                <View
                  key={index}
                  className="item"
                  onClick={this.handleNavigateTo.bind(this, item.path)}
                >
                  <Image className="item-img" src={item.icon} />
                  <View>{item.name}</View>
                </View>
              );
            })}
          </View>
          <View className="title">收益详情</View>
          <View className="item-list">
            {incomeList.map((item, index) => {
              return (
                <View
                  key={index}
                  className="item"
                  onClick={this.handleNavigateTo.bind(this, item.path)}
                >
                  <Image className="item-img" src={item.icon} />
                  <View>{item.name}</View>
                </View>
              );
            })}
          </View>
          <View className="title">其他</View>
          <View className="item-list">
            {otherList.map((item, index) => {
              return (
                <View
                  key={index}
                  className="item"
                  onClick={this.handleNavigateTo.bind(this, item.path)}
                >
                  <Image className="item-img" src={item.icon} />
                  <View>{item.name}</View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}
