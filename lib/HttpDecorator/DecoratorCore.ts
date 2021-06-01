import axios from 'axios';
import {
  getDefaultRequestConfig,
  assignRequestConfig,
} from './RequestConfig';
import { isNumber } from './utils';
import { getAllMetadata } from './metadata';
import {
  HttpMethod,
  RequestConfig,
  Metadata,
  HttpResponse,
} from './types';

const validIndex = (index: number) => isNumber(index) && index >= 0;

const setConfig = (config: RequestConfig, metadata: Metadata, args: any[]) => {
  if (metadata.config) {
    assignRequestConfig(config, metadata.config);
  }
  if (validIndex(metadata.configIndex)) {
    assignRequestConfig(config, args[metadata.configIndex]);
  }
};

const setParams = (config: RequestConfig, metadata: Metadata, args: any[], method: HttpMethod) => {
  const requestParams = {};
  if (metadata.params) {
    Object.assign(requestParams, metadata.params);
  }
  if (validIndex(metadata.paramsIndex)) {
    Object.assign(requestParams, args[metadata.paramsIndex]);
  }
  // 'POST' | 'PUT' | 'PATCH' 请求的参数放在 data 字段，'GET' 等请求放在 params 字段
  const paramsField = (['POST', 'PUT', 'PATCH'].includes(method)) ? 'data' : 'params';
  assignRequestConfig(config, { [paramsField]: requestParams });
};

const setHeaders = (config: RequestConfig, metadata: Metadata) => {
  if (metadata.headers) {
    assignRequestConfig(config, { headers: metadata.headers });
  }
};

const configFromMetadata = (metadata: Metadata, url: string, method: HttpMethod, args: any[]): RequestConfig => {
  const config: RequestConfig = getDefaultRequestConfig();
  setConfig(config, metadata, args); // 设置请求配置
  setParams(config, metadata, args, method); // 设置请求参数
  setHeaders(config, metadata); // 设置 headers
  config.url = url;
  config.method = method;
  return config;
};

const injectToArguments = <T = any>(args: any[], parameterIndex: number, value: T) => {
  if (validIndex(parameterIndex)) {
    args[parameterIndex] = value;
  }
};

export function HttpMethodDecoratorFactory(method: HttpMethod, url: string) {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const rawMethod: (...args: unknown[]) => void = descriptor.value;
    descriptor.value = async function (...$args: any[]) {
      const metadata = getAllMetadata(target, propertyKey);
      try {
        const requestConfig = configFromMetadata(metadata, url, method, $args);
        const response = await axios(requestConfig);
        injectToArguments<HttpResponse>($args, metadata.responseIndex, response);
      } catch (exception: unknown) {
        injectToArguments<unknown>($args, metadata.exceptionIndex, exception);
      }
      return rawMethod.apply(this, $args);
    };
  };
}

/**
 * 自定义请求方法装饰器
 * @param method 请求方法 |'get'|'post'|...|
 * @returns 方法装饰器
 * @example
 * ```
 * >|const Patch = createMethodDecorator('PATCH');
 * >|
 * >|@Patch('/foo/bar')
 * >|fetch() {}
 * ```
 */
export const createMethodDecorator = (method: HttpMethod) => {
  return function (url: string) {
    return HttpMethodDecoratorFactory(method, url);
  };
};

export const { interceptors } = axios;
