import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './lecturerlist.less';
import '../../common/globalstyle.less';
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';
import Navigation from '../../components/Navigation/Navigation';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty';

// 讲师列表
export default class Lecturerlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lecturerList: [], // 讲师列表数据
      pages: 1, // 总页数
      current: 1, // 当前页
    }
  }

  // 获取讲师列表
  getLecturerList(current = 1) {
    CarryTokenRequest(servicePath.getSysTeacherInfoSelectAll, {
      /* "total": 1, */
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
    navigationBarTitleText: '讲师列表'
  }

  render () {
    const { lecturerList } = this.state
    return (
      <View>
        {
          lecturerList.length === 0 
          ? <CommonEmpty />
          : <View id='lecturer-list'>
              {
                lecturerList.map(item =>
                  <Navigation url={`/admin/lecturerdetails/lecturerdetails?teacherId=${item.teacherId}`} key={item.teacherId}>
                    <View className="lecturer-item" >
                      <img className="item-img" src={item.teacherImg} alt=""/>
                      <View className="lecturer-info">
                        <View className="left-box">
                          <View 
                            className="lecturer-name" 
                            style={{'-webkit-box-orient': 'vertical'}}
                          >
                            {item.teacherName}
                          </View>
                          <View className="lecturer-details" style={{'-webkit-box-orient': 'vertical'}}>
                            {item.personalProfile}
                          </View>
                        </View>
                        <View className="right-box">
                          <View className="details-btn">详情</View>
                        </View>
                      </View>
                    </View>
                  </Navigation>
                )
              }
            </View>
        }
      </View>
    )
  }
}
