<script lang="ts" setup>
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { NCard, NUpload, NUploadDragger, NText, NIcon, NInput, NInputGroup, NButton, NSpin } from 'naive-ui'
import { IconifyIcon } from '@vben/icons';
import { batchImportPluginsApi, getPluginListApi, uploadPluginApi, deletePluginApi } from '#/api';
import { message } from '#/adapter/naive';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { UploadCustomRequestOptions } from 'naive-ui'

const show = ref(false);
const pluginsUrl = ref('');

interface RowType {
  name: string;
}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { align: 'left', title: '名称', field: 'name' },
    { slots: { default: 'action' }, title: '操作', width: 100 },
  ],
  stripe: true,
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({  }) => {
        return await getPluginListApi();
      },
    },
  },
  toolbarConfig: {
    custom: false,
    export: false,
    refresh: false,
    zoom: false,
  },
  pagerConfig: {
    enabled: false,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

// 自定义上传逻辑
const customUpload = async (options: UploadCustomRequestOptions) => {
  const { file, onFinish, onError } = options;

  try {
    // 调用上传方法
    await uploadPluginApi(file.file as File);
    message.success('上传成功');
    gridApi.reload();
    onFinish();
  } catch (error) {
    onError();
  }
};

function handleImportClick() {
  show.value = true;
  console.log('pluginsUrl', pluginsUrl.value);
  batchImportPluginsApi(pluginsUrl.value).then(() => {
    message.success('导入成功');
    gridApi.reload();
  }).finally(() => {
    show.value = false;
  })
}

function handleDeleteClick(row: RowType) {
  console.log('row', row);
  deletePluginApi(row.name).then(() => {
    message.success('删除成功');
    gridApi.reload();
  });
}

</script>

<template>
  <Page description="管理第三方插件" title="插件管理" class="my-5">
    <n-card title="本地文件导入" size="small">
      <n-upload
        multiple
        directory-dnd
        :custom-request="customUpload"
        :max="5"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="58" :depth="3">
              <IconifyIcon class="text-2xl" icon="lucide:upload" />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">
            点击或者拖动文件到该区域来上传
          </n-text>
        </n-upload-dragger>
      </n-upload>
    </n-card>
    <n-card title="在线文件导入" size="small" class="my-5">
      <n-spin :show="show">
      <n-input-group>
        <n-input
          class="w-40"
          v-model:value="pluginsUrl"
          placeholder="请输入插件地址"
        />
        <n-button type="primary" @click="handleImportClick">
          导入
        </n-button>
      </n-input-group>
      </n-spin>
    </n-card>
    <n-card title="已安装插件" size="small" class="my-5">
      <!-- 此处的`vp-raw` 是为了适配文档的展示效果，实际使用时不需要 -->
      <div class="vp-raw w-full">
      <Grid>
        <template #action="{ row }">
         <n-button secondary type="error" @click="handleDeleteClick(row)">删除</n-button>
        </template>
      </Grid>
      </div>
    </n-card>
  </Page>
</template>
