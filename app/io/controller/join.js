module.exports = () => {
  return function* join() {
    // !!! 清空当前redis数据库!! 当前测试用!
    // yield this.service.chat.removeDB();

    const message = this.args[0]; // message
    const fd = this.socket.id; // 用户进程id
    // const roomid = message.roomid; // 房间id
    const roomid = 23; // 房间id
    const uid = message.uid; // 房间id
    // console.log('some one join:', roomid, fd);
    const userInfo = yield this.service.chat.getUserInfo(uid);

    userInfo.roomid = roomid;
    userInfo.fd = fd;
    // console.log(userInfo.user_id);

    // 1.获取用户信息,并写入共享库

    const res = yield this.service.chat.addUser(fd, userInfo);

    if (res) {
      // 2.加入指定房间
      this.socket.join(roomid);
      // 3.通知本房间所有人,除了自己
      // 新用户
      this.socket.broadcast.to(roomid).emit('join', `some one join room ${roomid}`);

      // 4.通知本人
      const onlines = this.socket.adapter.rooms[roomid].sockets;
      // console.log('onlines', onlines);
      const online_list = {};
      for (const key in onlines) {
        online_list[key] = yield this.service.chat.getUser(fd); // 获取在线用户
      }
      // 用户在线列表
      this.socket.emit('online', online_list);
      this.socket.emit('selfInfo', userInfo); // 你的个人信息

      if (userInfo) {
        const history = yield this.service.chat.getHistory(uid, userInfo.user_level, roomid);
        // console.log('history', history);
        // 历史记录
        this.socket.emit('history', history);

        // 通知本人
        // this.socket.emit('res', `欢迎您的到来!`);
      }
    } else {
      // error
      this.socket.emit('warning', `网络异常,请稍后再试`); // 无法写入数据
    }
  };
};
