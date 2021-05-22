import Mock from 'mockjs';
import {
  Get,
  Post,
  Put,
  Delete,
  Response,
  setRequestConfig,
  Err,
  Params,
  createMethodDecorator,
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

setRequestConfig({ baseURL: 'https://mock.api.com' });

class Request {
  @Get('/get/list')
  fetchList(@Response res?: o, @Err err?: Error) {
    return [res, err];
  }

  @Post('/post/list')
  postList(@Response res?: o) {
    return res;
  }

  @Put('/put/list')
  putList(@Response res?: o) {
    return res;
  }

  @Delete('/delete/list')
  deleteList(@Response res?: o) {
    return res;
  }

  @Patch('/patch/list')
  patchList(@Response res?: o) {
    return res;
  }

  @Get('/error/api')
  fetchError(@Err err?: Error, @Response res?: unknown) {
    return [err, res];
  }

  @Get('/get-with-params')
  @Params({ hello: 'world' })
  getWithParams(@Params params: o, @Response res?: o) {
    return res;
  }

  @Post('/post-with-params')
  @Params({ hello: 'world' })
  postWithParams(@Params params: o, @Response res?: o) {
    return res;
  }
}

const request = new Request();

describe('test decorators', () => {
  it('test Get decorator', async () => {
    const [res, err] = await request.fetchList();
    expect(res).toBeDefined();
    expect(err).toBeUndefined();
    expect(res?.errcode).toBe(0);
    expect(res?.data.list).toContain('back end');
  });

  it('test Post decorator', async () => {
    const res: o | undefined = await request.postList();
    expect(res).toBeDefined();
    expect(res?.errcode).toBe(0);
    expect(res?.data.list).toContain('back end');
  });

  it('test Put decorator', async () => {
    const res: o | undefined = await request.putList();
    expect(res).toBeDefined();
    expect(res?.errcode).toBe(0);
    expect(res?.data.list).toContain('back end');
  });

  it('test Delete decorator', async () => {
    const res: o | undefined = await request.deleteList();
    expect(res).toBeDefined();
    expect(res?.errcode).toBe(0);
    expect(res?.data.list).toContain('back end');
  });

  it('test custom method decorator', async () => {
    const res: o | undefined = await request.patchList();
    expect(res).toBeDefined();
    expect(res?.errcode).toBe(0);
    expect(res?.data.list).toContain('back end');
  });

  it('test get api width params', async () => {
    const res: o | undefined = await request.getWithParams({ foo: 'bar' });
    expect(res?.url).toMatch('foo=bar');
    expect(res?.url).toMatch('hello=world');
  });

  it('test post api width params', async () => {
    const res: o | undefined = await request.postWithParams({ foo: 'bar' });
    expect(res?.body).toMatch('"foo":"bar"');
    expect(res?.body).toMatch('"hello":"world"');
  });

  // passed test
  // it('test Err decorator', async () => {
  //   const [err, res] = await request.fetchError();
  //   console.log(err);
  //   expect(err instanceof Error).toBeTruthy();
  //   expect(res).toBeUndefined();
  // });
});
