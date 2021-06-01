import { RequestConfig } from './types';
import { isObject, clone } from './utils';

const defaultConfig: RequestConfig = {};

/**
 * 设置默认请求配置
 * @param config AxiosRequestConfig
 * @example
 * setRequestConfig({
 *   method: 'get',
 *   baseURL: 'https://some-domain.com/api/',
 *   headers: { 'X-Requested-With': 'XMLHttpRequest' },
 * });
 */
export const setRequestConfig = (config: RequestConfig) => {
  Object.assign(defaultConfig, config);
};

export const getDefaultRequestConfig = () => {
  return clone(defaultConfig);
};

export const assignRequestConfig = <T extends RequestConfig>(to: RequestConfig, from: T) => {
  const configKeys = Object.keys(from) as Array<keyof RequestConfig>;
  for (const key of configKeys) {
    if (isObject(to[key])) {
      Object.assign(to[key], from[key]);
    } else {
      to[key] = from[key];
    }
  }
};
