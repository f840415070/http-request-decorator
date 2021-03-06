import Mock from 'mockjs';
import {
  Get,
  Post,
  Put,
  Delete,
  Response,
  requestConfig,
  Exception,
  Params,
  createMethodDecorator,
  HttpResponse,
  Config,
  RequestConfig,
} from '../lib';

type o = Record<string, any>;

const Patch = createMethodDecorator('PATCH');
const template = {
  errcode: 0,
  errmsg: 'ok',
  data: { list: ['front end', 'back end'] },
};

Mock.mock('https://mock.api.com/get/list', 'get', template);
Mock.mock('https://mock.api.com/post/list', 'post', template);
Mock.mock('https://mock.api.com/put/list', 'put', template);
Mock.mock('https://mock.api.com/delete/list', 'delete', template);
Mock.mock('https://mock.api.com/patch/list', 'patch', template);
Mock.mock(RegExp('https://mock.api.com/get-with-params.*'), 'get', (opt: o) => opt);
Mock.mock(RegExp('https://mock.api.com/post-with-params.*'), 'post', (opt: o) => opt);
Mock.mock(RegExp('https://mock.api.com/get/config.*'), 'get', (opt: o) => opt);

requestConfig.set({ baseURL: 'https://mock.api.com' });

class Request {
  @Get('/get/list')
  fetchList(@Response res?: HttpResponse, @Exception e?: unknown) {
    return res;
  }

  @Post('/post/list')
  postList(@Response res?: HttpResponse) {
    return res;
  }

  @Put('/put/list')
  putList(@Response res?: HttpResponse) {
    return res;
  }

  @Delete('/delete/list')
  deleteList(@Response res?: HttpResponse) {
    return res;
  }

  @Patch('/patch/list')
  patchList(@Response res?: HttpResponse) {
    return res;
  }

  @Get('/error/api')
  fetchError(@Exception e?: unknown, @Response res?: HttpResponse) {
    return [e, res];
  }

  @Get('/get-with-params')
  @Params({ hello: 'world' })
  getWithParams(@Params params: o, @Response res?: HttpResponse) {
    return res;
  }

  @Post('/post-with-params')
  @Params({ hello: 'world' })
  postWithParams(@Params params: o, @Response res?: HttpResponse) {
    return res;
  }

  @Get('/get/config')
  @Config({ params: { foo: 1, bar: 2 } })
  getConfig(
    @Params params: o,
    @Config config: RequestConfig,
    @Response res?: HttpResponse,
  ) {
    return res;
  }
}

const request = new Request();

describe('test decorators', () => {
  it('test Get decorator', async () => {
    const res = await request.fetchList();
    expect(res).toBeDefined();
    expect(res?.data?.errcode).toBe(0);
    expect(res?.data?.data.list).toContain('back end');
  });

  it('test Post decorator', async () => {
    const res: o | undefined = await request.postList();
    expect(res).toBeDefined();
    expect(res?.data?.errcode).toBe(0);
    expect(res?.data?.data.list).toContain('back end');
  });

  it('test Put decorator', async () => {
    const res: o | undefined = await request.putList();
    expect(res).toBeDefined();
    expect(res?.data?.errcode).toBe(0);
    expect(res?.data?.data.list).toContain('back end');
  });

  it('test Delete decorator', async () => {
    const res: o | undefined = await request.deleteList();
    expect(res).toBeDefined();
    expect(res?.data?.errcode).toBe(0);
    expect(res?.data?.data.list).toContain('back end');
  });

  it('test custom method decorator', async () => {
    const res: o | undefined = await request.patchList();
    expect(res).toBeDefined();
    expect(res?.data?.errcode).toBe(0);
    expect(res?.data?.data.list).toContain('back end');
  });

  it('test get api width params', async () => {
    const res: o | undefined = await request.getWithParams({ foo: 'bar' });
    expect(res?.data?.url).toMatch('foo=bar');
    expect(res?.data?.url).toMatch('hello=world');
  });

  it('test post api width params', async () => {
    const res: o | undefined = await request.postWithParams({ foo: 'bar' });
    expect(res?.data?.body).toMatch('"foo":"bar"');
    expect(res?.data?.body).toMatch('"hello":"world"');
  });

  it('test Config decorator', async () => {
    const res = await request.getConfig({ bar: 666 }, { headers: { foo: 'bar' } });
    expect(res?.config.params.foo).toBe(1);
    expect(res?.config.params.bar).toBe(666);
    expect(res?.config.headers.foo).toBe('bar');
  });

  // passed test
  // it('test Exception decorator', async () => {
  //   const [e, res] = await request.fetchError();
  //   console.log(e);
  //   expect(e instanceof Error).toBeTruthy();
  //   expect(res).toBeUndefined();
  // });
});
