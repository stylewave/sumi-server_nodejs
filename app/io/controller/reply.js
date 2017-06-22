module.exports = () => {
  return function* reply() {
    const token = this.args[0]; // token
    const message = this.args[1]; // content
    const replyid = this.args[2]; // replyid
    const fd = this.socket.id; // 用户进程id
    const userInfo = yield this.service.chat.getUser(fd); // 用户信息

    const row = yield this.service.chat.getChat(replyid);

    const moment = require('moment');
    const time = moment().format('YYYY-MM-DD HH:mm:ss');

    const data = {
      chat_fd: row.chat_fd,
      chat_room: row.chat_room,
      chat_name: row.chat_name,
      chat_level: row.chat_level,
      chat_nickname: row.chat_nickname,
      chat_uid: row.chat_uid,
      chat_content: row.chat_content,
      chat_logo: row.chat_logo,
      chat_job_id: row.chat_job_id,
      chat_job_level: row.chat_job_level,
      chat_job_name: row.chat_job_name,
      chat_show: 1,
      chat_create_time: row.chat_create_time,
      // chat_reply:$data.msg,
      // chat_reply:img_to_realpath($data.msg),
      chat_reply: message,
      chat_reply_toid: replyid, // 原信息id
      chat_reply_fd: fd,
      chat_reply_admin: userInfo.user_name,
      chat_reply_adminid: userInfo.user_id,
      chat_reply_nickname: userInfo.user_nickname,
      chat_reply_time: time,
      chat_reply_level: userInfo.user_level,
      chat_reply_logo: userInfo.user_logo,
    };

    const id = yield this.service.chat.replyChat(data, replyid);
    if (id) {
      data.chat_id = id;
      // this.socket.emit('self', data); // 返回给当前用户
      this.app.io.sockets.in(row.chat_room).emit('chat1', data); // 直播区
      this.app.io.sockets.in(row.chat_room).emit('chat2', data); // 互动区
      console.log('sent to part1 and part2');
    } else {
      this.socket.emit('warning', `网络异常,请稍后再试`); // 入库失败!!
    }
  };
};
