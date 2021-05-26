import { Metadata } from './types';

const { getOwnMetadata } = Reflect;

export enum META {
  HEADER,
  PARAMS,
  CONFIG,
  PARAMS_INDEX,
  CONFIG_INDEX,
  RESPONSE_INDEX,
  ERROR_INDEX,
}

export const getAllMetadata = (target: Object, propertyKey: string | symbol): Metadata => ({
  headers: getOwnMetadata(META.HEADER, target, propertyKey),
  params: getOwnMetadata(META.PARAMS, target, propertyKey),
  config: getOwnMetadata(META.CONFIG, target, propertyKey),
  paramsIndex: getOwnMetadata(META.PARAMS_INDEX, target, propertyKey),
  configIndex: getOwnMetadata(META.CONFIG_INDEX, target, propertyKey),
  responseIndex: getOwnMetadata(META.RESPONSE_INDEX, target, propertyKey),
  errorIndex: getOwnMetadata(META.ERROR_INDEX, target, propertyKey),
});
