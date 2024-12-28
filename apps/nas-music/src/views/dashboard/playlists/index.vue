<script lang="ts" setup>
import type { VxeGridListeners, VxeGridProps } from '#/adapter/vxe-table';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { NButton, NTag } from 'naive-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPlaylistsApi, triggerSyncPlaylistsApi } from '#/api';
import { message } from '#/adapter/naive';

const router = useRouter();

interface RowType {
  id: string;
  name: string;
  coverImgUrl: string;
  state: number;
  track_update_time: number;
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
      field: 'coverImgUrl',
      title: '封面',
      width: 100,
    },
    { field: 'name', title: '名称' },
    {
      field: 'track_update_time',
      formatter: 'formatDateTime',
      title: '更新时间',
    },
    { field: 'state', title: '状态', width: 100, slots: { default: 'status' } },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getPlaylistsApi({
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

const gridEvents: VxeGridListeners<RowType> = {
  cellClick: ({ row }) => {
    router.push({ name: 'PlaylistSongs', params: { id: row.id }, query: { name: row.name} });
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridEvents, gridOptions });

function handleSyncPlaylists() {
  triggerSyncPlaylistsApi().then(() => {
    message.success('开始执行同步任务');
  });
}

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
          {{ row.state === 1 ? '已完成' : '未完成' }}
        </NTag>
      </template>
      <template #toolbar-tools>
        <NButton class="mr-2" type="primary" @click="handleSyncPlaylists">
          同步最新数据
        </NButton>
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
