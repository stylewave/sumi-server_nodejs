const mock = require('egg-mock');
const request = require('supertest');
const { expect } = require('chai');

describe('test/controller/forum.test.js', () => {
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

  it('get /api/forum/listForum', done => {
    request(app.callback())
      .post('/api/forum/listForum')
      .send({
        page: 1,
        size: 4,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });


  it.only('get /api/forum/detailForum', done => {
    request(app.callback())
      .post('/api/forum/detailForum')
      .send({
        boardId: 4,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });
});
