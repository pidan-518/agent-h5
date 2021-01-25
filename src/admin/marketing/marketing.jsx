import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import './marketing.less'
//请求
import { CarryTokenRequest } from '../../common/util/request';
import apiUrl from '../../common/util/api/apiUrl';
// import servicePath from '../../common/util/api/apiUrl';

export default class manageback extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ectensionImg: '', // 推广图
			otherHeadImg: undefined, // 传给后台的头像
			otherImg: undefined,
			businessplan: '',//招商图
			ectensionImg1: "",
			businessplan1: ''
		}

	}
	componentWillMount() { }

	componentDidMount() {
		this.getPromotionPoster2()
		this.getPoster1()
	}
	componentWillUnmount() { }

	componentDidShow() {

	}
	componentDidHide() {
		this.setState({
			businessplan: null,
			ectensionImg: null
		})
	}
	config = {
		navigationBarTitleText: '详情'
	}



	//推广海报
	getPoster1 = () => {
		CarryTokenRequest(apiUrl.selectPostersInfo, {
			'postersType': 1
		})
			.then(res => {
				console.log(res)
				let configValue = res.data.data.configValue
				this.setState({ ectensionImg1: configValue + '?t=' + new Date().getTime(), ectensionImg: configValue + '?t=' + new Date().getTime() })
			})
	}
	//招商海报
	getPromotionPoster2 = () => {
		CarryTokenRequest(apiUrl.selectPostersInfo, {
			'postersType': 2
		})
			.then(res => {
				console.log(res)
				let configValue = res.data.data.configValue
				this.setState({ businessplan: configValue + '?t=' + new Date().getTime(), businessplan1: configValue + '?t=' + new Date().getTime() })
			})
	}
	//预览
	preview = () => {
		Taro.previewImage({
			current: this.state.ectensionImg, // 当前显示图片的http链接
			urls: [this.state.ectensionImg] // 需要预览的图片http链接列表
		})
	}
	//预览
	businessplan = () => {
		Taro.previewImage({
			current: this.state.businessplan, // 当前显示图片的http链接
			urls: [this.state.businessplan] // 需要预览的图片http链接列表
		})
	}
	// 点击上传
	ChangePoster = (e) => {
		Taro.showLoading({
			title: '上传中'
		});
		let file = e.target.files[0];
		console.log(file, 'file', e)
		const isLt2M = file.size / 1024 / 1024 < 1;
		if (!isLt2M) {
			Taro.showToast({
				title: "图片必须小于1MB",
				icon: "none",
				duration: 1000
			});
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(file);
		console.log(reader, 'ggjgjjjk', reader.result)
		reader.onload = (event) => {
			console.log(event, 'gdyhfghudshirdguieh')
			this.setState({
				ectensionImg: reader.result
			})
		}
		var formData = new FormData();
		console.log('file----', file)
		formData.append("file", file);
		formData.append("postersType", 1)

		Taro.request({
			url: apiUrl.uploadPostersUrl,
			method: "POST",
			credentials: "include",
			data: formData,
			success: (res) => {
				console.log("上传图片成功", res.data);
				if (res.data.code === 0) {
					Taro.hideLoading();
					this.setState({
						otherHeadImg: res.data.data
					}, () => {
						Taro.showToast({
							title: "上传成功",
							icon: "success",
							duration: 1000
						});
					});
				} else {
					Taro.hideLoading();
					if (res.data.code === 403) {
						Taro.showToast({
							title: "暂未登录",
							icon: "none",
							duration: 1000,
							success: () => {
								setTimeout(() => {
									Taro.navigateTo({
										url: "/page/login/login"
									})
								}, 1000);
							}
						})
					} else {
						Taro.showToast({
							title: res.data.msg,
							icon: "none",
							duration: 1000
						})
						this.setState({
							ectensionImg: this.state.ectensionImg1
						})
					}
				}
			},
			fail: (err) => {
				Taro.hideLoading();
				Taro.showToast({
					title: "网络连接失败",
					icon: "none",
					duration: 1000
				})
				console.log("上传图片异常", err);
			}
		})
	}
	ChangeBusiness = (e) => {
		Taro.showLoading({
			title: '上传中'
		});
		let file = e.target.files[0];
		console.log(file, 'file', e)
		const isLt2M = file.size / 1024 / 1024 < 1;
		if (!isLt2M) {
			Taro.showToast({
				title: "图片必须小于1MB",
				icon: "none",
				duration: 1000
			});
			return;
		}
		const reader = new FileReader();
		reader.readAsDataURL(file);
		console.log(reader, 'ggjgjjjk', reader.result)
		reader.onload = (event) => {
			console.log(event, 'gdyhfghudshirdguieh')

		}
		var formData = new FormData();
		formData.append("file", file);
		formData.append("postersType", 2)
		Taro.request({
			url: apiUrl.uploadPostersUrl,
			method: "POST",
			credentials: "include",
			data: formData,
			success: (res) => {
				this.setState({
					businessplan: reader.result
				})
				console.log("上传图片成功", res.data);
				if (res.data.code === 0) {
					Taro.hideLoading();
					this.setState({
						otherImg: res.data.data
					}, () => {
						Taro.showToast({
							title: "上传图片成功",
							icon: "success",
							duration: 1000
						});
					});
				} else {
					Taro.hideLoading();
					if (res.data.code === 403) {
						Taro.showToast({
							title: "暂未登录",
							icon: "none",
							duration: 1000,
							success: () => {
								setTimeout(() => {
									Taro.navigateTo({
										url: "/page/login/login"
									})
								}, 1000);
							}
						})
					} else {
						Taro.showToast({
							title: res.data.msg,
							icon: "none",
							duration: 1000
						})
						console.log('123321')
						this.setState({
							businessplan: this.state.businessplan1
						})
					}
				}
			},
			fail: (err) => {
				Taro.hideLoading();
				Taro.showToast({
					title: "网络连接失败",
					icon: "none",
					duration: 1000
				})
				console.log("上传图片异常", err);
			}
		})
	}




	render() {

		const { ectensionImg, otherHeadImg, businessplan } = this.state
		return (
			<View className='marketing' /* style={{minHeight: '2000px'}} */>
				<View className='photoLeft'>
					<View className='leftImage'>
						<img className="icon-img" src={ectensionImg} alt="" />
					</View>
					<View className='leftTitle'>推广海报</View>
					<View className='leftButton'>
						<View className='boxButton'>
							<input className="upfile" value={otherHeadImg} name="teacherImg" type="file" accept="image/*" onChange={this.ChangePoster} />
							<View className='leftUpload'>点击上传</View>
						</View>
						<View className='leftPreview' onClick={this.preview}>预览</View>
					</View>
				</View>
				<View className='photoRight'>
					<View className='rightImage'>
						<img className="icon-img" src={businessplan} alt="" />
					</View>
					<View className='rightTitle'>招商海报</View>
					<View className='rightButton'>
						<View className='boxButton'>
							<input className="upfile" value={otherHeadImg} name="teacherImg" type="file" accept="image/*" onChange={this.ChangeBusiness} />
							<View className='rightUpload'>点击上传</View>
						</View>
						<View className='rightPreview' onClick={this.businessplan}>预览</View>
					</View>
				</View>
			</View>
		)
	}
}
