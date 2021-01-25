import Taro, { Component } from "@tarojs/taro";
import { View, Text, Picker, Button, Input } from "@tarojs/components";
import { AtButton, AtModal, AtModalContent, AtModalAction } from "taro-ui";
import "./permissions.less";
import "../../common/globalstyle.less";
import { CarryTokenRequest, postRequest } from "../../common/util/request";
import apiUrl from "../../common/util/api/apiUrl";
// components
import OptionModal from "../../components/OptionModal/OptionModal";
// picture
import guanliyuan from "../../static/common/guanliyuan.png";
import role from "../../static/common/role.png";
import search from "../../static/common/search.png";
import add from "../../static/common/add.png";

export default class permissions extends Component {
  constructor(props) {
    super(props);
    this.roles = ["超级管理员", "财务", "运营", "客服"]; //Picker列表数据 与添加权限角色页面相关联
    this.state = {
      tabList: [
        { name: "管理员", image: guanliyuan, styleName: "image1" },
        { name: "权限角色", image: role, styleName: "image2" },
        { name: "添加", image: guanliyuan, styleName: "image3" },
      ],
      tabIn: 0, //当前选中tab   0:管理员    1:权限角色  2:添加
      showAdd: false, //添加页面的模态框状态
      isShow: false, //管理员模态框控制
      isShowRole: false, //角色模态框控制
      position: 0, //所属角色 默认:超级管理员
      adminList: [
        //管理员信息列表
        { name: "张三", adminPosition: "超级管理员", loginNum: "111" }, //管理员-姓名
        { name: "aaa", adminPosition: "客服", loginNum: "222" }, //管理员-姓名
        { name: "bbb", adminPosition: "财务", loginNum: "333" }, //管理员-姓名
        // name: '',
        // adminPosition: '',
        // loginNum: '',
      ],
      roleList: [
        //权限角色信息列表
        {
          userId: ["10086"],
          rolePosition: ["角色"],
        }, //权限角色-姓名
        // {}, //权限角色-所属角色
      ],
      // name: "啊啊啊",
    };
  }

  //选择管理员身份 事件
  choose = (e) => {
    const position = e.detail.value;
    this.setState({
      position,
    });
  };

  // 点击切换 事件
  getSelectTab = (index) => {
    this.setState({
      tabIn: index !== 2 ? index : this.state.tabIn, //当前选中tab !== 2时,显示当前下标页面内容;当前选中tab == 2时,显示 2 的内容
      showAdd: index !== 2 ? false : true, //当前选中tab == 2时,添加页面的模态框状态为 true; tab !== 2时 添加页面的模态框状态为 false
    });
    if (index === 0) {
      console.log("0");
    } else if (index === 1) {
      console.log("1");
    } else if (index === 2) {
      console.log("2");
    }
  };

  // 删除管理员事件
  handleClickDelete = () => {
    console.log(this.state.adminList[0].name + "管理员要被删除了"); //点击删除图标->管理员模态框显示
    this.setState({
      isShow: true,
    });
  };

  // 跳转 编辑管理员页面事件
  handleClickChangeLevel = () => {
    Taro.navigateTo({
      url: ``,
    });
    console.log("拜拜~~~");
    this.setState({
      isShow: false,
    });
  };

  // 确定删除管理员事件
  handleDelete = () => {
    console.log("真的删除了该管理员");
    this.setState({
      isShow: false,
    });
  };

  // 取消删除管理员 事件
  handleCancelDel = () => {
    console.log("该管理员还活着");
    this.setState({
      isShow: false,
    });
  };

  // --------------------------------------------角色权限---------------------------------------------------

  // 确定删除角色事件
  handleClickDeleteRole = () => {
    console.log("xx角色要被删除啦"); //点击删除图标->角色模态框显示
    this.setState({
      isShowRole: true,
    });
  };

  // 跳转 编辑角色页面事件
  handleClickChangeLevelRole = () => {
    Taro.navigateTo({
      url: ``,
    });
    console.log("拜拜!!!");
    this.setState({
      isShowRole: false,
    });
  };

  // 确定删除角色事件
  handleDeleteRole = () => {
    console.log("真的删除了该角色");
    this.setState({
      isShowRole: false,
    });
  };

  // 取消删除角色事件
  handleCancelDelRole = () => {
    console.log("该角色还活着");
    this.setState({
      isShowRole: false,
    });
  };

  // --------------------------------------------模态框---------------------------------------------------

  // 模态框
  MotalIsShow = () => {
    if (this.state.isShow) {
      const render = (
        <View className="modal-text">
          <p>管理员“{this.state.adminList[0].name}”角色“客服”</p>
          <p>您确定删除该管理员吗？</p>
        </View>
      );
      return (
        <OptionModal
          render={render}
          handleConfirm={this.handleDelete}
          handleReject={this.handleCancelDel}
        ></OptionModal>
      );
    }
    if (this.state.isShowRole) {
      const render = (
        <View className="modal-text">
          <p>角色ID“10086”角色名称“客服”</p>
          <p>您确定删除该角色吗？</p>
        </View>
      );
      return (
        <OptionModal
          render={render}
          handleConfirm={this.handleDeleteRole}
          handleReject={this.handleCancelDelRole}
        ></OptionModal>
      );
    }
  };

  // --------------------------------------------添加---------------------------------------------------

  // 添加管理员事件
  addAdmin = () => {
    Taro.navigateTo({
      url: ``, //`admin/addadministrator/addadministrator`,
    });
    console.log("管理员");
  };

  // 添加权限角色事件
  addRole = () => {
    Taro.navigateTo({
      url: ``, //`/admin/addadminrights/addadminright`,
    });
    console.log("角色");
  };

  // 关闭模态框时 触发的事件
  closeModal = () => {
    console.log("+++模态框被关啦");
    const showAdd = this.state.showAdd;
    this.setState({
      showAdd: false,
    });
  };

  // --------------------------------------------搜索---------------------------------------------------

  //搜索事件
  searchEvent = () => {
    console.log("正在搜索...");
  };

  inputSearch = (e) => {
    console.log("正在努力查找...");
    this.setState(
      {
        adminName: e.target.value,
      },
      () => {
        console.log(this.state.adminName);
      }
    );
  };

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
    navigationBarTitleText: "管理权限",
  };

  render() {
    const { tabList, tabIn, showAdd, adminList, roleList } = this.state;
    return (
      //管理权限 页面
      <View className="h5-permissions">
        {/* 功能栏开始 */}
        <View className="permissions-function">
          {tabList.map((item, index) => {
            return (
              <View
                onClick={this.getSelectTab.bind(this, index)}
                className="function-list"
              >
                <View className={item.styleName}>
                  <img src={item.image} alt="" />
                </View>
                <Text className="content">{item.name}</Text>
              </View>
            );
          })}
        </View>
        {/* 功能栏结束 */}
        {/* 管理员开始 */}
        {tabIn == 0 ? (
          <View className="guanliyuan">
            {/* 管理员顶部开始 */}
            <View className="guanliyuanTop">
              <View className="topContent1">
                <View className="contentStyle">
                  <Picker
                    className="item"
                    mode="selector"
                    range={this.roles}
                    onChange={this.choose}
                    // onClick={(e) => {
                    //   this.handlelevelIdChange(e, "isDowngrade");
                    // }}
                  >
                    <View className="item-select">
                      {this.roles[this.state.position]}
                    </View>
                  </Picker>
                </View>
              </View>
              <View className="topContent2">
                <View className="contentStyle">
                  <input
                    type="text"
                    placeholder="管理员"
                    onChange={(e) => this.inputSearch(e)}
                  />
                </View>
                <View className="topBtn" onClick={this.searchEvent}>
                  <img src={search} alt="" />
                  <Text className="btnText">搜索</Text>
                </View>
              </View>
            </View>
            {/* 管理员导航开始 */}
            <View className="guanliyuanTab">
              <View className="tabList">
                <View className="listItem">
                  <Text className="itemText">管理员</Text>
                </View>
                <View className="listItem">
                  <Text className="itemText">所属角色</Text>
                </View>
                <View className="listItem">
                  <Text className="itemText">登陆账号</Text>
                </View>
                <View className="listItem">
                  <Text className="itemText">操作</Text>
                </View>
              </View>
            </View>
            {/* 管理员内容开始 */}
            {// 遍历管理员信息
            adminList.map((item, index) => {
              return (
                <View className="guanliyuanContent">
                  <View className="contentList">
                    <View className="listItem">
                      <Text className="userName">{item.name}</Text>
                    </View>
                    <View className="listItem">
                      <Text className="userRole">{item.adminPosition}</Text>
                    </View>
                    <View className="listItem">
                      <Text className="userPhone">{item.loginNum}</Text>
                    </View>
                    <View className="listItem">
                      <AtButton
                        className="removeThis"
                        onClick={this.handleClickDelete}
                      ></AtButton>
                      <AtButton
                        className="edit"
                        onClick={this.handleClickChangeLevel}
                      ></AtButton>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          ""
        )}
        {/* 管理员结束 */}
        {/* 权限角色开始 */}
        {tabIn == 1 ? (
          <View className="role">
            <View className="roleTab">
              <View className="tabList">
                <View className="listItem">
                  <Text className="itemText">角色ID</Text>
                </View>
                <View className="listItem">
                  <Text className="itemText">所属角色</Text>
                </View>
                <View className="listItem">
                  <Text className="itemText">操作</Text>
                </View>
              </View>
            </View>
            {/* 角色内容开始 */}
            {// 遍历角色权限信息
            roleList.map((item, index) => {
              return (
                <View className="roleContent">
                  <View className="contentList">
                    <View className="listItem">
                      <Text className="userName">{item.userId}</Text>
                    </View>
                    <View className="listItem">
                      <Text className="userRole">{item.rolePosition}</Text>
                    </View>
                    <View className="listItem">
                      <AtButton
                        className="removeThis"
                        onClick={this.handleClickDeleteRole}
                      ></AtButton>
                      <AtButton
                        className="edit"
                        onClick={this.handleClickChangeLevelRole}
                      ></AtButton>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          ""
        )}
        {/* 权限角色结束 */}
        {/* 添加开始 */}
        <View className="addContent">
          <AtModal
            isOpened={showAdd}
            closeOnClickOverlay={true}
            onClose={this.closeModal}
            className="addModal"
          >
            <AtModalAction className="addModalBtn">
              <View className="btnGuanliyuan" onClick={this.addAdmin}>
                <img src={add} alt="" />
              </View>
              <View className="btnRole" onClick={this.addRole}>
                <img src={add} alt="" />
              </View>
            </AtModalAction>
            <AtModalContent className="addModalContent">
              <Text className="text1">添加管理员</Text>
              <Text className="text2">添加权限角色</Text>
            </AtModalContent>
          </AtModal>
        </View>
        {/* 添加结束 */}
        {/* 模态框 */}
        {this.MotalIsShow()}
      </View>
    );
  }
}
