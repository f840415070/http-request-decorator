import 'reflect-metadata';
import { Method  } from 'axios';
import { HttpMethodDecoratorFactory } from './DecoratorCore';
import {
  PARAMS_INDEX,
  RESPONSE_INDEX,
  HEADER,
  ERROR_INDEX,
} from './MetaSymbols';

export function Get(url: string) {
  return HttpMethodDecoratorFactory('GET', url);
}

export function Post(url: string) {
  return HttpMethodDecoratorFactory('POST', url);
}

export function MethodFor(method: Method, url: string) {
  return HttpMethodDecoratorFactory(method, url);
}

export function Params(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  Reflect.defineMetadata(PARAMS_INDEX, parameterIndex, target, propertyKey);
}

export function Response(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  Reflect.defineMetadata(RESPONSE_INDEX, parameterIndex, target, propertyKey);
}

export function Err(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  Reflect.defineMetadata(ERROR_INDEX, parameterIndex, target, propertyKey);
}

export function Header(header: Record<string, string | number>) {
  return function (target: Object, propertyKey: string | symbol) {
    Reflect.defineMetadata(HEADER, header, target, propertyKey);
  };
}
