module.exports = () => {
  return function* leave() {
    // const message = this.args[0]; // message
    // console.log(message);
    console.log('some one leave ');
    // const roomid = 'room_1';
    // console.log('some one join:', roomid);
    // // 加入指定房间
    // this.socket.join(roomid);
    // // 通知本房间所有人,除了自己
    // this.socket.broadcast.to(roomid).emit('res', `some one join room ${roomid}`);
    // // 通知本房间所有人,包括自己
    // // this.app.io.sockets.in(roomid).emit('res', 'all one received?');
    // // 通知本人
    // this.socket.emit('res', `msg is checking ....wait!`);
  };
};
