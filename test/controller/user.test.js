const mock = require('egg-mock');
const request = require('supertest');
const { expect } = require('chai');

describe('test/controller/user.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

  it('get api/login/login', done => {
    request(app.callback())
      .post('/api/login/login')
      .send({
        mobile: '13928491884',
        pwd: '123456',
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log('/api/login/register>>>>', res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });

  it('get api/login/register', done => {
    request(app.callback())
      .post('/api/login/register')
      .send({
        mobile: '18680318246',
        pwd: '123456',
        code: '123456',
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log('/api/login/register>>>>', res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });

  it('get api/login/relogin', done => {
    request(app.callback())
      .post('/api/login/relogin')
      .send({
        uid: '67',
        token: 'MlaQXTwIELPx6BuJJ7eyamirgNDe0ts1RD6+3uXVwlI=',
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log('/api/login/relogin>>>>', res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });
  it.only('get api/user/setUserPhoto', done => {
    request(app.callback())
      .post('/api/user/setUserPhoto')
      .send({
        userId: '62',
        photo: 1,
        nickname: 'wave',
        token: 'qhASfxQk68dkY7MmZ4dpEeuoxZxBO6tkxEoJVyTscDs=',
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log('/api/login/relogin>>>>', res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });
});
