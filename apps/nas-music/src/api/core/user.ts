import type { BasicUserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

interface UserPreferences {
  ncm_username: String;
}

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  /**
   * 用户描述
   */
  desc: string;
  /**
   * 首页地址
   */
  homePath: string;

  /**
   * accessToken
   */
  token: string;
  
  /**
   * 用户配置
   */
  preferences: UserPreferences;
}

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}
