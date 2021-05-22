import 'reflect-metadata';
import { HttpMethodDecoratorFactory } from './DecoratorCore';
import {
  HEADER,
  PARAMS,
  PARAMS_INDEX,
  RESPONSE_INDEX,
  ERROR_INDEX,
} from './MetaSymbols';

export function Get(url: string) {
  return HttpMethodDecoratorFactory('GET', url);
}

export function Post(url: string) {
  return HttpMethodDecoratorFactory('POST', url);
}

export function Put(url: string) {
  return HttpMethodDecoratorFactory('PUT', url);
}

export function Delete(url: string) {
  return HttpMethodDecoratorFactory('DELETE', url);
}

export function Header(header: Record<string, string | number>) {
  return function (target: Object, propertyKey: string | symbol) {
    Reflect.defineMetadata(HEADER, header, target, propertyKey);
  };
}

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

export function Response(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  Reflect.defineMetadata(RESPONSE_INDEX, parameterIndex, target, propertyKey);
}

export function Err(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  Reflect.defineMetadata(ERROR_INDEX, parameterIndex, target, propertyKey);
}
