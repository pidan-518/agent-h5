import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import { AtModal, AtModalContent, AtModalAction } from "taro-ui"
import './examinedetail.less'
import { CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';
export default class Examinedetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			agree: false, //同意申请模态框
			reject: false, //驳回申请模态框
			status: null,//审核状态
			examinedetail: [],//页面数据   
		}
	}
	config = {
		navigationBarTitleText: '审核详情'
	}
	componentWillMount() { }

	componentDidMount() {
		this.postList()
		console.log('didshow', this.$router.params)
	}

	componentWillUnmount() { }

	componentDidShow() { }

	componentDidHide() { }
	//详细信息请求
	postList = () => {
		CarryTokenRequest(apiUrl.agentApplyDetail,
			{ id: this.$router.params.id })
			.then(response => {
				console.log('详情请求', response)
				this.setState({ examinedetail: response.data.data });
			})
	}
	//审核
	postAudit = () => {
		CarryTokenRequest(apiUrl.auditAgent,
			{
				status: this.state.status,
				id: this.$router.params.id,
				remark: this.remark
			})
			.then(response => {
				this.setState({ agree: false, reject: false }, () => {
					console.log('审核结果', response)
					const msg = response.data.msg
					Taro.showToast({
						title: `${msg}`,
						icon: 'none',
						duration: 1500,
						success:()=>{setTimeout(()=>{
							this.gotodata()
						  }, 2000)}
					})
				
				})
				// Taro.hideLoading()

			})
	}
	//返回列表页面
	gotodata = () => {
		Taro.navigateBack({
			delta: 1
		});
	}
	//获取备注内容
	remark = (this.state.examinedetail ? this.state.examinedetail.remark : null)
	remarksContent = (e) => {
		this.remark = e.target.value
		console.log(this.remark)
	}
	//同意申请
	agreeClick = () => {
		this.setState({ agree: true })
	}
	//驳回申请
	rejectClick = () => {
		this.setState({ reject: true })
	}


	//同意申请模态
	handleCancelAgree = () => {
		console.log('close')
		this.remark = null
		this.setState({ agree: false })
	}
	handleConfirmAgree = () => {
		console.log('quedin')
		this.setState({ status: 1 }, () => { this.postAudit() })
	}

	//驳回申请模态
	handleCancelReject = () => {
		console.log('驳回取消')
		this.remark = null
		this.setState({ reject: false })
	}
	handleConfirmReject = () => {
		console.log('驳回确定')
		Taro.showLoading({
			title: '正在提交',
		})
		this.setState({ status: 2 }, () => { this.postAudit() })
	}
	render() {
		const { examinedetail } = this.state
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
							<Text>{examinedetail.content}</Text>
						</View>
						<View className='applyItem'>
							<Text>昵称</Text>
							<Text>:</Text>
							<Text>{examinedetail.nickName}</Text>
						</View>
						<View className='applyItem'>
							<Text>账号</Text>
							<Text>:</Text>
							<Text>{examinedetail.mobile}</Text>
						</View>
						<View className='applyItem'>
							<Text>等级</Text>
							<Text>:</Text>
							<Text>{examinedetail.levelName}</Text>
						</View>
					</View>
					<View className='applicant'>
						<View className='applicantItemTitle'>
							申请人
                        </View>
						<View className='applicantItem'>
							<Text>申请人</Text>
							<Text>:</Text>
							<Text>{examinedetail.addName}</Text>
						</View>
						<View className='applicantItem'>
							<Text>所属角色</Text>
							<Text>:</Text>
							<Text>{examinedetail.addRoleName}</Text>
						</View>
						<View className='applicantItem'>
							<Text>申请时间</Text>
							<Text>:</Text>
							<Text>{examinedetail.createTime}</Text>
						</View>
					</View>
				</View>
				<View className='btn'>
					<Button className='reject' onClick={this.rejectClick}>驳回申请</Button>
					<Button className='agree' onClick={this.agreeClick}>同意申请</Button>
				</View>
				<AtModal
					isOpened={this.state.agree}
				>
					<AtModalContent>
						<View className='agreeContent'>
							<View className='agreeApply'>您确定同意该申请吗？</View>
							<View className='agreeInput'>
								<View className='remarks'>备注：</View>
								<Input className='inputText' onInput={this.remarksContent} value={this.remark}></Input>
							</View>
						</View>
					</AtModalContent>
					<AtModalAction> <Button onClick={this.handleCancelAgree}>取消</Button> <Button onClick={this.handleConfirmAgree}>确定</Button> </AtModalAction>
				</AtModal>
				<AtModal
					isOpened={this.state.reject}

				>
					<AtModalContent>
						<View className='agreeContent'>
							<View className='agreeApply'>您确定驳回该申请吗？</View>
							<View className='agreeInput'>
								<View className='remarks'>备注：</View>
								<Input className='inputText' onInput={this.remarksContent} value={this.remark}></Input>
							</View>
						</View>
					</AtModalContent>
					<AtModalAction> <Button onClick={this.handleCancelReject}>取消</Button> <Button onClick={this.handleConfirmReject} >确定</Button> </AtModalAction>
				</AtModal>
			</View>
		)
	}
}