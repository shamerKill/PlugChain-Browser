// 深拷贝方法
export const copyObject = <T=object | {[key: string]: any} | any[]>(form: T): T => {
  let target = form;
  // 如果是对象
  if (typeof form === 'object')
    // 判断是数组还是对象
    if (form instanceof Array) {
      // 数组闭包
      let newTarget: T = form.map(item => copyObject(item)) as unknown as T;
      target = newTarget;
    } else if (form) {
      // 新建对象
      let newTarget: T = {} as T;
      // 对象闭包
      for (let key in form) newTarget[key] = copyObject(form[key]);
      target = newTarget;
    }

  // 返回新值
  return target;
};