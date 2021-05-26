import axios from 'axios';
import {
  getDefaultRequestConfig,
  assignRequestConfig,
} from './RequestConfig';
import { isNumber, isObject } from './utils';
import { getAllMetadata } from './metadata';
import { HttpMethod, RequestConfig, Metadata } from './types';

const validIndex = (index: number) => isNumber(index) && index >= 0;

const setConfig = (config: RequestConfig, metadata: Metadata, args: any[]) => {
  if (validIndex(metadata.configIndex)) {
    assignRequestConfig(config, args[metadata.configIndex]);
  }
  if (metadata.config) {
    assignRequestConfig(config, metadata.config);
  }
};

const setParams = (config: RequestConfig, metadata: Metadata, args: any[], method: HttpMethod) => {
  const requestParams = {
    ...metadata.params || {},
    ...(
      (validIndex(metadata.paramsIndex) && isObject(args[metadata.paramsIndex]))
        ? args[metadata.paramsIndex]
        : {}
    ),
  };
  // 'POST' | 'PUT' | 'PATCH' 请求的参数放在 data 字段，'GET' 等请求放在 params 字段
  const paramsField = (['POST', 'PUT', 'PATCH'].includes(method)) ? 'data' : 'params';
  assignRequestConfig(config, { [paramsField]: requestParams });
};

const setHeaders = (config: RequestConfig, metadata: Metadata) => {
  if (metadata.headers) {
    assignRequestConfig(config, { headers: metadata.headers });
  }
};

export function HttpMethodDecoratorFactory(method: HttpMethod, url: string) {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const rawMethod: (...args: unknown[]) => void = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const requestConfig: RequestConfig = getDefaultRequestConfig();
      const metadata = getAllMetadata(target, propertyKey);

      setConfig(requestConfig, metadata, args); // 设置请求配置
      setParams(requestConfig, metadata, args, method); // 设置请求参数
      setHeaders(requestConfig, metadata); // 设置 headers

      requestConfig.url = url;
      requestConfig.method = method;

      try {
        const response = await axios(requestConfig);
        if (validIndex(metadata.responseIndex)) {
          args[metadata.responseIndex] = response;
        }
      } catch (e: unknown) {
        // 错误捕获给 @Err 参数
        if (validIndex(metadata.errorIndex)) {
          args[metadata.errorIndex] = e;
        }
      }

      return rawMethod.apply(this, args);
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
