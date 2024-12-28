import { requestClient } from '#/api/request';

async function getPluginListApi() {
  return requestClient.get('/plugin/list');
}

async function batchImportPluginsApi(pluginsUrl: string) {
  return requestClient.post('/plugin/batch/import', { url: pluginsUrl });
}

async function uploadPluginApi(file: File) {
  const formData = new FormData();
  formData.append('file', file); // 确保键名 "file" 与后端一致
  return requestClient.post('/plugin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // 让 Axios 或其他库自动处理文件格式
    },
  });
}

async function deletePluginApi(plugin: string) {
  return requestClient.delete(`/plugin/${plugin}`);
}

export { getPluginListApi, batchImportPluginsApi, uploadPluginApi, deletePluginApi };
