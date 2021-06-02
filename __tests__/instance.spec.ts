import Mock from 'mockjs';
import * as HttpDeco from '../lib';

Mock.mock('https://mock.api.com/get/list', 'get', {});

const instConfig: HttpDeco.RequestConfig = {
  baseURL: 'https://mock.api.com',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept-Encoding': 'gzip, deflate, br',
  },
};

const {
  Get,
  Response,
  requestConfig,
} = HttpDeco.createInstance(instConfig);

class Request {
  @Get('/get/list')
  fetchList(@Response res?: HttpDeco.HttpResponse) {
    return res;
  }

  @HttpDeco.Get('/get/list')
  fetchList2(@Response res?: HttpDeco.HttpResponse) {
    return res;
  }
}

const req = new Request();

describe('test http request instance', () => {
  test('test independent config', async () => {
    requestConfig.set({
      headers: { 'test-case': 'hello' },
    });
    HttpDeco.requestConfig.set({
      baseURL: 'https://mock.api.com',
      headers: { 'test-case': 'world' },
    });
    const res = await req.fetchList();
    expect(res.config.headers['test-case']).toBe('hello');
    expect(res.config.headers['Accept-Encoding']).toBeUndefined();
    const res2 = await req.fetchList2();
    expect(res2.config.headers['test-case']).toBe('world');
  });
});
