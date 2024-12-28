import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:cog',
      order: -1,
      title: '系统设置',
    },
    name: 'Setting',
    path: '/setting',
    children: [
      {
        name: 'Account',
        path: '/account',
        component: () => import('#/views/setting/account/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:users',
          title: "账号管理",
        },
      },
      {
        name: 'Plugin',
        path: '/plugin',
        component: () => import('#/views/setting/plugin/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:unplug',
          title: "插件管理",
        },
      }
    ],
  },
];

export default routes;
