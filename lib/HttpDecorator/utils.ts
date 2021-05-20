const { toString } = Object.prototype;
const typed = (type: string) => (target: unknown) => toString.call(target).slice(8, -1) === type;

export const isNumber = typed('Number');
export const isArray = typed('Array');
export const isObject = typed('Object');

export const clone = (target: Record<string, any>) => {
  const result: any = Array.isArray(target) ? [] : {};
  for (const key of Object.keys(target)) {
    if (isObject(target[key]) || isArray(target[key])) {
      result[key] = clone(target[key]);
    } else {
      result[key] = target[key];
    }
  }
  return result;
};
