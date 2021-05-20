import {
  Get,
  Params,
  Response,
  setRequestConfig,
} from '../lib';

class Request {
  onGetApi() {
  }

  @Get('/rest/api/v5/content/footprint/detail/get')
  fetchList(@Params params: Record<string, any>, @Response res?: Record<string, any>) {
    return res;
  }
}

describe('test async functions running', () => {
  it('test Get, Params, ', () => {});
});
