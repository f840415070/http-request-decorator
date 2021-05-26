import {
  Method,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export type RequestConfig = AxiosRequestConfig;
export type HttpMethod = Method;
export type HttpResponse = AxiosResponse;

export type LooseObject = Record<string | symbol, any>;

export type Metadata = {
  headers: LooseObject,
  config: LooseObject,
  params: RequestConfig,
  configIndex: number,
  paramsIndex: number,
  responseIndex: number,
  errorIndex: number,
};
