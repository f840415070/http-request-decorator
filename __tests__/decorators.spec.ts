import Mock from 'mockjs';
import {
  Get,
  Post,
  Put,
  Delete,
  Response,
  setRequestConfig,
  Err,
  Header,
  Params,
} from '../lib';

const template = {
  errcode: 0,
  errmsg: 'ok',
  data: { list: ['front end', 'back end'] },
};

['get', 'post', 'put', 'delete'].forEach((method) => {
  Mock.mock(`https://mock.api.com/${method}/list`, method, template);
});

Mock.mock('https://mock.api.com/get/headers', (options: Record<string, any>) => {
  console.log(options);
  return {};
});

setRequestConfig({ baseURL: 'https://mock.api.com' });

class Request {
  @Get('/get/list')
  fetchList(@Response res?: Record<string, any>) {
    return res;
  }

  @Post('/post/list')
  postList(@Response res?: Record<string, any>) {
    return res;
  }

  @Put('/put/list')
  putList(@Response res?: Record<string, any>) {
    return res;
  }

  @Delete('/delete/list')
  deleteList(@Response res?: Record<string, any>) {
    return res;
  }

  @Get('/error/api')
  fetchError(@Err err?: Error, @Response res?: unknown) {
    return [err, res];
  }

  @Get('/get/headers')
  @Header({ platform: 10 })
  fetchHeaders(@Params params: unknown, @Err err?: Error) {
    return err;
  }
}

const request = new Request();

describe('test decorators', () => {
  it('test Get decorator', async () => {
    const res: Record<string, any> | undefined = await request.fetchList();
    expect(res).toBeDefined();
    expect(res?.errcode).toBe(0);
    expect(res?.data.list).toContain('back end');
  });

  it('test Post decorator', async () => {
    const res: Record<string, any> | undefined = await request.postList();
    expect(res).toBeDefined();
    expect(res?.errcode).toBe(0);
    expect(res?.data.list).toContain('back end');
  });

  it('test Put decorator', async () => {
    const res: Record<string, any> | undefined = await request.putList();
    expect(res).toBeDefined();
    expect(res?.errcode).toBe(0);
    expect(res?.data.list).toContain('back end');
  });

  it('test Delete decorator', async () => {
    const res: Record<string, any> | undefined = await request.deleteList();
    expect(res).toBeDefined();
    expect(res?.errcode).toBe(0);
    expect(res?.data.list).toContain('back end');
  });

  it('test Header decorator', async () => {
    const err = await request.fetchHeaders({ foo: 123 });
    console.log(err);
  });

  // passed test
  // it('test Err decorator', async () => {
  //   const [err, res] = await request.fetchError();
  //   console.log(err);
  //   expect(err instanceof Error).toBeTruthy();
  //   expect(res).toBeUndefined();
  // });
});
