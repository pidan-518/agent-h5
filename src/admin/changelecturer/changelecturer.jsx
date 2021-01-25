import Taro, { Component } from '@tarojs/taro';
import { View, Form, Input, Textarea, Button } from '@tarojs/components';
import { AtCalendar } from 'taro-ui';
import 'taro-ui/dist/style/components/calendar.scss';
import './changelecturer.less';
import '../../common/globalstyle.less';
import { CarryTokenRequest } from '../../common/util/request';
import servicePath from '../../common/util/api/apiUrl';

// 修改讲师信息
export default class ChangeLecturer extends Component {
  state = {
    headImg: require('../../static/lecturer/add-icon.png'), // 头像
    otherHeadImg: undefined, // 传给后台的头像
    teacherName: '', // 讲师名
    teacherIntro: '', // 讲师介绍
    teacherCourses: '', // 主讲课程
    lecturerDetails: {},
    reserveTimesList: [
      {
        timeId: 1,
        checkout: false,
        timeText: '09:00',
      },
      {
        timeId: 2,
        checkout: false,
        timeText: '09:30',
      },
      {
        timeId: 3,
        checkout: false,
        timeText: '10:00',
      },
      {
        timeId: 4,
        checkout: false,
        timeText: '10:30',
      },
      {
        timeId: 5,
        checkout: false,
        timeText: '11:00',
      },
      {
        timeId: 6,
        checkout: false,
        timeText: '11:30',
      },
      {
        timeId: 7,
        checkout: false,
        timeText: '12:00',
      },
      {
        timeId: 8,
        checkout: false,
        timeText: '14:00',
      },
      {
        timeId: 9,
        checkout: false,
        timeText: '14:30',
      },
      {
        timeId: 10,
        checkout: false,
        timeText: '15:00',
      },
      {
        timeId: 11,
        checkout: false,
        timeText: '15:30',
      },
      {
        timeId: 12,
        checkout: false,
        timeText: '16:00',
      },
      {
        timeId: 13,
        checkout: false,
        timeText: '16:30',
      },
      {
        timeId: 14,
        checkout: false,
        timeText: '17:00',
      },
      {
        timeId: 15,
        checkout: false,
        timeText: '17:30',
      },
      {
        timeId: 16,
        checkout: false,
        timeText: '18:00',
      },
      {
        timeId: 17,
        checkout: false,
        timeText: '18:30',
      },
      {
        timeId: 18,
        checkout: false,
        timeText: '19:00',
      },
      {
        timeId: 19,
        checkout: false,
        timeText: '19:30',
      },
      {
        timeId: 20,
        checkout: false,
        timeText: '20:00',
      },
      {
        timeId: 21,
        checkout: false,
        timeText: '20:30',
      },
      {
        timeId: 22,
        checkout: false,
        timeText: '21:00',
      },
      {
        timeId: 23,
        checkout: false,
        timeText: '21:30',
      },
      {
        timeId: 24,
        checkout: false,
        timeText: '22:00',
      },
    ], // 另存一个可预约时间数组
    reserveTimes: [
      {
        timeId: 1,
        checkout: false,
        timeText: '09:00',
      },
      {
        timeId: 2,
        checkout: false,
        timeText: '09:30',
      },
      {
        timeId: 3,
        checkout: false,
        timeText: '10:00',
      },
      {
        timeId: 4,
        checkout: false,
        timeText: '10:30',
      },
      {
        timeId: 5,
        checkout: false,
        timeText: '11:00',
      },
      {
        timeId: 6,
        checkout: false,
        timeText: '11:30',
      },
      {
        timeId: 7,
        checkout: false,
        timeText: '12:00',
      },
      {
        timeId: 8,
        checkout: false,
        timeText: '14:00',
      },
      {
        timeId: 9,
        checkout: false,
        timeText: '14:30',
      },
      {
        timeId: 10,
        checkout: false,
        timeText: '15:00',
      },
      {
        timeId: 11,
        checkout: false,
        timeText: '15:30',
      },
      {
        timeId: 12,
        checkout: false,
        timeText: '16:00',
      },
      {
        timeId: 13,
        checkout: false,
        timeText: '16:30',
      },
      {
        timeId: 14,
        checkout: false,
        timeText: '17:00',
      },
      {
        timeId: 15,
        checkout: false,
        timeText: '17:30',
      },
      {
        timeId: 16,
        checkout: false,
        timeText: '18:00',
      },
      {
        timeId: 17,
        checkout: false,
        timeText: '18:30',
      },
      {
        timeId: 18,
        checkout: false,
        timeText: '19:00',
      },
      {
        timeId: 19,
        checkout: false,
        timeText: '19:30',
      },
      {
        timeId: 20,
        checkout: false,
        timeText: '20:00',
      },
      {
        timeId: 21,
        checkout: false,
        timeText: '20:30',
      },
      {
        timeId: 22,
        checkout: false,
        timeText: '21:00',
      },
      {
        timeId: 23,
        checkout: false,
        timeText: '21:30',
      },
      {
        timeId: 24,
        checkout: false,
        timeText: '22:00',
      },
    ], // 可预约时间数组
    reserveData: [], // 指定月份发布的记录数据
    isShow: true, // 显示隐藏日历组件
    startTimes: [], // 当月可预约日期
    startTime: '', // 日历选中的日期
    timeFrame: '', // 预约时间段
    teacherId: '', // 讲师id
    courseId: '', // 讲师课程时间id
    month: this.getNowFormatDate(1), // 月份
  };

  // 头像点击事件
  ChangeAvatar = (e) => {
    Taro.showLoading({
      title: '上传中',
    });
    let file = e.target.files[0];
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      Taro.showToast({
        title: '图片必须小于1MB',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.setState({
        headImg: event.target.result,
      });
    };
    var formData = new FormData();
    formData.append('file', file);

    Taro.request({
      url: servicePath.getSysTeacherInfoImportUpload,
      method: 'POST',
      credentials: 'include',
      data: formData,
      success: (res) => {
        console.log('上传讲师图片成功', res.data);
        if (res.data.code === 0) {
          Taro.hideLoading();
          this.setState({
            otherHeadImg: res.data.data,
          });
        }
      },
      fail: (err) => {
        console.log('上传讲师图片异常', err);
      },
    });
  };

  // 讲师姓名输入框事件
  handleTeacherNameInput = (e) => {
    this.setState({
      teacherName: e.detail.value,
    });
  };

  // 讲师个人介绍输入事件
  handleTeacherIntro = (e) => {
    this.setState({
      teacherIntro: e.detail.value,
    });
  };

  // 讲师主讲课程输入事件
  handleTeacherCourses = (e) => {
    this.setState({
      teacherCourses: e.detail.value,
    });
  };

  // 日历月份改变时触发事件
  onMonthChange = (value) => {
    let { reserveTimes } = this.state;
    reserveTimes.map((item) => {
      item.checkout = false;
      return item;
    });
    this.setState(
      {
        reserveTimes,
        courseId: '',
        month: value.slice(0, 7),
        /* startTime: value.start */
      },
      () => {
        this.getSysCourseTimeSelectAll(value.slice(0, 7));
      }
    );
  };

  // 日历选中日期事件
  handleSelectDate = ({ value }) => {
    const { reserveData, reserveTimes } = this.state;
    let nowTime = this.getNowaDaysCanReserveTime();
    let reserveArr = [];
    if (value.start < this.getNowFormatDate()) {
      Taro.showToast({
        title: '请选择当日或当日之后的时间',
        icon: 'none',
        duration: 1000,
        success: () => {
          this.setState({
            reserveTimes: [],
          });
        },
      });
      return;
    } else {
      this.setState(
        {
          reserveTimes: this.state.reserveTimesList,
        },
        () => {
          if (value.start === this.getNowFormatDate()) {
            console.log('进入1');
            for (let item of reserveData) {
              if (item.startTime.substring(0, 10) === value.start) {
                reserveArr = [];
                console.log('进入2');
                this.state.reserveTimes.map((itemTime) => {
                  itemTime.checkout = item.timeFrame
                    .split('-')
                    .includes(itemTime.timeText)
                    ? true
                    : false;
                  if (itemTime.timeText > nowTime) {
                    reserveArr.push(itemTime);
                  }
                  return itemTime;
                });
                this.setState({
                  reserveTimes: reserveArr,
                  startTime: value.start,
                });
                return;
              } else {
                console.log('进入3');
                if (value.start === item.startTime.substring(0, 10)) {
                  console.log('进入4');
                  this.state.reserveTimes.map((itemTime) => {
                    itemTime.checkout = item.timeFrame
                      .split('-')
                      .includes(itemTime.timeText)
                      ? true
                      : false;
                    if (itemTime.timeText > nowTime) {
                      reserveArr.push(itemTime);
                    }
                    return itemTime;
                  });
                  this.setState({
                    reserveTimes: reserveArr,
                    startTime: value.start,
                  });
                } else {
                  console.log('进入5', item);
                  if (value.start === this.getNowFormatDate()) {
                    reserveArr = [];
                    this.state.reserveTimes.map((itemTime) => {
                      itemTime.checkout = false;
                      if (itemTime.timeText > nowTime) {
                        reserveArr.push(itemTime);
                      }
                      return itemTime;
                    });
                    this.setState({
                      reserveTimes: reserveArr,
                      startTime: value.start,
                    });
                  }
                }
              }
            }
          } else {
            console.log('进入6');
            this.setState(
              {
                reserveTimes: this.state.reserveTimesList,
              },
              () => {
                for (let item of reserveData) {
                  if (item.startTime.substring(0, 10) === value.start) {
                    console.log('进入7');
                    this.state.reserveTimes.map((itemTime) => {
                      itemTime.checkout = item.timeFrame
                        .split('-')
                        .includes(itemTime.timeText)
                        ? true
                        : false;
                      return itemTime;
                    });
                  } else {
                    console.log('进入8');
                    this.state.reserveTimes.map((itemTime) => {
                      reserveArr = [];
                      itemTime.checkout = false;
                      return itemTime;
                    });
                  }

                  if (value.start === item.startTime.substring(0, 10)) {
                    console.log('进入9');
                    this.setState({
                      courseId: item.courseId,
                      startTime: value.start,
                    });
                    return;
                  } else {
                    console.log('进入10');
                    if (this.state.courseId === '') {
                      this.setState({
                        startTime: value.start,
                      });
                    } else {
                      this.setState({
                        courseId: item.courseId,
                        startTime: value.start,
                      });
                    }
                  }
                }
              }
            );
          }
        }
      );
    }
  };

  // 表单提交事件
  handleSubmit = (e) => {
    const { teacherName, personalProfile, courseContent } = e.detail.value;
    if (this.state.otherHeadImg === undefined) {
      Taro.showToast({
        title: '请上传讲师图片',
        icon: 'none',
        duration: 1500,
      });
      return false;
    } else if (teacherName === '') {
      Taro.showToast({
        title: '请输入讲师姓名',
        icon: 'none',
        duration: 1500,
      });
      return false;
    } else if (personalProfile === '') {
      Taro.showToast({
        title: '请填写讲师介绍',
        icon: 'none',
        duration: 1500,
      });
      return false;
    } else if (courseContent === '') {
      Taro.showToast({
        title: '请填写主讲课程',
        icon: 'none',
        duration: 1500,
      });
      return false;
    } else {
      Taro.showLoading({ title: '提交中...' });
      if (this.$router.params.state == 1) {
        this.getSysTeacherInfoUpdate(e.detail.value);
      } else {
        this.getSysTeacherInfoInsert(e.detail.value);
      }
    }
  };

  // 可预约时间点击事件
  handleReserveTimeClick = (times) => {
    const { reserveTimes } = this.state;
    reserveTimes.map((item) => {
      if (item.timeId === times.timeId) {
        if (item.checkout) {
          item.checkout = false;
        } else {
          item.checkout = true;
        }
      }
      return item;
    });
    this.setState({
      reserveTimes,
    });
  };

  // 预约时间确定事件
  handleConfirm = () => {
    const { reserveTimes, courseId, reserveData } = this.state;
    let timeFrames = [];
    reserveTimes.forEach((item) => {
      if (item.checkout) {
        timeFrames.push(item.timeText);
      }
    });

    if (courseId === '') {
      if (reserveData.length === 0) {
        if (timeFrames.length === 0) {
          Taro.showToast({
            title: '请选择预约时间',
            icon: 'none',
            duration: 1000,
          });
          return;
        }

        Taro.showModal({
          title: '提示',
          content: '确定修改讲师信息吗？',
          confirmColor: '#E32D2D',
          success: (modalRes) => {
            if (modalRes.confirm) {
              Taro.showLoading({
                title: '提交中...',
                mask: true,
                success: () => {
                  setTimeout(() => {
                    this.getSysCourseTimeInsert(timeFrames.join('-'));
                  }, 500);
                },
              });
            }
          },
        });
      } else {
        for (let item of reserveData) {
          if (
            item.startTime.substring(0, 10) === this.getNowFormatDate() &&
            this.state.startTime === ''
          ) {
            this.setState(
              {
                courseId: item.courseId,
                teacherId: item.teacherId,
                startTime: item.startTime.substring(0, 10),
              },
              () => {
                Taro.showModal({
                  title: '提示',
                  content: '确定修改讲师信息吗？',
                  confirmColor: '#E32D2D',
                  success: (modalRes) => {
                    if (modalRes.confirm) {
                      Taro.showLoading({
                        title: '提交中...',
                        mask: true,
                        success: () => {
                          setTimeout(() => {
                            this.getSysCourseTimeUpdate(timeFrames.join('-'));
                          }, 500);
                        },
                      });
                    }
                  },
                });
              }
            );
          } else {
            if (this.state.startTime === item.startTime.substring(0, 10)) {
              Taro.showModal({
                title: '提示',
                content: '确定修改讲师信息吗？',
                confirmColor: '#E32D2D',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    Taro.showLoading({
                      title: '提交中...',
                      mask: true,
                      success: () => {
                        setTimeout(() => {
                          this.getSysCourseTimeUpdate(timeFrames.join('-'));
                        }, 500);
                      },
                    });
                  }
                },
              });
              return;
            } else {
              if (timeFrames.length === 0) {
                Taro.showToast({
                  title: '请选择预约时间',
                  icon: 'none',
                  duration: 1000,
                });
                return;
              }

              Taro.showModal({
                title: '提示',
                content: '确定修改讲师信息吗？',
                confirmColor: '#E32D2D',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    Taro.showLoading({
                      title: '提交中...',
                      mask: true,
                      success: () => {
                        setTimeout(() => {
                          this.getSysCourseTimeInsert(timeFrames.join('-'));
                        }, 500);
                      },
                    });
                  }
                },
              });
            }
          }
        }
      }
    } else {
      for (let item of reserveData) {
        if (item.startTime.substring(0, 10) === this.state.startTime) {
          this.setState(
            {
              courseId: item.courseId,
              teacherId: item.teacherId,
              startTime: item.startTime.substring(0, 10),
            },
            () => {
              Taro.showModal({
                title: '提示',
                content: '确定修改讲师信息吗？',
                confirmColor: '#E32D2D',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    Taro.showLoading({
                      title: '提交中...',
                      mask: true,
                      success: () => {
                        setTimeout(() => {
                          this.getSysCourseTimeUpdate(timeFrames.join('-'));
                        }, 500);
                      },
                    });
                  }
                },
              });
            }
          );
          return;
        } else {
          Taro.showModal({
            title: '提示',
            content: '确定修改讲师信息吗？',
            confirmColor: '#E32D2D',
            success: (modalRes) => {
              if (modalRes.confirm) {
                Taro.showLoading({
                  title: '提交中...',
                  mask: true,
                  success: () => {
                    setTimeout(() => {
                      this.getSysCourseTimeInsert(timeFrames.join('-'));
                    }, 500);
                  },
                });
              }
            },
          });
        }
      }
    }
  };

  // 返回上一页按钮点击事件
  handleReturnPage = () => {
    Taro.navigateBack({
      delta: 1,
    });
  };

  // 修改讲师信息
  getSysTeacherInfoUpdate(teacherInfo) {
    const teacherImg = this.state.otherHeadImg || this.state.headImg;
    CarryTokenRequest(servicePath.getSysTeacherInfoUpdate, {
      teacherName: teacherInfo.teacherName,
      personalProfile: teacherInfo.personalProfile,
      courseContent: teacherInfo.courseContent,
      teacherImg: teacherImg,
      teacherId: this.$router.params.teacherId,
    })
      .then((res) => {
        console.log('修改讲师信息成功', res.data);
        Taro.hideLoading();
        if (res.data.code === 0) {
          this.setState({
            isShow: false,
          });
        }
      })
      .catch((err) => {
        Taro.hideLoading();
        console.log('修改讲师信息失败', err);
      });
  }

  // 查看讲师基本信息
  getSysTeacherInfoGetById() {
    CarryTokenRequest(servicePath.getSysTeacherInfoGetById, {
      teacherId: this.$router.params.teacherId,
    })
      .then((res) => {
        console.log('查询讲师基本信息成功', res.data);
        if (res.data.code === 0) {
          this.setState({
            lecturerDetails: res.data.data,
            headImg: res.data.data.teacherImg,
            otherHeadImg: res.data.data.teacherImg,
            teacherName: res.data.data.teacherName,
            teacherIntro: res.data.data.personalProfile,
            teacherCourses: res.data.data.courseContent,
          });
        }
      })
      .catch((err) => {
        console.log('查询讲师基本信息失败', err);
      });
  }

  // 查询指定月份发布的记录
  getSysCourseTimeSelectAll() {
    CarryTokenRequest(servicePath.getSysCourseTimeSelectAll, {
      teacherId: this.$router.params.teacherId,
      startTime: this.state.month,
    })
      .then((res) => {
        console.log('查询指定月份发布记录成功', res.data);
        if (res.data.code === 0) {
          let startTimes = []; // 当月可预约日期
          const { reserveTimes } = this.state;
          res.data.data.forEach((item) => {
            startTimes.push({ value: item.startTime });
            if (this.state.startTime === '') {
              if (item.startTime.substring(0, 10) === this.getNowFormatDate()) {
                item.timeFrame.split('-').forEach((itemFrame) => {
                  reserveTimes.map((itemTime) => {
                    if (itemTime.timeText === itemFrame) {
                      itemTime.checkout = true;
                    }
                    return itemTime;
                  });
                });
              }
            } else {
              if (item.startTime.substring(0, 10) === this.state.startTime) {
                item.timeFrame.split('-').forEach((itemFrame) => {
                  reserveTimes.map((itemTime) => {
                    if (itemTime.timeText === itemFrame) {
                      itemTime.checkout = true;
                    }
                    return itemTime;
                  });
                });
              }
            }
          });
          this.setState({
            startTimes,
            reserveData: res.data.data,
            reserveTimes,
          });
        }
      })
      .catch((err) => {
        console.log('查询指定月份发布记录失败', err);
      });
  }

  // 新增课程时间数据
  getSysCourseTimeInsert(timeFrame) {
    const startTime = this.state.startTime
      ? this.state.startTime
      : this.getNowFormatDate();
    CarryTokenRequest(servicePath.getSysCourseTimeInsert, {
      teacherId:
        this.state.teacherId !== ''
          ? this.state.teacherId
          : this.$router.params.teacherId,
      startTime: startTime,
      timeFrame: timeFrame,
    })
      .then((res) => {
        console.log('新增课程时间数据成功', res.data);
        if (res.data.code === 0) {
          Taro.showToast({
            title: '修改讲师信息成功',
            icon: 'success',
            duration: 1500,
            success: () => {
              this.getSysCourseTimeSelectAll();
            },
          });
        } else {
          Taro.showToast({
            title: '修改讲师信息失败',
            icon: 'success',
            duration: 1500,
          });
        }
      })
      .catch((err) => {
        console.log('新增课程时间数据成功', err);
      });
  }

  // 修改课程时间数据
  getSysCourseTimeUpdate(timeFrame) {
    CarryTokenRequest(servicePath.getSysCourseTimeUpdate, {
      courseId: this.state.courseId,
      teacherId: this.$router.params.teacherId,
      startTime: this.state.startTime,
      timeFrame: timeFrame,
    })
      .then((res) => {
        console.log('修改课程时间成功', res.data);
        if (res.data.code === 0) {
          Taro.showToast({
            title: '修改讲师信息成功',
            icon: 'success',
            duration: 1500,
            success: () => {
              this.getSysCourseTimeSelectAll();
            },
          });
        } else {
          Taro.showToast({
            title: '修改讲师信息失败',
            icon: 'success',
            duration: 1500,
          });
        }
      })
      .catch((err) => {
        console.log('修改课程时间失败', err);
      });
  }

  // 设置当天可预约时间
  getNowaDaysCanReserveTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes() + 20;
    let plusHours = minutes > 60 ? hours + 1 : hours;
    let plusMin = minutes > 60 ? minutes - 60 : minutes;
    plusHours = plusHours < 10 ? `0${plusHours}` : plusHours;
    plusMin = plusMin < 10 ? `0${plusMin}` : plusMin;
    let time = `${plusHours}:${plusMin}`;
    return time;
  }

  // 获取年月日
  getNowFormatDate(obtainMonth = '') {
    var date = new Date();
    var seperator1 = '-';
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    if (obtainMonth === 1) {
      return year + seperator1 + month;
    }
    return currentdate;
  }

  componentWillMount() {}

  componentDidMount() {
    let nowTime = this.getNowaDaysCanReserveTime();
    let reserveArr = [];
    if (this.$router.params.state == 1) {
      this.getSysTeacherInfoGetById();
      this.getSysCourseTimeSelectAll();
      this.state.reserveTimes.forEach((item, index) => {
        if (item.timeText > nowTime) {
          reserveArr.push(item);
        }
      });
      this.setState({
        reserveTimes: reserveArr,
      });
    }
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  config = {
    navigationBarTitleText: '修改讲师',
  };

  render() {
    const {
      headImg,
      otherHeadImg,
      lecturerDetails,
      reserveTimes,
      startTimes,
      isShow,
      teacherName,
      teacherIntro,
      teacherCourses,
    } = this.state;

    return (
      <View>
        <View
          id="change-lecturer"
          style={{ display: isShow ? 'block' : 'none' }}
        >
          <View className="upload">
            <View className="upload-box">
              <View className="upload-icon">
                <img className="icon-img" src={headImg} alt="" />
                <input
                  className="upfile"
                  value={otherHeadImg}
                  name="teacherImg"
                  type="file"
                  accept="image/*"
                  onChange={this.ChangeAvatar}
                />
              </View>
              <View className="upload-text">上传头像</View>
            </View>
          </View>
          <View className="lecturer-info">
            <Form onSubmit={this.handleSubmit}>
              <View className="lecturer-name">
                <View className="item-label">姓名：</View>
                <View className="item-value">
                  <Input
                    name="teacherName"
                    onInput={this.handleTeacherNameInput}
                    value={teacherName}
                  />
                </View>
              </View>
              <View className="lecturer-item">
                <View className="item-label">个人介绍：</View>
                <View className="item-value">
                  <Textarea
                    name="personalProfile"
                    onInput={this.handleTeacherIntro}
                    value={teacherIntro}
                    rows="10"
                    maxlength="1000"
                  />
                </View>
              </View>
              <View className="lecturer-item">
                <View className="item-label">主讲课程：</View>
                <View className="item-value">
                  <Textarea
                    name="courseContent"
                    onInput={this.handleTeacherCourses}
                    value={teacherCourses}
                    rows="10"
                    maxlength="1000"
                  />
                </View>
              </View>
              <View className="submit">
                <Button className="submit-btn" formType="submit">
                  下一步
                </Button>
              </View>
            </Form>
          </View>
        </View>
        {/* 日历模块 */}
        <View id="calender-wrap" style={{ display: isShow ? 'none' : 'block' }}>
          <View className="calendar-box">
            {/* <View className="reserve-time">
              <Text>可预约时间：</Text>
              <View>
                <Picker mode="selector" range={monthSel} onChange={this.handleTimeChange}>
                  <View>{monthSel[monthIdx]}</View>
                </Picker>
              </View>
            </View> */}
            <View className="calender-com">
              <AtCalendar
                isSwiper={false}
                name="reserveTime"
                marks={startTimes}
                onMonthChange={this.onMonthChange}
                onSelectDate={this.handleSelectDate}
              />
            </View>
            <View className="reserve-time-list">
              {reserveTimes.map((item) => (
                <View
                  className={item.checkout ? 'list-item-ac' : 'list-item'}
                  key={item.timeId}
                  onClick={this.handleReserveTimeClick.bind(this, item)}
                >
                  <View>{item.timeText}</View>
                </View>
              ))}
            </View>
          </View>
          <View className="submit">
            <Button className="submit-btn" onClick={this.handleConfirm}>
              确定
            </Button>
            <Button className="return-btn" onClick={this.handleReturnPage}>
              返回
            </Button>
          </View>
        </View>
      </View>
    );
  }
}
