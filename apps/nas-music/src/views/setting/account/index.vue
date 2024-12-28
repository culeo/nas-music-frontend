<script lang="ts" setup>
import { computed } from 'vue';
import { NCard, NButton } from 'naive-ui'
import { IconifyIcon } from '@vben/icons';
import { useUserStore,  } from '@vben/stores';
import { useAuthStore } from '#/store';
import { useVbenModal } from '@vben/common-ui';
import NCMQrcode from './ncm-qrcode.vue';
import { logoutNCMApi } from '#/api';

interface AccountItem {
  name: string;
  icon: string;
  type: string;
}

const userStore = useUserStore();
const authStore = useAuthStore();

const ncmUsername = computed(() => {
  return userStore.userInfo?.preferences?.ncm_username;
});

const accountItems: AccountItem[] = [
  {
    name: '某云音乐',
    icon: 'carbon:cloud',
    type: 'ncm'
  }
]

const [NCMQrcodeModal, ncmQrCodeModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: NCMQrcode,
});

function openNCMQrCodeModal() {
  ncmQrCodeModalApi.open();
}

function logoutNCM() {
  logoutNCMApi().then(() => {
    authStore.fetchUserInfo();
  });
}

</script>
<template>
  <div class="flex w-full">
    <NCMQrcodeModal />
    <n-card class="m-5 p-0"  :content-style="{ padding: '0' }">
      <template v-for="(item, index) in accountItems" :key="item.title">
        <div
          :class="{
            'border-r-0': index % 3 === 2,
            'border-b-0': index < 3,
            'pb-4': index > 2,
          }"
          class="border-border group w-full cursor-pointer border-r border-t p-4 transition-all hover:shadow-xl md:w-1/2 lg:w-1/3"
        >
          <div class="flex items-center">
            <IconifyIcon
              :icon="item.icon"
              class="size-8 transition-all duration-300 group-hover:scale-110"
              @click="$emit('click', item)"
            />
            <span class="ml-4 text-lg font-bold">{{ item.name }}</span>
          </div>
          <div class="text-foreground/80 mt-4 flex h-5">
            
          </div>
          <div class="text-foreground/80 flex justify-between">
            <template v-if="item.type === 'ncm'">
              <template v-if="ncmUsername">
                <span >已登录：{{ ncmUsername }}</span>
                <n-button type="primary" size="small" @click="logoutNCM">
                  注销
                </n-button>
              </template>
              <template v-else>
                <span>未登录</span>
                <n-button type="primary" size="small" @click="openNCMQrCodeModal">
                  登录
                </n-button>
              </template>
            </template>
          </div>
        </div>
      </template>
    </n-card>
  </div>
</template>

