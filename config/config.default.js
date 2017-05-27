module.exports = {
  keys: 'sumi-server-97368234',
  crypKeys: '12345678',
  security: {
    csrf: { enable: false },
    domainWhiteList: [
      'http://192.168.16.19:3001',
    ],
  },
  view: {
    mapping: {
      '.html': 'xtpl',
    },
  },
};

exports.security = {
  domainWhiteList: [
    'http://192.168.16.19:3001',
  ],
};
