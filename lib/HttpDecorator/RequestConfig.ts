import { RequestConfig } from './types';
import { clone, isObject } from './utils';

export function createIndependentConf(defaultConfig?: RequestConfig) {
  const _cacheConfig: RequestConfig = defaultConfig && isObject(defaultConfig) ? clone(defaultConfig) : {};
  const proxyConfig = new Proxy(_cacheConfig, {
    set() {
      return false;
    },
    get(target: RequestConfig, p: string | symbol, receiver: any) {
      return Reflect.get(target, p, receiver);
    },
  });
  return {
    get(): RequestConfig {
      return proxyConfig;
    },
    set(config: RequestConfig) {
      Object.assign(_cacheConfig, config);
    },
  };
}

export const requestConfig = createIndependentConf();

export function mergeRequestConfig(to: RequestConfig, from: RequestConfig) {
  const configKeys = Object.keys(from) as Array<keyof RequestConfig>;
  for (const key of configKeys) {
    if (isObject(to[key])) {
      Object.assign(to[key], from[key]);
    } else {
      to[key] = from[key];
    }
  }
}
