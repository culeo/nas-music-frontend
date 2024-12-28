<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';
import { ref } from 'vue';
import { useQRCode } from '@vueuse/integrations/useQRCode';
import { getNCMLoginQrcodeUnikeyApi, checkNCMLoginQrcodeResultApi } from '#/api';
import { message } from '#/adapter/naive';
import { useAuthStore } from '#/store';

// 初始化二维码文本和二维码生成器
const text = ref(''); // 初始化为空，等待接口数据
const qrcode = useQRCode(text, {
  errorCorrectionLevel: 'H',
  margin: 4,
});
const authStore = useAuthStore();
const isQrcodeReady = ref(false); // 标志二维码是否生成完毕

let polling = false; // 控制轮询的标志

// 轮询二维码状态
const pollQRCodeStatus = (unikey: string) => {
  polling = true; // 开启轮询

  const poll = async () => {
    while (polling) {
      try {
        const result = await checkNCMLoginQrcodeResultApi(unikey);
        if (result) {
          console.log('二维码扫描成功:', result);
          polling = false; // 停止轮询
          message.success('登录成功');
          modalApi.close(); // 可选：关闭模态框
          authStore.fetchUserInfo();
        } else {
          console.log('二维码扫描状态未更新:', result);
        }
      } catch (error) {
        console.error('轮询时发生错误:', error);
      }

      // 等待 2 秒再继续轮询
      if (polling) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  };

  poll(); // 启动轮询
};

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  showConfirmButton: false,
  onCancel() {
    polling = false;
    modalApi.close();
  },
  onClosed() {
    polling = false;
  },
  onConfirm() {

  },
  onOpened() {
    const fetchQRCode = async () => {
      isQrcodeReady.value = false;
      const res = await getNCMLoginQrcodeUnikeyApi()
      try {
        console.log('获取二维码数据:', res);
        if (res?.unikey) {
          text.value = `https://music.163.com/login?codekey=${res.unikey}`;
          isQrcodeReady.value = true;
          pollQRCodeStatus(res.unikey);
        } else {
          console.error('未返回有效的二维码数据');
        }
      } catch (error) {
        console.error('请求二维码数据失败:', error);
      };
    }
    // 调用异步函数
    fetchQRCode();
  },
});
</script>
<template>
  <Modal class="w-[500px]" title="扫码登录">
    <div v-if="isQrcodeReady">
      <!-- 二维码显示 -->
      <img :src="qrcode" alt="qrcode" class="w-1/2 m-auto" />
    </div>
    <div v-else class="text-center">
      <!-- 加载状态 -->
      <span>正在加载二维码...</span>
    </div>
  </Modal>
</template>
