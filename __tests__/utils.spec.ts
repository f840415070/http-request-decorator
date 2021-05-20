import {
  isNumber,
  isArray,
  isObject,
  clone,
} from '../lib/HttpDecorator/utils';

describe('check type', () => {
  it('check number type', () => {
    expect(isNumber(666)).toBeTruthy();
    expect(isNumber('888')).toBeFalsy();
  });

  it('check array type', () => {
    expect(isArray([1, 2, 3])).toBeTruthy();
    expect(isArray({ 0: 1, 1: 2, length: 2 })).toBeFalsy();
  });

  it('check object type', () => {
    expect(isObject({ foo: 'bar' })).toBeTruthy();
    expect(isObject([1, 2, 3])).toBeFalsy();
    expect(isObject(new Date())).toBeFalsy();
  });
});

describe('test functions', () => {
  it('test deep clone a obj', () => {
    const source = {
      foo: 123,
      bar: {
        name: 'Tom',
        groups: ['front end', 'programmer'],
      },
    };
    const result = clone(source);

    expect(result).not.toBe(source);
    expect(result.foo).toBe(source.foo);
    expect(result.bar.name).toBe('Tom');
    expect(result.bar.groups).toContain('front end');
    expect(result.bar.groups).not.toBe(source.bar.groups);
    expect(result).not.toBe(source);
  });
});
