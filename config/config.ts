import { defineConfig } from 'umi'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/home',
      component: '@/layouts/home/index',
      title: '首页',
      routes: [{ exact: true, path: '/home/*', redirect: '/home' }],
    },
    {
      path: '/content',
      component: '@/layouts/content/index',
      routes: [
        { path: '/content/index', component: '@/pages/index', title: '页面A' },
        { path: '/content/a', component: '@/pages/a', title: '页面A' },
        { path: '/content/b', component: '@/pages/b', title: '页面B' },
        { exact: true, path: '/content/*', redirect: '/content' },
      ],
    },
    { exact: true, path: '/*', redirect: '/home' },
  ],
  fastRefresh: {},
})
