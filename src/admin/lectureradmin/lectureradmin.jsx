import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './lectureradmin.less';
import '../../common/globalstyle.less';
import Navigation from '../../components/Navigation/Navigation';
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty';

export default class LecturerAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lecturerList: [], // 讲师列表数据
      pages: 1, // 总页数
      current: 1, // 当前页
    }
  }

  // 讲师删除点击事件
  handleDeleteClick = ({ teacherId }, index) => {
    let { lecturerList } = this.state;
    Taro.showModal({
      /* title: '提示', */
      content: '您确定要删除该讲师吗？',
      cancelColor: "#000",
      confirmColor: "#E32D2D",
      success: (res) => {
        if (res.confirm) {
          lecturerList.splice(index, 1);
          this.getSysTeacherInfoDelete(teacherId);
          this.setState({
            lecturerList
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  // 获取讲师列表
  getLecturerList(current = 1) {
    CarryTokenRequest(servicePath.getSysTeacherInfoSelectAll, {
      "len": 10,
      "current": current
    })
      .then(res => {
        console.log("获取讲师列表成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            lecturerList: [...this.state.lecturerList, ...res.data.data.records],
            pages: res.data.data.pages,
            current: res.data.data.current
          })
        }
      })
      .catch(err => {
        console.log("获取讲师列表接口异常", err);
      })
  }

  // 删除讲师
  getSysTeacherInfoDelete(teacherId) {
    CarryTokenRequest(servicePath.getSysTeacherInfoDelete, {
      teacherId: teacherId
    })
      .then(res => {
        console.log("删除讲师成功", res.data);
        if (res.data.code === 0) {
          Taro.showToast({
            title: "删除讲师成功",
            icon: "success",
            duration: 1000,
          })
        } else {
          Taro.showToast({
            title: "删除讲师失败",
            icon: "none",
            duration: 1500
          })
        }
      })
      .catch(err => {
        console.log("删除讲师失败", err);
      })
  }

  // 编辑讲师点击事件
  handleNavigation = (item) => {
    Taro.navigateTo({
      url: `/admin/changelecturer/changelecturer?state=1&teacherId=${item.teacherId}`
    });
  }

  onReachBottom() {
    if (this.state.current < this.state.pages) {
      this.getLecturerList(this.state.current + 1);
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getLecturerList();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '讲师管理'
  }

  render () {
    const { lecturerList } = this.state
    return (
      <View>
        {
          lecturerList.length === 0 
          ? <CommonEmpty />
          : <View id='lecturer-admin'>
              {
                lecturerList.map((item, index) => 
                  <View className="lecturer-item" key={item.teacherId}>
                    <img className="item-img" src={item.teacherImg} alt=""/>
                    <View className="lecturer-info">
                      <View className="left-box">
                        <View className="lecturer-name" style={{'-webkit-box-orient': 'vertical'}}>
                          {item.teacherName}
                        </View>
                        <View className="lecturer-details" style={{'-webkit-box-orient': 'vertical'}}>
                          {item.personalProfile}
                        </View>
                      </View>
                      <View className="btn-box">
                        <View className="item-btn" onClick={this.handleDeleteClick.bind(this, item, index)}>
                          <img src={require("../../static/lecturer/delete-icon.png")} alt=""/>
                        </View>
                        <View className="item-btn" onClick={this.handleNavigation.bind(this, item)}>
                          <img src={require("../../static/lecturer/comment-icon.png")} alt=""/>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              }
            </View>
        }
      </View>
    )
  }
}
