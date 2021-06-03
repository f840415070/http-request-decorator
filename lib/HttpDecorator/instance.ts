import axios, { AxiosInstance } from 'axios';
import * as decorators from './decorators';
import { HttpMethodDecoratorFactory, CustomMethodDecorator } from './DecoratorCore';
import { createIndependentConf } from './RequestConfig';
import { RequestConfig } from './types';

const overloadMethodDecorators = (initConfig: RequestConfig, request: AxiosInstance) => {
  const httpMethodDecorate = HttpMethodDecoratorFactory(initConfig, request);
  return {
    createMethodDecorator: CustomMethodDecorator(initConfig),
    Get: (url: string) => httpMethodDecorate('GET', url),
    Post: (url: string) => httpMethodDecorate('POST', url),
    Head: (url: string) => httpMethodDecorate('HEAD', url),
    Put: (url: string) => httpMethodDecorate('PUT', url),
    Delete: (url: string) => httpMethodDecorate('DELETE', url),
  };
};

export default function createInstance(config?: RequestConfig) {
  const axiosInst = axios.create();
  const requestConfig = createIndependentConf(config);

  return {
    requestConfig,
    interceptors: axiosInst.interceptors,
    ...decorators,
    ...overloadMethodDecorators(requestConfig.get(), axiosInst),
  };
}
