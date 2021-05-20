import Mock from 'mockjs';
import {
  Get,
  Post,
  Put,
  Delete,
  Response,
  setRequestConfig,
  Err,
} from '../lib';

const template = {
  errcode: 0,
  errmsg: 'ok',
  data: { list: ['front end', 'back end'] },
};

Mock.mock('https://mock.api.com/get/list', 'get', template);
Mock.mock('https://mock.api.com/post/list', 'post', template);
Mock.mock('https://mock.api.com/put/list', 'put', template);
Mock.mock('https://mock.api.com/delete/list', 'delete', template);

setRequestConfig({ baseURL: 'https://mock.api.com' });

class Request {
  @Get('/get/list')
  fetchList(@Response res?: Record<string, any>, @Err err?: Error) {
    return [res, err];
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

  // passed test
  // it('test Err decorator', async () => {
  //   const [err, res] = await request.fetchError();
  //   console.log(err);
  //   expect(err instanceof Error).toBeTruthy();
  //   expect(res).toBeUndefined();
  // });
});
