module.exports = {
  keys: 'sumi-server-97368234',
  crypKeys: '12345678',
  security: {
    csrf: { enable: false },
    domainWhiteList: [
      'http://192.168.16.22:7001',
      'http://192.168.16.25:3000',
      'http://192.168.16.19:3000',
      'http://192.168.16.254:10002',
    ],
  },
  view: {
    mapping: {
      '.html': 'xtpl',
    },
  },
  io: {
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
      },
    },
  },
  proxyworker: { port: 10086 },
};
