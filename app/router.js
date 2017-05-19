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

  /** socket请求**/
  app.io.route('chat', app.io.controllers.chat);
};
