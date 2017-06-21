const mock = require('egg-mock');
const request = require('supertest');
const { expect } = require('chai');

describe('test/controller/news.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

  it.only('get /api/news/list', done => {
    request(app.callback())
      .post('/api/news/list')
      .send({
        page: 2,
        size: 10,
        token: 'qhASfxQk68dkY7MmZ4dpEcZGtDxlJk6iFLYSok/U0v8=',
        uid: 62,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });


  it('get /api/news/detail', done => {
    request(app.callback())
      .post('/api/news/detail')
      .send({
        newsId: 52,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });
});
