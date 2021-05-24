import 'reflect-metadata';
import { AxiosRequestConfig } from 'axios';
import { HttpMethodDecoratorFactory } from './DecoratorCore';
import {
  HEADER,
  PARAMS,
  CONFIG,
  PARAMS_INDEX,
  CONFIG_INDEX,
  RESPONSE_INDEX,
  ERROR_INDEX,
} from './MetaSymbols';

/**
 * 包装 GET 请求的方法装饰器
 * @param url 请求 url
 * @example
 * ```
 * >|@Get('/foo/bar')
 * >|fetch() {}
 * ```
 */
export function Get(url: string) {
  return HttpMethodDecoratorFactory('GET', url);
}

/**
 * 包装 POST 请求的方法装饰器
 * @param url 请求 url
 * @example
 * ```
 * >|@Post('/foo/bar')
 * >|fetch() {}
 * ```
 */
export function Post(url: string) {
  return HttpMethodDecoratorFactory('POST', url);
}

/**
 * 包装 PUT 请求的方法装饰器
 * @param url 请求 url
 * @example
 * ```
 * >|@Put('/foo/bar')
 * >|fetch() {}
 * ```
 */
export function Put(url: string) {
  return HttpMethodDecoratorFactory('PUT', url);
}

/**
 * 包装 DELETE 请求的方法装饰器
 * @param url 请求 url
 * @example
 * ```
 * >|@Delete('/foo/bar')
 * >|fetch() {}
 * ```
 */
export function Delete(url: string) {
  return HttpMethodDecoratorFactory('DELETE', url);
}

/**
 * 包装请求头 headers 的方法装饰器
 * @param header 请求头对象，会对默认请求头里相同字段项进行覆盖
 * @example
 * ```
 * >|@Get('/foo/bar')
 * >|@Header({ 'Cache-Control': 'max-age=0' })
 * >|fetch() {}
 * ```
 */
export function Header(header: Record<string, string | number>) {
  return function (target: Object, propertyKey: string | symbol) {
    Reflect.defineMetadata(HEADER, header, target, propertyKey);
  };
}

/**
 * 包装请求参数的 [方法/参数] 装饰器
 * @param params 所有 http 请求方法携带的参数对象
 * @example
 * ```
 * >|@Get('/foo/bar')
 * >|@Params({ foo: 123 }) // 默认不变的参数可以用@Params({})修饰
 * >|fetch(@Params params) {} // 变量参数可以用@Params修饰形参
 * >|
 * >|onFetch() {
 * >|  this.fetch({ bar: 456 }); // 按形参定义顺序传入动态参数调用
 * >|}
 * ```
 */
export function Params(params: Record<string, any>): (target: Object, propertyKey: string | symbol) => void
export function Params(target: Object, propertyKey: string | symbol, parameterIndex: number): void
export function Params(...args: any[]) {
  if (args.length === 1) {
    const [params] = args;
    return function (target: Object, propertyKey: string | symbol) {
      Reflect.defineMetadata(PARAMS, params, target, propertyKey);
    };
  } else if (args.length === 3) {
    const [target, propertyKey, parameterIndex] = args;
    Reflect.defineMetadata(PARAMS_INDEX, parameterIndex, target, propertyKey);
  } else {
    throw new Error('@Params Invalid arguments');
  }
}

/**
 * 包装异步请求返回响应的参数装饰器
 * @example
 * ```
 * >|@Get('/foo/bar')
 * >|fetch(@Response res?: Record<string, any>) {
 * >|  console.log('The response:', res);
 * >|}
 * ```
 */
export function Response(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  Reflect.defineMetadata(RESPONSE_INDEX, parameterIndex, target, propertyKey);
}

/**
 * 包装请求时发生的错误捕获的参数装饰器
 * @example
 * ```
 * >|@Get('/foo/bar')
 * >|fetch(@Response res?: Record<string, any>,@Exception err?: Error) {
 * >|  if (!err) {
 * >|    console.log('The response:', res);
 * >|  } else {
 * >|    console.log('The error:', err);
 * >|  }
 * >|}
 * ```
 */
export function Exception(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  Reflect.defineMetadata(ERROR_INDEX, parameterIndex, target, propertyKey);
}

export function Config(config: AxiosRequestConfig): (target: Object, propertyKey: string | symbol) => void
export function Config(target: Object, propertyKey: string | symbol, parameterIndex: number): void
export function Config(...args: any[]) {
  if (args.length === 1) {
    const [config] = args;
    return function (target: Object, propertyKey: string | symbol) {
      Reflect.defineMetadata(CONFIG, config, target, propertyKey);
    };
  } else if (args.length === 3) {
    const [target, propertyKey, parameterIndex] = args;
    Reflect.defineMetadata(CONFIG_INDEX, parameterIndex, target, propertyKey);
  } else {
    throw new Error('@Config Invalid arguments');
  }
}
