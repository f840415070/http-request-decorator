const { toString } = Object.prototype;
const typed = (type: string) => (target: unknown) => toString.call(target).slice(8, -1) === type;

export const isNumber = typed('Number');
export const isArray = typed('Array');
export const isObject = typed('Object');

export const clone = <T>(target: T): T => {
  const result = (isArray(target) ? [] : {}) as T;
  for (const key of (Object.keys(target) as Array<keyof T>)) {
    if (isObject(target[key]) || isArray(target[key])) {
      result[key] = clone(target[key]);
    } else {
      result[key] = target[key];
    }
  }
  return result;
};
