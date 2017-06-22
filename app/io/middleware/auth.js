module.exports = () => {
  return function* (next) {
    const fd = this.socket.id; // 用户进程id

    // 用户连接上
    this.socket.emit('res', 'connected!');
    yield* next;

    // 用户断开连接
    const userInfo = yield this.service.chat.getUser(fd);
    yield this.service.chat.removeUser(fd); // 删除在线用户
    if (userInfo) this.socket.leave(userInfo.roomid);
    console.log('some on out:', userInfo.user_nickname);
  };
};
