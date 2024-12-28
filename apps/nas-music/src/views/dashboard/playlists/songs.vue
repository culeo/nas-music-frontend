<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import { NButton, NTag } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPlaylistSongsApi } from '#/api';
import { useTabs } from '@vben/hooks';

const route = useRoute();
const {
  setTabTitle,
} = useTabs();

setTabTitle(`${route.query.name} - 歌曲列表`);
// 获取路由参数
const playlistId = route.params.id as string;

interface RowType {
  id: string;
  name: string;
  album_cover: string;
  state: number;
  artist: string;
  album: string;
}

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      cellRender: { name: 'CellImage' },
      field: 'album_cover',
      title: '封面',
      width: 100,
    },
    { field: 'name', title: '名称' },
    { field: 'artist', title: '歌手' },
    { field: 'album', title: '专辑' },
    { field: 'state', title: '状态', width: 100, slots: { default: 'status' } },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        if (!playlistId) {
          throw new Error('Playlist ID is required');
        }
        return await getPlaylistSongsApi(playlistId, {
          page: page.currentPage,
          page_size: page.pageSize,
        });
      },
    },
  },
  showOverflow: false,
  sortConfig: {
    defaultSort: { field: 'category', order: 'desc' },
    remote: true,
  },
  toolbarConfig: {
    custom: true,
    export: true,
    // import: true,
    refresh: { code: 'query' },
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #status="{ row }">
        <NTag
          :bordered="false"
          :type="row.state === 1 ? 'success' : 'warning'"
          round
        >
          {{ row.state === 1 ? '已下载' : '未下载' }}
        </NTag>
      </template>
      <template #toolbar-tools>
        <NButton class="mr-2" type="primary" @click="() => gridApi.query()">
          刷新当前页面
        </NButton>
        <NButton type="primary" @click="() => gridApi.reload()">
          刷新并返回第一页
        </NButton>
      </template>
    </Grid>
  </Page>
</template>
