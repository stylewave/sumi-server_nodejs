module.exports = () => {
  return function* gift() {
    const message = this.args[0];
    console.log('received a gift:', message);
    this.socket.emit('res', 'thank you!'); // send back to client
  };
};
