import {
  setRequestConfig,
  getDefaultRequestConfig,
  assignRequestConfig,
} from '../lib/HttpDecorator/RequestConfig';

describe('test request config', () => {
  it('can set and get default config', () => {
    const func = function (data, headers) {
      return data;
    };
    const defaultConfig = {
      url: '/user',
      method: 'get',
      baseURL: 'https://some-domain.com/api/',
      transformRequest: [func],
      transformResponse: [function (data) {
        return data;
      }],
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    };
    setRequestConfig(defaultConfig);
    const cloneConfig = getDefaultRequestConfig();

    expect(cloneConfig).not.toBe(defaultConfig);
    expect(cloneConfig.transformRequest).toContain(func);
    expect(cloneConfig.headers['X-Requested-With']).toBe('XMLHttpRequest');

    const newConfig = {
      url: '/user',
      method: 'post',
    };
    setRequestConfig(newConfig);
    const cloneConfigNew = getDefaultRequestConfig();

    expect(cloneConfigNew).not.toBe(cloneConfig);
    expect(cloneConfigNew.url).toBe(cloneConfig.url);
    expect(cloneConfigNew.method).not.toBe(cloneConfig.method);
    expect(cloneConfigNew.transformRequest).toContain(func);
  });

  it('can assign to object', () => {
    const defaultConfig = {
      url: '/user',
      method: 'get',
      baseURL: 'https://some-domain.com/api/',
      transformResponse: [function (data) {
        return data;
      }],
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    };
    setRequestConfig(defaultConfig);
    const config = getDefaultRequestConfig();
    const fn = () => {};

    expect(config.params).toBeUndefined();

    assignRequestConfig(config, {
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
