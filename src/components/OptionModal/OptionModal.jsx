/* File Info 
 * Author:      dzk
 * CreateTime:  2020/8/21 下午3:00:38 
 * LastEditor:  your name 
 * ModifyTime:  2020/12/10 下午5:46:24 
 * Description: 模态框组件
*/ 
import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import './OptionModal.less'

export default class OptionModal extends Component {
  constructor(props) {
    super(props)
    // console.log(props)

    this.state = {
      // actionName: this.props.actionName,
    }
  }

  render() {
    return (
      <View id="OptionModal">
        <AtModal isOpened closeOnClickOverlay={false}>
          <AtModalContent>
						{this.props.render}
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.props.handleConfirm}>确定</Button>
            <Button onClick={this.props.handleReject}>取消</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}
