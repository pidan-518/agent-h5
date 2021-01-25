import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import './historydetail.less'
import { CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';
export default class historydetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			historydetail: [],//页面数据
		}
	}
	config = {
		navigationBarTitleText: '历史详情'
	}
	componentWillMount() { }

	componentDidMount() {
		this.postList()
	}

	componentWillUnmount() { }

	componentDidShow() { }

	componentDidHide() { }
	postList = () => {
		CarryTokenRequest(apiUrl.agentApplyDetail,
			{ id: this.$router.params.id })
			.then(response => {
				console.log('详情请求', response)
				this.setState({ historydetail: response.data.data });
			})
	}
	render() {
		const { historydetail } = this.state
		return (
			<View className='examineDetail'>
				<View className='content'>
					<View className='applyContent'>
						<View className='applyItemTile'>
							申请内容
            </View>
						<View className='applyItem'>
							<Text>申请事项</Text>
							<Text>:</Text>
							<Text>{historydetail.content}</Text>
						</View>
						<View className='applyItem'>
							<Text>昵称</Text>
							<Text>:</Text>
							<Text>{historydetail.nickName}</Text>
						</View>
						<View className='applyItem'>
							<Text>账号</Text>
							<Text>:</Text>
							<Text>{historydetail.mobile}</Text>
						</View>
						<View className='applyItem'>
							<Text>等级</Text>
							<Text>:</Text>
							<Text>{historydetail.levelName}</Text>
						</View>
					</View>
					<View className='applicant'>
						<View className='applicantItemTitle'>
							申请人
                        </View>
						<View className='applicantItem'>
							<Text>申请人</Text>
							<Text>:</Text>
							<Text>{historydetail.addName}</Text>
						</View>
						<View className='applicantItem'>
							<Text>所属角色</Text>
							<Text>:</Text>
							<Text>{historydetail.addRoleName}</Text>
						</View>
						<View className='applicantItem'>
							<Text>申请时间</Text>
							<Text>:</Text>
							<Text>{historydetail.createTime}</Text>
						</View>
						<View className='applicantItem'>
							<Text>审核结果</Text>
							<Text>:</Text>
							<Text>{historydetail.status == 1 ? '审核通过' : (historydetail.status == 2 ? '审核不通过' : '申请中')}</Text>
						</View>
						<View className='applicantItem'>
							<Text>审批时间</Text>
							<Text>:</Text>
							<Text>{historydetail.auditTime}</Text>
						</View>
					</View>
				</View>
			</View>
		)
	}
}