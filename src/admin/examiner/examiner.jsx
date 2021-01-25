import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import './examiner.less';
import CommonEmpty from '../../components/CommonEmpty/CommonEmpty'
import { CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';

export default class Examiner extends Component {
	constructor(props) {
		super(props);
		this.state = {
			controlCurrent: 0, // 分段器当前索引
			auditList: [], //审核列表
			listCurrent: 1, // 列表当前页
			listPages: 1, // 列表总页数
			loading: false,//上拉加载动画
			line: true,//到底显示
			toggle: false
		}
	}

	// 分段器点击事件
	handleControlClick = (item) => {
		item.id == 0
			? this.setState({
				controlCurrent: item.id,
				loading: false,
				line: true,
				auditList: []
			}, () => {
				this.postList();
				console.log('分段', item.id)
			}) : this.setState({
				controlCurrent: item.id,
				loading: false,
				line: true,
				auditList: []
			}, () => {
				this.postHistoryList();
				console.log('分段历史')
			})
	}


	onReachBottom() {
		if (this.state.listCurrent === this.state.listPages) {
			console.log("到底了");
			this.setState({ line: false, loading: false })
		} else {
			this.setState({ loading: true, line: true })
			this.state.controlCurrent == 0 ? this.postList(this.state.listCurrent + 1) : '';
			this.state.controlCurrent == 1 ? this.postHistoryList(this.state.listCurrent + 1) : ''
		}
	}
	//历史记录请求
	postHistoryList = (listCurrent = 1) => {
		CarryTokenRequest(apiUrl.historyList, {
			current: listCurrent, len: 10,
		})
			.then(response => {
				const newList = response.data.data.records;
				console.log('请求历史列表数据成功', response)
				if (newList.length) {
					this.setState(prevState => {
						return {
							auditList: [...prevState.auditList, ...newList],
							listCurrent: response.data.data.current,
							listPages: response.data.data.pages,
							loading: false
						}
					}, () => { console.log('auditList', this.state.auditList, this.state.listCurrent) })
				}
			})
	}
	//请求
	postList = (listCurrent = 1) => {
		CarryTokenRequest(apiUrl.agentApply, {
			current: listCurrent, len: 10,
			status: 0
		})
			.then(response => {
				const newList = response.data.data.records;
				console.log('请求列表数据成功', response)
				if (newList.length) {
					this.setState(prevState => {
						return {
							auditList: [...prevState.auditList, ...newList],
							listCurrent: response.data.data.current,
							listPages: response.data.data.pages,
							loading: false
						}
					})
				}
			})
	}
	componentWillMount() { }

	componentDidMount() { }

	componentWillUnmount() { }

	componentDidShow() {
		this.setState({
			auditList: [],
			loading: false,
			line: true,
			controlCurrent: 0,
		}, () => { this.postList(); })
	}

	componentDidHide() { }

	config = {
		navigationBarTitleText: '审核列表'
	}
	gotodata(item) {
		Taro.navigateTo({
			url: `/admin/examinedetail/examinedetail?id=${item}`
		})
	}
	gotohistorydata(item) {
		Taro.navigateTo({
			url: `/admin/historydetail/historydetail?id=${item}`
		})
	}
	toggle = () => {
		this.setState({
			toggle: !this.state.toggle
		})
		console.log(this.state.toggle)

	}
	render() {
		const controlItems = [
			{ id: 0, title: "审核列表", },
			{ id: 1, title: "历史记录", }
		];
		const { controlCurrent, auditList } = this.state;
		return (
			<View className="examiner-list">
				<View className="examiner-control">
					<View className={this.state.toggle ? 'examiner-nav' : 'examiner-toggle'} >
						{
							controlItems.map(item =>
								<View
									className={controlCurrent === item.id ? "examiner-item-ac item" : "item examiner-item"}
									key={item.id}
									onClick={() => this.handleControlClick(item)}
								>
									<p>{item.title}</p>
								</View>
							)
						}
					</View>
					<View className='examiner-head' onClick={this.toggle} >
						<View className='toggle'>
							{!this.state.toggle ? <p>下拉查看更多信息</p> : null}
							<View className={this.state.toggle ? 'icon' : " icon rotate"} >
								<img className='iconimg' src={require('./static/up.png')} alt="" />
								<img className='iconimg' src={require('./static/up.png')} alt="" />
							</View>
						</View>
					</View>
				</View>
				{this.state.toggle ? <View className='mask' /*style = {{pointerEvents: "none"}}*/ onClick={this.toggle}></View>:null}
				{
					controlCurrent === 0 ?
						auditList.length > 0 ?
							<View className='auditList'>
								{
									auditList.map((item) => {
										return (
											<View className='list-item'>
												<View className='list-left'>
													<View className='list-line'>
														<Text className='text'>申请事项</Text>
														<Text>:</Text>
														<Text>{item.content}</Text>
													</View>
													<View className='list-line'>
														<Text className='text'>昵称</Text>
														<Text>:</Text>
														<Text>{item.nickName}</Text>
													</View>
													<View className='list-line'>
														<Text className='text'>账号</Text>
														<Text>:</Text>
														<Text>{item.mobile}</Text>
													</View>
													<View className='list-line'>
														<Text className='text'>等级</Text>
														<Text>:</Text>
														<Text>{item.levelName}</Text>
													</View>
													<View className='list-line'>
														<Text className='text'>申请时间</Text>
														<Text>:</Text>
														<Text>{item.createTime}</Text>
													</View>
												</View>
												<View className='list-right'>
													{/* <View>&nbsp;</View> */}
													<View className='detaInfor' onClick={() => this.gotodata(item.id)}>
													<img src={require('./static/goto.png')} alt=""/>
													</View>
												</View>
											</View>
										)
									})
								}
							</View>
							: <CommonEmpty />
						: null
				}
				{
					controlCurrent === 1 ?
						auditList.length > 0 ?
							<View className='auditList'>
								{
									auditList.map((item) => {
										return (
											<View className='list-item'>
												<View className='list-left'>
													<View className='list-line'>
														<Text className='text'>申请事项</Text>
														<Text>:</Text>
														<Text>{item.content}</Text>
													</View>
													<View className='list-line'>
														<Text className='text'>昵称</Text>
														<Text>:</Text>
														<Text>{item.nickName}</Text>
													</View>
													<View className='list-line'>
														<Text className='text'>账号</Text>
														<Text>:</Text>
														<Text>{item.mobile}</Text>
													</View>
													<View className='list-line'>
														<Text className='text'>等级</Text>
														<Text>:</Text>
														<Text>{item.levelName}</Text>
													</View>
													<View className='list-line'>
														<Text className='text'>申请时间</Text>
														<Text>:</Text>
														<Text>{item.createTime}</Text>
													</View>
												</View>
												<View className='list-right'>
												
													<View className='detaInfor' onClick={() => this.gotohistorydata(item.id)}>
													<img src={require('./static/goto.png')} alt=""/>
													</View>
													<View className='agreeApply'>{item.status == 1 ? '审核通过' : (item.status == 2 ? '审核不通过' : '申请中')}</View>
												</View>

											</View>
										)
									})
								}
							</View>
							: <CommonEmpty />
						: null
				}
				{this.state.loading == true
					? <View className='load-more'>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
						<span></span></View>
					: ''}
				<View className={this.state.noMoreData ? 'block' : 'hid'} style='text-align:center;font-size:12px' hidden={this.state.line}>--没有更多了--</View>
			</View>
		)
	}
}