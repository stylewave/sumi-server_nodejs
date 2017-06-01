module.exports = {
  keys: 'sumi-server-97368234',
  crypKeys: '12345678',
  security: {
    csrf: { enable: false },
    domainWhiteList: ['http://localhost:3000', 'http://192.168.16.19:3000'],
  },
  view: {
    mapping: {
      '.html': 'xtpl',
    },
  },
  proxyworker: { port: 10086 },
};
