module.exports = app => {
  app.get('/', 'home.index');
  app.get('/news/:page', 'home.news');
  app.post('createPost', '/api/posts', 'post.create');

  app.io.route('chat', app.io.controllers.chat);
};
