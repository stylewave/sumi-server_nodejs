module.exports = app => {
  class ChatController extends app.Controller {
    // 拉取广告列表
    async chat() {
      return this.ctx.render(
        'chat.html',
        {
          // data: 'world',
        }
      );
    }
  }
  return ChatController;
};
