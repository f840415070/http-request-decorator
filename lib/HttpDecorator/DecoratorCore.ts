import axios, { AxiosInstance } from 'axios';
import { mergeRequestConfig } from './RequestConfig';
import { isNumber, clone } from './utils';
import { getAllMetadata } from './metadata';
import {
  HttpMethod,
  RequestConfig,
  Metadata,
  HttpResponse,
} from './types';

const isValidIndex = (index: number) => isNumber(index) && index >= 0;

const setConfig = (config: RequestConfig, metadata: Metadata, args: any[]) => {
  if (metadata.config) {
    mergeRequestConfig(config, metadata.config);
  }
  if (isValidIndex(metadata.configIndex)) {
    mergeRequestConfig(config, args[metadata.configIndex]);
  }
};

const setParams = (config: RequestConfig, metadata: Metadata, args: any[], method: HttpMethod) => {
  const requestParams = {};
  if (metadata.params) {
    Object.assign(requestParams, metadata.params);
  }
  if (isValidIndex(metadata.paramsIndex)) {
    Object.assign(requestParams, args[metadata.paramsIndex]);
  }
  // 'POST' | 'PUT' | 'PATCH' 请求的参数放在 data 字段，'GET' 等请求放在 params 字段
  const paramsField = (['POST', 'PUT', 'PATCH'].includes(method)) ? 'data' : 'params';
  mergeRequestConfig(config, { [paramsField]: requestParams });
};

const setHeaders = (config: RequestConfig, metadata: Metadata) => {
  if (metadata.headers) {
    mergeRequestConfig(config, { headers: metadata.headers });
  }
};

function configFromMetadata(
  config: RequestConfig,
  metadata: Metadata,
  url: string,
  method: HttpMethod,
  args: any[],
): RequestConfig {
  setConfig(config, metadata, args); // 设置请求配置
  setParams(config, metadata, args, method); // 设置请求参数
  setHeaders(config, metadata); // 设置 headers
  config.url = url;
  config.method = method;
  return config;
}

const injectToArguments = <T = any>(args: any[], parameterIndex: number, value: T) => {
  if (isValidIndex(parameterIndex)) {
    args[parameterIndex] = value;
  }
};

export function HttpMethodDecoratorFactory(initConfig: RequestConfig, request: AxiosInstance = axios) {
  return function httpMethodDecorate(method: HttpMethod, url: string) {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
      const rawMethod: (...args: unknown[]) => void = descriptor.value;
      descriptor.value = async function (...$args: any[]) {
        const metadata = getAllMetadata(target, propertyKey);
        try {
          const requestConfig = configFromMetadata(clone(initConfig), metadata, url, method, $args);
          const response = await request(requestConfig);
          injectToArguments<HttpResponse>($args, metadata.responseIndex, response);
        } catch (exception: unknown) {
          injectToArguments<unknown>($args, metadata.exceptionIndex, exception);
        }
        return rawMethod.apply(this, $args);
      };
    };
  };
}

export function CustomMethodDecorator(initConfig: RequestConfig) {
  const httpMethodDecorate = HttpMethodDecoratorFactory(initConfig);
  return (method: HttpMethod) => (url: string) => httpMethodDecorate(method, url);
}

export const { interceptors } = axios;
