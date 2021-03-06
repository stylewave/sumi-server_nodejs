module.exports = app => {
  /** http get请求**/
  // app.get('/', 'home.index');
  app.get('/debug/:mobile', 'debug.get');
  app.get('/api/alipay', 'alipay.pay');
  app.get('/api/chat', 'chat.chat');

  /** http post请求**/
  app.post('/api/sendCode', 'veCode.sendCode');
  app.post('/api/login/register', 'login.register');
  app.post('/api/login/forgetPwd', 'login.forgetPwd');
  app.post('/api/login/login', 'login.login');
  app.post('/api/login/relogin', 'login.relogin');
  app.post('/api/ad/list', 'ad.list');
  app.post('/api/ad/activityList', 'ad.activityList');
  app.post('/api/news/list', 'news.list');
  app.post('/api/news/detail', 'news.newsDetail');
  app.get('/api/login/crypt', 'login.crypt');

  app.post('/api/user/setUserPhoto', 'user.setUserPhoto');
  app.post('/api/user/userMsgList', 'user.userMsgList');

  // 股票行情
  app.post('/api/market', 'market.getMarketData');

  // 股吧模板详情
  app.post('/api/forum/boardDetail', 'forum.boardDetail');
  // 股吧模板列表
  app.post('/api/forum/get_stock_board_list', 'forum.get_stock_board_list');
  // 股吧模板热门列表
  app.post('/api/forum/get_stock_board_hot', 'forum.get_stock_board_hot');
  // app.post('/api/forum/detail', 'forum.detail');
  // 关注股吧
  app.post('/api/forum/follow', 'forum.follow');
  // 取消股吧
  app.post('/api/forum/cancelfollow', 'forum.cancelfollow');
  // 股吧主题评论
  app.post('/api/forum/commentdata', 'forum.commentdata');
  // 股吧主题列表
  app.post('/api/forum/sublist', 'forum.sublist');
  // 股吧主题详情
  app.post('/api/forum/forumSubjectDetail', 'forum.forumSubjectDetail');
  // 股吧主题评论的提交
  app.post('/api/forum/addComment', 'forum.addComment');
  // 股吧主题增加
  app.post('/api/forum/addForumSubject', 'forum.addForumSubject');
  // 股吧主题热门列表
  app.post('/api/forum/subHotlist', 'forum.subHotlist');
  // 我的关注股吧列表
  app.post('/api/forum/myBoardlist', 'forum.myBoardlist');

  // 观点列表
  app.post('/api/viewpoint/expertCommentList', 'viewpoint.expertCommentList');
  // 观点详情
  app.post('/api/viewpoint/commentDetail', 'viewpoint.commentDetail');
  // 大数据
  app.post('/api/viewpoint/marketList', 'viewpoint.marketList');
  // 多空舆情列表
  app.post('/api/viewpoint/marketVideo', 'viewpoint.marketVideo');
  // 多空舆情详情
  app.post('/api/viewpoint/marketVideoDetail', 'viewpoint.marketVideoDetail');
  // 购买观点
  app.post('/api/viewpoint/buyExpertComment', 'viewpoint.buyExpertComment');
  // 用户资金记录
  app.post('/api/myaccount/userMoneylog', 'myaccount.userMoneylog');
  app.post('/api/myaccount/userBeanLog', 'myaccount.userBeanLog');
  app.post('/api/myaccount/beanReturnList', 'myaccount.beanReturnList');
  app.post('/api/myaccount/beanReturnDetail', 'myaccount.beanReturnDetail');
  app.post('/api/myaccount/beanReturn', 'myaccount.beanReturn');

  app.post('/api/user/chatRootList', 'user.chatRootList');

  app.post('/api/task/taskList', 'task.taskList');
  app.post('/api/task/finishTask', 'task.finishTask');

  app.post('/api/job/skillList', 'job.skillList');
  app.post('/api/job/jobList', 'job.jobList');
  app.post('/api/job/jobDetail', 'job.jobDetail');
  app.post('/api/job/setJob', 'job.setJob');

  app.post('/api/room/roomList', 'room.roomList');
  app.post('/api/room/buyRoomList', 'room.buyRoomList');

  app.post('/api/sign/signCalendar', 'sign.signCalendar');
  app.post('/api/sign/userSign', 'sign.userSign');

  app.post('/api/user/test', 'user.test');

  /** socket请求**/
  app.io.route('join', app.io.controllers.join);
  app.io.route('send', app.io.controllers.send);
  app.io.route('gift', app.io.controllers.gift);

  app.io.route('reply', app.io.controllers.reply); // admin reply
  app.io.route('pass', app.io.controllers.pass); // admin pass
  app.io.route('sendAll', app.io.controllers.sendAll); // admin broadcast to this room

  // app.get('/home','home.index');
};
