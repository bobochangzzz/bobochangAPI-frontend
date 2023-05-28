export default [
  {
    path: '/user',
    layout: false,
    routes: [{name: '登录', path: '/user/login', component: './User/Login'}],
  },
  {path: '/', name: '主页', icon: 'smile', component: './Index'},
  {path: '/interface_info/:id', component: './InterfaceInfo', hideInMenu: true},
  {
    name: '接口管理',
    icon: 'appstore',
    path: '/interface_info',
    access: 'canAdmin',
    component: './Admin/InterfaceInfo',
  },
  {path: '*', layout: false, component: './404'},
];
