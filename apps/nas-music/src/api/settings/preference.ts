import { requestClient } from '#/api/request';

export namespace PreferencesApi {
 
}

async function getNCMLoginQrcodeUnikeyApi() {
  return requestClient.get('/ncm/login/qrcode/unikey');
}

async function checkNCMLoginQrcodeResultApi(unikey: string) {
  return requestClient.get('/ncm/login/qrcode/check', { params: { unikey } });
}

async function logoutNCMApi() {
  return requestClient.post('/ncm/logout');
}

export { getNCMLoginQrcodeUnikeyApi, checkNCMLoginQrcodeResultApi, logoutNCMApi };
