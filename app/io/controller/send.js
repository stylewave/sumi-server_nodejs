module.exports = () => {
  return function* send() {
    const token = this.args[0];
    const message = this.args[1];
    const fd = this.socket.id; // 用户进程id

    const userInfo = yield this.service.chat.getUser(fd); // 用户信息
    const moment = require('moment');
    const time = moment().format('YYYY-MM-DD HH:mm:ss');

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
      chat_create_time: time,
    };

    const id = yield this.service.chat.addChat(data);
    if (id) {
      data.chat_id = id;
      this.socket.emit('self', data); // 返回给当前用户
    } else {
      this.socket.emit('warning', `网络异常,请稍后再试`); // 入库失败!!
    }
    console.log('insert', id);
  };
};
