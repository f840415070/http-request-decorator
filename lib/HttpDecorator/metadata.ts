import { LooseObject } from './types';

const metaStore: Map<string, symbol> = new Map();

export const metakeyFor = (key: string) => {
  if (!metaStore.has(key)) {
    metaStore.set(key, Symbol(`meta:${key}`));
  }
  return metaStore.get(key);
};

export const HEADER = Symbol('meta:header');
export const PARAMS = Symbol('meta:params');
export const CONFIG = Symbol('meta:config');
export const PARAMS_INDEX = Symbol('meta:params_index');
export const CONFIG_INDEX = Symbol('meta:config_index');
export const RESPONSE_INDEX = Symbol('meta:response_index');
export const ERROR_INDEX = Symbol('meta:error_index');

export const getAllMetadata = (target: Object, propertyKey: string | symbol) => {
  const metadata: LooseObject = {};
  for (const [key, metakey] of metaStore) {
    metadata[key] = Reflect.getOwnMetadata(metakey, target, propertyKey);
  }
  return metadata;
};

// export const getAllMetadata = (target: Object, propertyKey: string | symbol) => {
//   const { getOwnMetadata } = Reflect;
//   const headers: Record<string, string | number> = getOwnMetadata(HEADER, target, propertyKey);
//   const params: Record<string, any> = getOwnMetadata(PARAMS, target, propertyKey);
//   const config: RequestConfig = getOwnMetadata(CONFIG, target, propertyKey);
//   const paramsIndex: number = getOwnMetadata(PARAMS_INDEX, target, propertyKey);
//   const configIndex: number = getOwnMetadata(CONFIG_INDEX, target, propertyKey);
//   const responseIndex: number = getOwnMetadata(RESPONSE_INDEX, target, propertyKey);
//   const errorIndex: number = getOwnMetadata(ERROR_INDEX, target, propertyKey);
//   return {
//     headers,
//     config,
//     params,
//     configIndex,
//     paramsIndex,
//     responseIndex,
//     errorIndex,
//   };
// };
