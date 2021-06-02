import { HttpMethodDecoratorFactory, CustomMethodDecorator } from './DecoratorCore';
import { requestConfig } from './RequestConfig';
import { META } from './metadata';
import { RequestConfig, LooseObject } from './types';

const initConfig = requestConfig.get();
const httpMethodDecorate = HttpMethodDecoratorFactory(initConfig);

/**
 * 自定义请求方法装饰器
 * @param method 请求方法 |'get'|'post'|...|
 * @returns 方法装饰器
 */
export const createMethodDecorator = CustomMethodDecorator(initConfig);

/**
 * 包装 GET 请求的方法装饰器
 * @param url 请求 url
 */
export function Get(url: string) {
  return httpMethodDecorate('GET', url);
}

/**
 * 包装 POST 请求的方法装饰器
 * @param url 请求 url
 */
export function Post(url: string) {
  return httpMethodDecorate('POST', url);
}

/**
 * 包装 HEAD 请求的方法装饰器
 * @param url 请求 url
 */
export function Head(url: string) {
  return httpMethodDecorate('HEAD', url);
}

/**
 * 包装 PUT 请求的方法装饰器
 * @param url 请求 url
 */
export function Put(url: string) {
  return httpMethodDecorate('PUT', url);
}

/**
 * 包装 DELETE 请求的方法装饰器
 * @param url 请求 url
 */
export function Delete(url: string) {
  return httpMethodDecorate('DELETE', url);
}

/**
 * 包装请求头 headers 的方法装饰器
 * @param header 请求头对象，会对默认请求头里相同字段项进行覆盖
 */
export function Header(header: LooseObject) {
  return function (target: Object, propertyKey: string | symbol) {
    Reflect.defineMetadata(META.HEADER, header, target, propertyKey);
  };
}

/**
 * 包装请求参数的 [方法/参数] 装饰器
 * @param params 所有 http 请求方法携带的参数对象
 */
export function Params(params: LooseObject): (target: Object, propertyKey: string | symbol) => void
export function Params(target: Object, propertyKey: string | symbol, parameterIndex: number): void
export function Params(...args: any[]) {
  if (args.length === 1) {
    const [params] = args;
    return function (target: Object, propertyKey: string | symbol) {
      Reflect.defineMetadata(META.PARAMS, params, target, propertyKey);
    };
  } else if (args.length === 3) {
    const [target, propertyKey, parameterIndex] = args;
    Reflect.defineMetadata(META.PARAMS_INDEX, parameterIndex, target, propertyKey);
  } else {
    throw new Error('@Params Invalid arguments');
  }
}

/**
 * 包装异步请求返回响应的参数装饰器
 */
export function Response(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  Reflect.defineMetadata(META.RESPONSE_INDEX, parameterIndex, target, propertyKey);
}

/**
 * 包装请求时发生的错误捕获的参数装饰器
 */
export function Exception(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  Reflect.defineMetadata(META.EXCEPTION_INDEX, parameterIndex, target, propertyKey);
}

/**
 * 单独附加的请求配置
 * @param config 请求配置
 */
export function Config(config: RequestConfig): (target: Object, propertyKey: string | symbol) => void
export function Config(target: Object, propertyKey: string | symbol, parameterIndex: number): void
export function Config(...args: any[]) {
  if (args.length === 1) {
    const [config] = args;
    return function (target: Object, propertyKey: string | symbol) {
      Reflect.defineMetadata(META.CONFIG, config, target, propertyKey);
    };
  } else if (args.length === 3) {
    const [target, propertyKey, parameterIndex] = args;
    Reflect.defineMetadata(META.CONFIG_INDEX, parameterIndex, target, propertyKey);
  } else {
    throw new Error('@Config Invalid arguments');
  }
}
