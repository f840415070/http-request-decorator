# http-request-decorator

> 基于 axios 和 ES Decorator ，用更优雅的 AOP 方式实现异步网络请求

## 安装
`npm install http-request-decorator` <br>
or use yarn 
<br>
`yarn add http-request-decorator`

## 示例
```ts
import {
  Get,
  Response,
  Params,
  Header,
  setRequestConfig,
  AxiosResponse,
} from 'http-request-decorator';

setRequestConfig({
  baseURL: 'https://test.api.com',
  headers: { 'Cache-Control': 'max-age=0' },
});

class MyApp {
  @Get('/detail/get')
  @Header({ 'Authorization': 'Bearer foobar' })
  @Params({ defaultParam: 123 })
  fetch(@Params params: Record<string, any>, @Response res?: AxiosResponse) {
    console.log('Response', res);
  }

  onGetDetail() {
    const params = { foo: 'bar' };
    this.fetch(params);
    /**
     * 事实上 fetch 函数被包装后也相当于一个异步函数，如果你在 fetch 函数里返回 res，onGetDetail 也可以改写成 async/await 函数（或是 Promise 般调用：this.fetch().then(res => {})）：
     * async onGetDetail() {
     *   const params = { foo: 'bar' };
     *   const res = await this.fetch(params);
     *   console.log('Response', res);
     * }
     * 这样 res 就被传递过来，onGetDetail 方法里也能处理 http 请求返回结果
     * /
  }
}
```

> 注意1：使用多个方法装饰器时，调用顺序是由里装饰器到外装饰器，而调用 axios 请求逻辑是写在请求方法装饰器里的（如 `@Get()`，`@Post()` 等），所以编写代码时务必把 **请求方法装饰器** 写在 **最上面**。

> 注意2：使用多个参数装饰器时，参数并无指定顺序，但 `@Response`，`@Exception` 在调用函数时是不需要传递实参的，请将其写在形参顺序最后。
```ts
@Get('/foo/bar')
fetch(
  @Params params: Record<string, any>,
  @Response res?: AxiosResponse,
  @Exception err?: Error,
  ) {
    if (!err && res) {
      console.log(res);
    } else {
      console.log(err);
    }
  }

// 调用时只传 params
this.fetch({ foo: 'bar' });
```

## Docs
- `Get` <br>
包装 GET 请求的方法装饰器，只接受请求的 `url` 参数，使用如 `@Get('https://demo.someapi.com/foo/bar')`，设置 `baseUrl` 后 `@Get('/foo/bar')`
```ts
@Get('/foo/bar') // 设置了 baseUrl
// 未设置 baseUrl 使用完整链接 @Get('https://xxxx/foo/bar')
fetch(@Params params: Record<string, any>) {}
```

- `Post` <br>
包装 POST 请求的方法装饰器，使用同上

- `Put` <br>
包装 PUT 请求的方法装饰器，使用同上

- `Delete` <br>
包装 DELETE 请求的方法装饰器，使用同上

- `Header` <br>
包装请求头 headers 的方法装饰器，接受一个对象参数，会对默认请求头里相同字段项进行覆盖
```ts
setRequestConfig({
  headers: {
    'Cache-Control': 'no-cache',
    'platform': 'ios',
  },
});

class MyApp {
  @Get('/foo/bar')
  // 默认 headers Cache-Control 会被覆盖
  // headers {'Cache-Control': 'max-age=0', 'platform': 'ios'}
  @Header({ 'Cache-Control': 'max-age=0' })
  fetch() {}
}
```

- `Params` <br>
包装请求参数的 方法/参数 装饰器
```ts
class MyApp {
  @Get('/foo/bar')
  @Params({ foo: 123 }) // 包装静态不变参数
  fetch(@Params params: Record<string, any>) {
    // 包装动态参数的形参，会覆盖静态参数里的相同项
      
  }

  onCall() {
    const params = { bar: 456, foo: 789 };
    this.fetch(params);
    // 最终参数 { foo: 789, bar: 456 }
  }
}
```

- `Config` <br>
请求配置的方法/参数装饰器。作为方法装饰器时，接受唯一参数类型 `AxiosRequestConfig`；作为参数装饰器时，修饰的参数类型 `AxiosRequestConfig`
```ts
@Get('/foo/bar')
@Config({ params: { foo: 1, bar: 2 } })
fetch(
  @Params params: o,
  @Config config: AxiosRequestConfig,
  @Response res?: AxiosResponse,
) {}
```

- `Response` <br>
包装异步请求返回响应的参数装饰器
```ts
class MyApp {
  @Get('/foo/bar')
  fetch(@Response res?: AxiosResponse) {
    console.log('The response:', res);
  }
}
```

- `Exception` <br>
包装请求时发生的错误捕获的参数装饰器
```ts
class MyApp {
  @Get('/foo/bar')
  fetch(@Response res?: AxiosResponse, @Exception err?: Error) {
    if (!err && res) {
      console.log('The response:', res);
    }
  }
}
```

- `createMethodDecorator` <br>
自定义请求方法装饰器，接受一个 `http method` 类型，返回一个方法装饰器，使用同 `Get`、`Post` 等
```ts
const Patch = createMethodDecorator('PATCH');

class MyApp {
  @Patch('/foo/bar')
  fetch() {

  }
}
```

- `setRequestConfig` <br>
设置默认请求配置，接受一个对象参数，类型是 `AxiosRequestConfig`
```ts
setRequestConfig({
  method: 'get',
  baseURL: 'https://some-domain.com/api/',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});
```

- `interceptors` <br>
`axios` 的拦截器
```ts
interceptors.request.use((config) => {
  config.headers.Authorization = 'hello world';
  return config;
});
```

- `Method` <br>
```ts
type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK'
```

- `AxiosRequestConfig` <br>
```ts
interface AxiosRequestConfig {
  url?: string;
  method?: Method;
  baseURL?: string;
  transformRequest?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
  headers?: any;
  params?: any;
  paramsSerializer?: (params: any) => string;
  data?: any;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  adapter?: AxiosAdapter;
  auth?: AxiosBasicCredentials;
  responseType?: ResponseType;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: AxiosProxyConfig | false;
  cancelToken?: CancelToken;
  decompress?: boolean;
}
```

- `AxiosResponse`
```ts
interface AxiosResponse<T = any>  {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
  request?: any;
}
```
