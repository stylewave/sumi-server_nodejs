module.exports = () => {
  return function* sendAll() {
    const token = this.args[0];
    const message = this.args[1];
    const fd = this.socket.id; // 用户进程id

    // 检查token ,暂时跳过
    // const checktoken = yield this.service.utils.common.checkToken(token.uid, token.token);

    const userInfo = yield this.service.chat.getUser(fd); // 用户信息
    const moment = require('moment');
    const time = moment().format('YYYY-MM-DD HH:mm:ss');

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
      chat_show: 1,
      chat_create_time: time,
    };

    const id = yield this.service.chat.addChat(data);
    if (id) {
      console.log('sendAll');
      this.app.io.sockets.in(userInfo.roomid).emit('chat1', data); // 直播区
      this.app.io.sockets.in(userInfo.roomid).emit('chat2', data); // 互动区
    } else {
      this.socket.emit('warning', `网络异常,请稍后再试`); // 入库失败!!
    }
  };
};
