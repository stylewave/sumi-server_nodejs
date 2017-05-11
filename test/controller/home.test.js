const mock = require('egg-mock');
const request = require('supertest');
const { expect } = require('chai');

describe('test/controller/home.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

  it('get /', () => {
    request(app.callback()).get('/?foo=bar&quee=quxx').end((err, res) => {
      expect(res.text).to.equal('test hello');
    });
  });
});
