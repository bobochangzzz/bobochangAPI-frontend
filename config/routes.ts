export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    name: '接口管理',
    icon: 'appstore',
    path: '/interface_info',
    access: 'canAdmin',
    component: './InterfaceInfo',
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
