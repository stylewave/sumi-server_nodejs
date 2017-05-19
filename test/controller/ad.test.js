const mock = require('egg-mock');
const request = require('supertest');
const { expect } = require('chai');

describe('test/controller/ad.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

  it.only('get /api/ad/list', done => {
    request(app.callback())
      .post('/api/ad/list')
      .send({
        page: 'activity',
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });
});
