const a = require('awaiting');

module.exports = app => {
  class NewsService extends app.Service {
    async list(page = 1) {
      await a.delay(1000);
      console.log('get news page', page);
      return {
        page,
        list: [
          {
            title: 'a',
            desc: 'b',
          },
          {
            title: 'c',
            desc: 'd',
          },
        ],
      };
    }
  }
  return NewsService;
};
