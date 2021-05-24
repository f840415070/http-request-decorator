import Mock from 'mockjs';
import {
  Get,
  Response,
  AxiosResponse,
  interceptors,
} from '../lib';

Mock.mock('https://mock.api.com/get/list', 'get', {});

class Request {
  @Get('https://mock.api.com/get/list')
  fetch(@Response res?: AxiosResponse) {
    return res;
  }
}

const request = new Request();

describe('test interceptors', () => {
  test('test request interceptor', async () => {
    interceptors.request.use((config) => {
      config.headers.Authorization = 'hello world';
      return config;
    });
    const res = await request.fetch();
    expect(res?.status).toBe(200);
    expect(res?.config.headers.Authorization).toMatch(/hello world/);
  });

  test('test response interceptor', async () => {
    interceptors.response.use((response) => {
      response.headers.Authorization = 'hello world';
      return response;
    });
    const res = await request.fetch();
    expect(res?.status).toBe(200);
    expect(res?.headers.Authorization).toMatch(/hello world/);
  });
});
