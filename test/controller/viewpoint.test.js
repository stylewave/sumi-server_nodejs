const mock = require('egg-mock');
const request = require('supertest');
const { expect } = require('chai');

describe('test/controller/viewpoint.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });
  it('get /api/viewpoint/commentDetail', done => {
    request(app.callback())
      .post('/api/viewpoint/commentDetail')
      .send({
        commentId: 2,
        userId: 62,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });
  it('get /api/viewpoint/expertCommentList', done => {
    request(app.callback())
      .post('/api/viewpoint/expertCommentList')
      .send({
        page: 1,
        size: 2,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });

  it('get /api/viewpoint/buyExpertComment', done => {
    request(app.callback())
      .post('/api/viewpoint/buyExpertComment')
      .send({
        commentId: 2,
        userId: 62,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });
});
