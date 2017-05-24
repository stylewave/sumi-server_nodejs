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
  app.post('/api/forum/list', 'forum.list');
  app.post('/api/forum/detail', 'forum.detail');
  app.post('/api/forum/follow', 'forum.follow');

  /** socket请求**/
  app.io.route('join', app.io.controllers.chat);

  // app.get('/home','home.index');


};
