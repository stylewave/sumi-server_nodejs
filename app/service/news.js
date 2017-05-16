// const a = require('awaiting');

module.exports = app => {
  class NewsService extends app.Service {
    async list(page = 1) {
      console.log('get news page', page);
      const data1 = await app.mysql.query('SELECT * FROM data_news limit 2');
      // const data1 = await app.mysql.query('SELECT * FROM data_news limit 2');
      // const data1 = await app.mysql.query('SELECT * FROM data_news limit 2');
      return data1;
      // return {
      //   page,
      //   list: [
      //     {
      //       title: 'a',
      //       desc: 'b',
      //     },
      //     {
      //       title: 'c',
      //       desc: 'd',
      //     },
      //   ],
      // };
    }
  }
  return NewsService;
};
