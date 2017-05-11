module.exports = () => {
  return function* chat() {
    const message = this.args[0];
    this.socket.emit('res', `got your message: ${message}`);
  };
};
