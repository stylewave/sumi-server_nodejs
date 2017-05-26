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

  it.only('get /api/forum/boardDetail', done => {
    request(app.callback())
      .post('/api/forum/boardDetail')
      .send({
        id: 1,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        // console.log(info);
        expect(info.status).to.equal(1);
        done();
      });
  });


  /*
  it('get /api/forum/detail', done => {
    request(app.callback())
      .post('/api/forum/detail')
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

  it.only('get /api/forum/follow', done => {
    request(app.callback())
      .post('/api/forum/follow')
      .send({
        state: 0,
        boardId: 4,

      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });*/
});
