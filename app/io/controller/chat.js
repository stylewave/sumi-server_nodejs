module.exports = () => {
  return function* chat() {
    const message = this.args[0];
    console.log('connect socket io>>>', message);
    this.socket.emit('res', `got your message: ${message}`);
  };
};
