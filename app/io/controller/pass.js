module.exports = () => {
  return function* pass() {
    const token = this.args[0]; // pass token
    const id = this.args[1]; // pass chat_id
    // const fd = this.socket.id; // 用户进程id
    // const userInfo = yield this.service.chat.getUser(fd); // 用户信息

    // 检查token ,暂时跳过
    // const checktoken = yield this.service.utils.common.checkToken(token.uid, token.token);

    const row = yield this.service.chat.getChat(id);
    if (row) {
      const result = yield this.service.chat.passChat(id);
      if (result) {
        this.app.io.sockets.in(row.chat_room).emit('chat2', row); // 互动区

        console.log('pass id', id);
      } else {
        this.socket.emit('warning', `网络异常,请稍后再试`); // 入库失败!!
      }
    } else {
      this.socket.emit('warning', `没有此信息`);
    }
  };
};
