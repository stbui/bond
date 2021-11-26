import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  publicPath: '/bond/',
  base: '/bond/',

  proxy: {
    '/api': {
      target: 'http://hq.sinajs.cn',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
