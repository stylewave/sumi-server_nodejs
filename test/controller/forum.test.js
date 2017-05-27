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

  it('get /api/forum/boardDetail', done => {
    request(app.callback())
      .post('/api/forum/boardDetail')
      .send({
        id: 1,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log('xxxxx');
        console.log(info);
        expect(info.status).to.equal(1);
        done();
      });
  });

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
  it('get /api/forum/list', done => {
    request(app.callback())
      .post('/api/forum/list')
      .send({
        page: 3,
        size: 2,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });


  it('get /api/forum/follow', done => {
    request(app.callback())
      .post('/api/forum/follow')
      .send({
        boardId: 4,
        state: 0,
        userId: 62,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });

  it.only('get /api/forum/sublist', done => {
    request(app.callback())
      .post('/api/forum/sublist')
      .send({
        page: 1,
        size: 2,
        boardId: 1,
        type: 1,
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });

});
