const mock = require('egg-mock');
const request = require('supertest');
const { expect } = require('chai');

<<<<<<< HEAD
describe('test/controller/froum.test.js', () => {
=======
describe('test/controller/forum.test.js', () => {
>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
  let app;
  before(() => {
    // 创建当前应用的 app 实例
    app = mock.app();
    // 等待 app 启动成功，才能执行测试用例
    return app.ready();
  });

<<<<<<< HEAD
  /*
  it.only('get /api/news/list', done => {
    request(app.callback())
      .post('/api/news/list')
      .send({
        page: 1,
        size: 10,
=======
  it('get /api/forum/list', done => {
    request(app.callback())
      .post('/api/forum/list')
      .send({
        page: 1,
        size: 4,
>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
<<<<<<< HEAD
  });*/


  it('get /api/forum/boardDetail', done => {
    request(app.callback())
      .post('/api/forum/boardDetail')
      .send({
        id: 1,
=======
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

  it.only('get /api/forum/follow', done => {
    request(app.callback())
      .post('/api/forum/follow')
      .send({
        state: 0,
        boardId: 4,
>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
      })
      .end((err, res) => {
        const info = JSON.parse(res.text);
        console.log(res.text);
        expect(info.status).to.equal(1);
        done();
      });
  });
});
