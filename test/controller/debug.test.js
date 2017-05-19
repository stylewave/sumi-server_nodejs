const mock = require('egg-mock');
const request = require('supertest');
const { expect } = require('chai');

describe('test/controller/debug.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

  it('get /debug', done => {
    request(app.callback()).get('/debug/18680318246').end((err, res) => {
      const info = JSON.parse(res.text);
      console.log('/debug>>>>', res.text);
      expect(info.status).to.equal(1);
      done();
    });
  });
});
