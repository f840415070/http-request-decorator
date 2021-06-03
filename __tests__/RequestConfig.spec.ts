import {
  requestConfig,
  mergeRequestConfig,
} from '../lib/HttpDecorator/RequestConfig';
import { clone } from '../lib/HttpDecorator/utils';
import { RequestConfig } from '../lib';

describe('test set/get config', () => {
  it('can set and get default config', () => {
    const defaultConfig: RequestConfig = {
      url: '/user',
      method: 'get',
      baseURL: 'https://some-domain.com/api/',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    };
    requestConfig.set(defaultConfig);
    const config = requestConfig.get();
    expect(config.headers).toBe(defaultConfig.headers);
    // 测试直接修改配置
    config.method = 'post';
    expect(config.method).not.toBe('post');
    expect(config.method).toBe('get');
    // 使用 set 方法修改配置
    requestConfig.set({
      method: 'post',
      headers: {
        'Accept-Encoding': 'gzip',
        'Accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    });
    expect(config.method).toBe('post');
    expect(config.headers).not.toBe(defaultConfig.headers);
    expect(config.headers['Accept-Encoding']).toBe('gzip');
    expect(config.headers['Accept-language']).toBeDefined();
    expect(config.headers['X-Requested-With']).toBeUndefined();
    expect(config.url).toBe('/user');
  });

  it('can merge to config', () => {
    const defaultConfig: RequestConfig = {
      url: '/user',
      method: 'get',
      baseURL: 'https://some-domain.com/api/',
      transformResponse: [function (data: unknown) {
        return data;
      }],
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    };
    requestConfig.set(defaultConfig);
    const config = clone(requestConfig.get());
    const fn = () => {};

    expect(config.params).toBeUndefined();

    mergeRequestConfig(config, {
      method: 'post',
      transformResponse: [fn, fn],
      headers: {
        Connection: 'keep-alive',
        Origin: 'https://example.com',
      },
      params: { ID: 12345 },
    });

    expect(config.params.ID).toBe(12345);
    expect(config.method).toBe('post');
    expect(config.transformResponse[1]).toBe(fn);
    expect(config.headers.Connection).toBe('keep-alive');
    expect(config.headers.Origin).toBeDefined();
    expect(config.headers['X-Requested-With']).toBe('XMLHttpRequest');
    expect(config.headers['Accept-Encoding']).toBeDefined();
  });
});
