import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: "仪表盘",
    },
    name: 'Dashboard',
    path: '/',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: () => import('#/views/dashboard/analytics/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: $t('page.dashboard.analytics'),
        },
      },
      {
        name: 'Playlists',
        path: '/playlists',
        component: () => import('#/views/dashboard/playlists/index.vue'),
        meta: {
          icon: 'carbon:workspace',
          title: $t('我的歌单'),
        },
      },
      {
        name: 'PlaylistSongs',
        path: '/playlists/:id/songs',
        component: () => import('#/views/dashboard/playlists/songs.vue'),
        meta: {
          icon: 'carbon:document',
          title: $t('歌单详情'),
          hideInMenu: true,
        },
      },
    ],
  },
];

export default routes;
