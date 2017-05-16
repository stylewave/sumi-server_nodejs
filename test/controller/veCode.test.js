const mock = require('egg-mock');
const request = require('supertest');
const { expect } = require('chai');

describe('test/controller/veCode.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

  it.only('get /', () => {
    request(app.callback()).get('/sendCode/18680318246').end((err, res) => {
      console.log('send code result=', res.text);
      expect(res.status).to.equal(1);
    });
  });
});
