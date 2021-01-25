import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import LecturerItem from '../../components/lecturerItem/lecturerItem';
import './lecturer.less'
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

// 静态图
import itemImg from '../../static/agentPart/ic_share_bg.png'
export default class Lecturer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lecturerList:[],
      current:1,
      pages:1,
    }
  }
  componentWillMount () { }

  componentDidMount () {
    this.getTeacherList(1)
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
   }

  componentWillUnmount () { }

  componentDidShow () { 
    
  }

  componentDidHide () { }
  onReachBottom() { // 上拉加载
    console.log('到底了',this.state.current);
    if (this.state.current === this.state.pages) {
      console.log("进入");
    } else if (this.state.pages !== 0) {
      Taro.showLoading({
        title: '正在加载...'
      })
      this.getTeacherList(this.state.current + 1)
    }
  }
  getTeacherList(current){
    CarryTokenRequest(servicePath.getTeacherList,{
      len:10,
      current,
    })
    .then(res=>{
      console.log('讲师列表',res);
      this.setState({
        lecturerList: [...this.state.lecturerList,...res.data.data.records],
        current:res.data.data.current,
        pages:res.data.data.pages,
      })
      Taro.hideLoading();
    })
    .catch(err=>{
      console.log('讲师列表接口--',err);
    })
  }
  config = {
    navigationBarTitleText: '讲师列表'
  }

  render () {
    const { lecturerList,current,pages } = this.state
    return (
      <View className='lecturer'>
        <LecturerItem lecturerList={lecturerList} url='/agent/lecturerdetail/lecturerdetail' type='teacherId'/>
        {
          current==pages||pages==0?<View className="no-more">-没有更多啦-</View>:''
        }
      </View>
    )
  }
}
