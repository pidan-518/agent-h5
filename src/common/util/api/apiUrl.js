let ipUrl = ''
switch (envConstants) {
  case 'pro':
    ipUrl = 'http://istgcl.com/agent-core'
    break;
  case 'pre':
    ipUrl = 'http://121.42.231.22/agent-core'
    break;
  case 'dev':
    ipUrl = 'http://192.168.0.181/agent-core'
    break;
  default:
    break;
}

const servicePath = {
  // 登录API
  getLogin: ipUrl + "/login", // 登录

  // 代理人API
  getAgentUserDetail: ipUrl + "/sysUser/selectAgentUserDetail", // 代理人信息
  getAgentUserDetailPaid: ipUrl + "/sysUser/selectAgentToBePaid", // 代理人收益信息
  getUploadhead: ipUrl + "/sysUser/uploadAvatar", // 代理人上传头像
  getupdateAgentUser: ipUrl + "/sysUser/updateAgentUser", // 代理人上传头像

  // 代理人消息api
  getagentMessageList: ipUrl + "/agentMessage/list", // 提现消息列表
  getagentMessageAdminList: ipUrl + "/agentMessage/adminList", // 系统消息列表
  getagentMessageDetail: ipUrl + "/agentMessage/detail", // 消息列表详情
  getagentMessageStatus: ipUrl + "/agentMessage/updateNotReadMessage", // 已读消息s

  //预约讲师部分api
  getTeacherList: ipUrl + "/sysAgentTime/selectTeacherAll", // 讲师列表
  getTeacherDetail: ipUrl + "/sysTeacherInfo/getById", // 讲师详情
  getTeacherTime: ipUrl + "/sysAgentTime/selectNext", // 查询讲师可预约时间
  getTeacherSubmit: ipUrl + "/sysAgentTime/insert", // 提交预约
  getTeacherUpdate: ipUrl + "/sysAgentTime/update", // 修改预约状态
  getTeacherInTime: ipUrl + "/sysAgentTime/checkHistory", // 检查当前时间段是否已预约
  getReserveList: ipUrl + "/sysAgentTime/selectAll", // 查询预约记录列表
  getReserveDetail: ipUrl + "/sysAgentTime/findById", // 查询预约记录详情

  // 提现申请api
  getAddWithdraw: ipUrl + "/agentWithdraw/add", // 新增提现申请
  getBankList: ipUrl + "/bank/allList", // 获取银行列表
  getsendSmsCode: ipUrl + "/agentWithdraw/sendSmsCode", // 发送短信验证码

  // 代理人收益列表
  getstatisticsList: ipUrl + "/agentIncomeDetail/statisticsList", // 代理人收益列表
  getincomeDetailList: ipUrl + "/agentIncomeDetail/incomeDetailList", // 代理人收益明细
  gettoBePaidStatisticsList: ipUrl + "/agentToBePaid/toBePaidStatisticsList", // 代理人待收益列表
  gettoBePaidList: ipUrl + "/agentToBePaid/toBePaidList", // 代理人待收益明细
  selectNewStaffBonus:ipUrl + '/agentIncomeDetail/selectNewStaffBonus', //查询新人奖金收益
  selectNewStaffBonusDetail:ipUrl + '/agentIncomeDetail/selectNewStaffBonusDetail', //查询新人奖金收益明细

  // 管理员查看降级
  getselectSubstandardStaff:ipUrl + '/sysUserAdmin/selectSubstandardStaff', // 降级审核列表
  getselectStaffDetail:ipUrl + '/sysUserAdmin/selectStaffDetail', // 降级详情
  getsaveDegradation:ipUrl + '/sysUserAdmin/saveDegradation', // 保存降级信息
  getselectNoDemotion:ipUrl + '/sysUserAdmin/selectNoDemotion', // 暂不降级列表

  //分销  管理员界面
  selectAgentUserList: ipUrl + '/sysUserAdmin/selectAgentUserList',//查询代理人/职员列表信息
  selectVoList: ipUrl + '/region/selectVoList',//查询地区列表接口
  selectAgentUserDetail: ipUrl + '/sysUserAdmin/selectAgentUserDetail',//查询代理人详情信息
  updateAgentUserAdmin: ipUrl + '/sysUserAdmin/updateAgentUser',//修改代理人信息
  selectList: ipUrl + "/degradationReasonAdmin/selectList",//查询降级原因配置列表

  //职员管理
  insert: ipUrl + '/degradationReasonAdmin/insert',//添加降级原因
  delete: ipUrl + '/degradationReasonAdmin/delete',//删除降级原因
  update: ipUrl + '/degradationReasonAdmin/update',//修改降级原因

  saveDegradation: ipUrl + '/sysUser/saveDegradation',//降级信息保存
  updateAgentUser: ipUrl + '/sysUser/updateAgentUser',//修改代理人信息
  list: ipUrl + '/agentLevel/list',//查询代理等级列表

  // 管理员界面
  getById: ipUrl + "/agentLevelAdmin/getById",   //根据ID查询等级详情
  setEdit: ipUrl + "/agentLevelAdmin/edit",  //编辑保存等级信息
  getDrawAdminList: ipUrl + "/agentWithdraw/adminList", // 管理员--分页查询提现申请列表
  getDrawPass: ipUrl + "/agentWithdraw/withdrawPass", // 管理员-同意提现申请
  getDrawNotPass: ipUrl + "/agentWithdraw/withdrawNotPass", // 管理员-拒绝提现申请
  getDrawDetail: ipUrl + "/agentWithdraw/detail", // 管理员-提现详情
  getRecordList: ipUrl + "/agentWithdrawRecord/list", // 管理员-提现记录分页查询
  getRecordDetail: ipUrl + "/agentWithdrawRecord/detail", // 管理员-提现记录详情
  getAgentLevelList: ipUrl + "/agentLevelAdmin/list", // 管理员-查询代理等级列表
  getAgentLevelById: ipUrl + "/agentLevel/getById", // 管理员-根据ID查询等级详情
  getAgentLevelEdit: ipUrl + "/agentLevelAdmin/edit", // 管理员-编辑保存等级信息
  getAgentLevelDelete: ipUrl + "/agentLevelAdmin/delete", // 管理员-根据ID删除等级
  getAgentLevelAdd: ipUrl + "/agentLevelAdmin/add", // 管理员-添加等级
  getInterestsConfigList: ipUrl + "/rightInterestsConfigAdmin/list", // 管理员-查询权益列表
  getInterestsConfigById: ipUrl + "/rightInterestsConfigAdmin/getById", // 管理员-根据权益ID查询权益详情
  getInterestsConfigAdd: ipUrl + "/rightInterestsConfigAdmin/add", // 管理员-添加权益
  getInterestsConfigEdit: ipUrl + "/rightInterestsConfigAdmin/edit", // 管理员-编辑保存权益
  getInterestsConfigDelete: ipUrl + "/rightInterestsConfigAdmin/delete", // 管理员-根据ID删除权益
  getCount: ipUrl + '/agentApply/getCount',//查询未审核数量 ---审核-- 

  // 管理员端 新增代理人
  getListAdminAgent: ipUrl + "/sysUserAdmin/listAdminAgent", // 管理员-查询手动添加的代理人
  getAddAdminAgent: ipUrl + "/sysUserAdmin/add", // 管理员-手动添加代理人
  getUpdateAdminAgent: ipUrl + "/sysUserAdmin/update", // 管理员-修改手动添加的代理人
  getregisterSmsCode: ipUrl + "/sysUserAdmin/registerSmsCode", // 管理员-添加代理人发送短信

  // 讲师基础信息API
  getSysTeacherInfoGetById: ipUrl + "/sysTeacherInfo/getById", // 查看讲师基本信息
  getsysTeacherInfoInsert: ipUrl + "/sysTeacherInfo/insert", // 新增讲师
  getSysTeacherInfoUpdate: ipUrl + "/sysTeacherInfo/update", // 修改讲师信息
  getSysTeacherInfoDelete: ipUrl + "/sysTeacherInfo/delete", // 删除讲师数据
  getSysTeacherInfoSelectAll: ipUrl + "/sysTeacherInfo/selectAll", // 查询讲师列表
  getSysTeacherInfoImportUpload: ipUrl + "/sysTeacherInfo/importUpload", // 上传讲师图片
  getSelectAgentHistory: ipUrl + "/sysTeacherInfo/selectAgentHistory", // 查询代理人预约记录
  getAgentById: ipUrl + "/sysTeacherInfo/getAgentById", // 查看讲师基本信息

  // 讲师课程可预约时间API
  getSysCourseTimeSelectAll: ipUrl + "/sysCourseTime/selectAll", // 查询指定月份发布的记录
  getSysCourseTimeInsert: ipUrl + "/sysCourseTime/insert", // 新增课程时间数据
  getSysCourseTimeUpdate: ipUrl + "/sysCourseTime/update", // 修改课程时间数据

  //代理人端 团队详情
  // teamDetailSelectTeamList: "http://192.168.0.102:9961/agent-core/" + "/teamDetail/selectTeamList",  //总人数-列表展示
  teamDetailSelectTeamList: ipUrl + "/teamDetail/selectTeamList",  //总人数-列表展示
  teamDetailCountByMonth: ipUrl + "/teamDetail/countByMonth",  //总人数-统计本月新增人数
  teamDetailCountByLastMonth: ipUrl + "/teamDetail/countByLastMonth",  //总人数-统计上个月新增人数
  teamDetailSelectTeamListByAmount: ipUrl + "/teamDetail/selectTeamListByAmount",  //订单排行-(按金额)
  teamDetailSelectTeamListOrderNum: ipUrl + "/teamDetail/selectTeamListOrderNum ",//订单排行-(按订单数)
  countLevelNum: ipUrl + "/teamDetail/countLevelNum ",//获取各等级人数

  //老板审核 
  agentApply: ipUrl + '/agentApply/list',//分页查询审核列表
  agentApplyDetail: ipUrl + '/agentApply/detail',//通过主键查询单挑数据，详情
  auditAgent: ipUrl + '/agentApply/auditAgent',//审核代理人
  historyList: ipUrl + '/agentApply/historyList',//分页查询审核历史列表

  // 注册
  getRegisterAgent: ipUrl + '/sysUserAdmin/registerAgent',//注册提交表单
  getJudgeTime: ipUrl + '/sysUserAdmin/judgeTime',//免费注册时间
  getcheckPhonenumber: ipUrl + '/sysUserAdmin/checkPhonenumber',//验证注册手机号

  // 注册消费者
  getRegisterPrimaryAgent: ipUrl + '/sysUserAdmin/registerPrimaryAgent',//注册提交表单
  getregisterPrimarySmsCode: ipUrl + "/sysUserAdmin/registerPrimarySmsCode", // 发送短信
  getcheckPrimaryPhonenumber: ipUrl + '/sysUserAdmin/checkPrimaryPhonenumber',//验证注册手机号
  // 消费者会员
  getCountPrimaryAgentNum: ipUrl + '/teamDetail/countPrimaryAgentNum',//消费者会员信息统计
  getSelectTeamPrimaryAgent: ipUrl + '/teamDetail/selectTeamPrimaryAgent',//消费者会员列表和统计

  //营销
  uploadPostersUrl: ipUrl + '/sysUserAdmin/uploadPostersUrl',//上传海报
  selectPostersInfo: ipUrl + '/sysUserAdmin/selectPostersInfo',//海报配置信息
  uploadWechatQrUrl: ipUrl + '/sysUser/uploadWechatQrUrl',//上传代理人二维码图片
  selectWechatQrUrl: ipUrl + '/sysUser/selectWechatQrUrl',//查询代理人二维码图片
}

export default servicePath;
