import {
  Method,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export type RequestConfig = AxiosRequestConfig;
export type HttpMethod = Method;
export type HttpResponse<T = any> = AxiosResponse<T>;

export type LooseObject = Record<string, any>;

export type Metadata = {
  headers: LooseObject,
  config: LooseObject,
  params: RequestConfig,
  configIndex: number,
  paramsIndex: number,
  responseIndex: number,
  exceptionIndex: number,
};
