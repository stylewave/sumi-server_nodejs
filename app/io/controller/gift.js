module.exports = () => {
  return function* gift() {
    const token = this.args[0];
    const itemid = this.args[1];
    const fd = this.socket.id; // 用户进程id
    const userInfo = yield this.service.chat.getUser(fd); // 用户信息
    // this.socket.emit('gift', itemid); // send back to client
    this.app.io.sockets.in(userInfo.roomid).emit('res', 'received in some room');
  };
};
