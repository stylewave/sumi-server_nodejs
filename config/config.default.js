module.exports = {
  keys: 'sumi-server-97368234',
  crypKeys: '12345678',
  security: {
    csrf: { enable: false },
  },
};

exports.security = {
  domainWhiteList: [
    'http://192.168.16.19:3001',
  ],
};
