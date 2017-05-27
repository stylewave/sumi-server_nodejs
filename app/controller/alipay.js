module.exports = app => {
  class AlipayController extends app.Controller {
    async pay() {
      return this.ctx.render('hello.html', {
        data: 'world',
      });
    }
  }
  return AlipayController;
};
