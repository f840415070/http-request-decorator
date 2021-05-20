import axios, { AxiosRequestConfig, Method } from 'axios';
import 'reflect-metadata';
import {
  getDefaultRequestConfig,
  assignRequestConfig,
} from './RequestConfig';
import { isNumber } from './utils';
import {
  PARAMS_INDEX,
  RESPONSE_INDEX,
  HEADER,
  ERROR_INDEX,
} from './MetaSymbols';

const getMetaData = (target: Object, propertyKey: string | symbol) => {
  const { getOwnMetadata } = Reflect;
  const paramsIndex: number = getOwnMetadata(PARAMS_INDEX, target, propertyKey);
  const responseIndex: number = getOwnMetadata(RESPONSE_INDEX, target, propertyKey);
  const headers: Record<string, string | number> = getOwnMetadata(HEADER, target, propertyKey);
  const errorIndex: number = getOwnMetadata(ERROR_INDEX, target, propertyKey);
  return {
    paramsIndex,
    responseIndex,
    errorIndex,
    headers,
  };
};

const hasValidParamIndex = (index: number) => isNumber(index) && index >= 0;

export function HttpMethodDecoratorFactory(method: Method, url: string) {
  return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const rawMethod: (...args: unknown[]) => void = descriptor.value;
    descriptor.value = async function (...args: unknown[]) {
      const {
        paramsIndex,
        responseIndex,
        errorIndex,
        headers,
      } = getMetaData(target, propertyKey);

      // 取出默认的请求配置
      const requestConfig: AxiosRequestConfig = getDefaultRequestConfig();
      // 加入请求参数
      // 'POST' | 'PUT' | 'PATCH' 请求的参数放在 data 字段，'GET' 等请求放在 params 字段
      if (hasValidParamIndex(paramsIndex)) {
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
          assignRequestConfig(requestConfig, { data: args[paramsIndex] });
        } else {
          assignRequestConfig(requestConfig, { params: args[paramsIndex] });
        }
      }
      // 加入 headers ，header 相同会覆盖
      if (headers) assignRequestConfig(requestConfig, { headers });

      requestConfig.url = url;
      requestConfig.method = method;

      try {
        const response = await axios(requestConfig);
        if (hasValidParamIndex(responseIndex)) {
          args[responseIndex] = response.data;
        }
      } catch (e: unknown) {
        // 错误捕获给 @Err 参数
        if (hasValidParamIndex(errorIndex)) {
          args[errorIndex] = e;
        }
      }

      return rawMethod.apply(this, args);
    };
  };
}

export const createMethodDecorator = (method: Method) => {
  return function (url: string) {
    return HttpMethodDecoratorFactory(method, url);
  };
};
