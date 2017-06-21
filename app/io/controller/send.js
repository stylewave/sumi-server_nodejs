module.exports = () => {
  return function* send() {
    const message = this.args[0];
    const fd = this.socket.id; // 用户进程id

    const userInfo = yield this.service.chat.getUser(fd); // 用户信息

    console.log('some one send :', message);
    const data = {
      chat_fd: fd,
      chat_room: userInfo.roomid,
      chat_name: userInfo.user_name,
      chat_level: userInfo.user_level,
      chat_nickname: userInfo.user_nickname,
      chat_uid: userInfo.user_id,
      chat_logo: userInfo.user_logo,
      chat_job_id: userInfo.user_job_id,
      chat_job_level: userInfo.user_job_level,
      chat_job_name: userInfo.user_job_name,
      // chat_content: img_to_realpath($message),          //注意图片路径要转化
      chat_content: message,
      chat_show: 0,
      chat_create_time: this.app.mysql.literals.now,
    };

    const id = yield this.service.chat.addChat(data);
    if (id) {
      data.data_id = id;
      this.socket.emit('self', data);
    } else {
      this.socket.emit('error', `网络异常,请稍后再试`); // 入库失败!!
    }
    console.log('insert', id);
    // console.log('connect socket io>>>', message);
  };
};
