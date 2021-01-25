import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./pastDetails.less";
// import "../../common/globalstyle.less";
import apiUrl from "../../common/util/api/apiUrl";
// components
// picture
export default class pastDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  //接口 获取到的等级列表
  // getList() {
  //     CarryTokenRequest(apiUrl.getAgentLevelList, {
  //     })
  //         .then(res => {
  //             // 定义 List 获取代理等级列表
  //             const List = res.data.data
  //             // 往数据里添加 img属性-图片地址
  //             List.forEach((item,index)=>{
  //                 switch (item.name) {
  //                     case '区域总监':
  //                     List[index].img = require('../../static/scattered/regionalDirector.png')
  //                     break;
  //                     case '业务总监':
  //                     List[index].img = require('../../static/scattered/salesDirector.png')
  //                     break;
  //                     case '区域经理':
  //                     List[index].img = require('../../static/scattered/areamanager.png')
  //                     break;
  //                     case '业务经理':
  //                     List[index].img = require('../../static/scattered/manager.png')
  //                     break;
  //                     case '网红店长':
  //                     List[index].img = require('../../static/scattered/shopOrdersToReview.png')
  //                     break;
  //                     case '电商达人':
  //                     List[index].img = require('../../static/scattered/expert.png')
  //                     break;
  //                     default:
  //                     break;
  //                 }
  //             })
  //             this.setState({
  //                 items: List
  //             })

  //         }).catch(err => {})
  // }
  config = {
    navigationBarTitleText: "详情",
  };

  render() {
    const {} = this.state;
    return (
      //详情 页面
      <View className="h5-pastDetails">
        {/* 申请内容开始 */}
        <View className="applyContent">
          <View className="title">申请内容</View>
          <View className="content">
            <View className="contentLeft">
              <View className="items">申请事项</View>
              <View className="nickname">昵称</View>
              <View className="account">账号</View>
              <View className="level">等级</View>
            </View>
            <View className="symbol">
              <View>：</View>
              <View>：</View>
              <View>：</View>
              <View>：</View>
            </View>
            <View className="contentRight">
              <View className="itemsContent">新增代理人</View>
              <View className="nicknameContent">123</View>
              <View className="accountContent">111222333</View>
              <View className="levelContent">业务经理</View>
            </View>
          </View>
        </View>
        {/* 申请内容结束 */}
        {/* 申请人开始 */}
        <View className="applicant">
          <View className="userTitle">申请人</View>
          <View className="content">
            <View className="contentLeft">
              <View className="user">申请人</View>
              <View className="role">申请事项</View>
              <View className="applyTime">昵称</View>
              <View className="results">账号</View>
              <View className="resultsTime">等级</View>
            </View>
            <View className="symbol">
              <View>：</View>
              <View>：</View>
              <View>：</View>
              <View>：</View>
            </View>
            <View className="contentRight">
              <View className="userContent">张三</View>
              <View className="roleContent">运营</View>
              <View className="applyTimeContent">2020</View>
              <View className="resultsContent">同意</View>
              <View className="resultsTimeContent">20200914</View>
            </View>
          </View>
        </View>
        {/* 申请人结束 */}
      </View>
    );
  }
}
