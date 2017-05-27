module.exports = app => {
  /** http get请求**/
  // app.get('/', 'home.index');
  app.get('/debug/:mobile', 'debug.get');

  /** http post请求**/
  app.post('/api/sendCode', 'veCode.sendCode');
  app.post('/api/login/register', 'login.register');
  app.post('/api/login/forgetPwd', 'login.forgetPwd');
  app.post('/api/login/login', 'login.login');
  app.post('/api/login/relogin', 'login.relogin');
  app.post('/api/ad/list', 'ad.list');
  app.post('/api/news/list', 'news.list');
  app.post('/api/news/detail', 'news.newsDetail');
  app.get('/api/login/crypt', 'login.crypt');

  app.post('/api/forum/boardDetail', 'forum.boardDetail');
  app.post('/api/forum/get_stock_board_list', 'forum.get_stock_board_list');
  app.post('/api/forum/get_stock_board_hot', 'forum.get_stock_board_hot');
  app.post('/api/forum/detail', 'forum.detail');
  app.post('/api/forum/follow', 'forum.follow');
  app.post('/api/forum/commentdata', 'forum.commentdata');
  app.post('/api/forum/sublist', 'forum.sublist');
  app.post('/api/forum/forumSubjectDetail', 'forum.forumSubjectDetail');
  app.post('/api/forum/commentadd', 'forum.commentadd');
  app.post('/api/forum/addForumSubject', 'forum.addForumSubject');

  app.post('/api/viewpoint/expertCommentList', 'viewpoint.expertCommentList');
  app.post('/api/viewpoint/commentDetail', 'viewpoint.commentDetail');
  app.post('/api/viewpoint/marketList', 'viewpoint.marketList');
  app.post('/api/viewpoint/buyExpertComment', 'viewpoint.buyExpertComment');

  app.post('/api/myaccount/userMoneylog', 'myaccount.userMoneylog');

  /** socket请求**/
  app.io.route('join', app.io.controllers.chat);

  // app.get('/home','home.index');


};
