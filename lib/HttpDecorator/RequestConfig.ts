import { AxiosRequestConfig } from 'axios';
import { isObject, clone } from './utils';

const defaultConfig: AxiosRequestConfig = {};

export const setRequestConfig = (config: AxiosRequestConfig) => {
  Object.assign(defaultConfig, config);
};

export const getDefaultRequestConfig = () => {
  return clone(defaultConfig);
};

export const assignRequestConfig = (target: Record<string, any>, source: Record<string, any>) => {
  for (const key of Object.keys(source)) {
    if (isObject(target[key])) {
      Object.assign(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
};
