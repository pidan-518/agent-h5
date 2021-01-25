import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtSegmentedControl }  from 'taro-ui'
import './reservelist.less';
import '../../common/globalstyle.less';
import Navigation from '../../components/Navigation/Navigation';
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

export default class ReserveList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controlCurrent: 0, // 分段器当前索引
      reserveList: [], // 已预约列表
      listCurrent: 1, // 列表当前页
      listPages: 1, // 列表总页数
      itemIds: [] // 分段器点击时传给后台的预约状态 [0, 1]: 已取消及预约中 [2]: 已预约 
    }
  }

  // 分段器点击事件
  handleControlClick (item) {
    this.setState({
      controlCurrent: item.id,
      itemIds: item.itemIds,
      reserveList: []
    }, () => {
      this.getSelectAgentHistory(item.itemIds)
    });
  }

  // 查询代理人预约记录
  getSelectAgentHistory(itemIds = [2], current = 1) {
    CarryTokenRequest(servicePath.getSelectAgentHistory, {
      "itemIds": itemIds,
      "current": current,
      "len": 10
    })
      .then(res => {
        console.log("查询代理人预约记录成功", res.data);
        if (res.data.code === 0) {
          this.setState({
            reserveList: [...this.state.reserveList, ...res.data.data.records],
            listCurrent: res.data.data.current,
            listPages: res.data.data.pages
          })
        }
      })
      .catch(err => {
        console.log("查询代理人预约记录失败", err);
      })
  }

  onReachBottom() {
    if (this.state.listCurrent === this.state.listPages) {
      console.log("到底了");
    } else {
      this.getSelectAgentHistory(this.state.itemIds, this.state.listCurrent + 1);
    }
  }

  componentWillMount () { }

  componentDidMount () { 
    this.getSelectAgentHistory();
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config = {
    navigationBarTitleText: '预约列表'
  }

  render () {
    const controlItems = [
      {
        id: 0,
        title: "已预约",
        itemIds: [2],
      },
      {
        id: 1,
        title: "历史记录",
        itemIds: [0, 1]
      }
    ];

    const { controlCurrent, reserveList } = this.state;

    return (
      // 成员信息 页面
      <View id="reserve-list">
        <View className="asegmented-control">
          {
            controlItems.map(item => 
              <View 
                className={controlCurrent === item.id ? "control-item-ac" : "control-item"} 
                key={item.id} 
                onClick={this.handleControlClick.bind(this, item)}
              >
                {item.title}
              </View>
            )
          }
        </View>
        {
          controlCurrent === 0 
          ? <View className="list">
              {
                reserveList.map(item => 
                  <View className="list-item" key={item.planId}>
                    <View className="user-head">
                      <img src={item.avatar} alt=""/>
                      <View className="user-tag">{ item.name }</View>
                    </View>
                    <View className="item-content">
                      <View className="content-line">
                        <Text>预约人：</Text>
                        <Text>{item.userName}</Text>
                      </View>
                      <View className="content-line">
                        <Text>预约讲师：</Text>
                        <Text>{item.teacherName}</Text>
                      </View>
                      <View className="content-line">
                        <Text>预约时间：</Text>
                        <Text>{item.startTime}</Text>
                      </View>
                    </View>
                    <View className="detail-info">
                      <Navigation url={`/admin/reservedetails/reservedetails?planId=${item.planId}`}>
                        <View className="detail-text">详情信息</View>
                      </Navigation>
                    </View>
                  </View>
                )
              }
            </View>
          : null
        }
        {
          controlCurrent === 1
          ? <View className="list">
              {
                reserveList.map(item => 
                  <View className="list-item" key={item.planId}>
                    <View className="user-head">
                      <img src={item.avatar} alt=""/>
                      <View className="user-tag">{ item.name }</View>
                    </View>
                    <View className="item-content">
                      <View className="content-line">
                        <Text>预约人：</Text>
                        <Text>{item.userName}</Text>
                      </View>
                      <View className="content-line">
                        <Text>预约讲师：</Text>
                        <Text>{item.teacherName}</Text>
                      </View>
                      <View className="content-line">
                        <Text>预约时间：</Text>
                        <Text>{item.startTime}</Text>
                      </View>
                    </View>
                    <View className="detail-info">
                      <Navigation url={`/admin/reservedetails/reservedetails?planId=${item.planId}`}>
                        <View className="detail-text">详情信息</View>
                      </Navigation>
                    </View>
                  </View>
                )
              }
            </View>
          : null
        }
      </View>
    )
  }
}