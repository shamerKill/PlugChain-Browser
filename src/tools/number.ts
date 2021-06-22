export class NumberTools {
  // 将数字进行处理
  constructor (private num: number) {
    if (Number.isNaN(num)) this.num = 0;
  }
  // 将数字除以一个数，并选择保留小数位，向下取
  div(div: number, length = 0) {
    const pow = 10 ** length;
    let result = this.num / div;
    result = Math.floor(result * pow);
    result = result / pow;
    return new NumberTools(result);
  }
  // 乘法
  pow(num: number) {
    const numLength = numberSplitLength(this.num);
    const addLength = numberSplitLength(num) || 0;
    const MaxLength = numLength > addLength ? numLength : addLength;
    const pow = 10 ** MaxLength;
    const result = Math.round(num * pow * this.num * pow) / pow / pow;
    return new NumberTools(result);
  }
  // 将数字加一个数
  add(add: number) {
    const numLength = numberSplitLength(this.num);
    const addLength = numberSplitLength(add) || 0;
    const MaxLength = numLength > addLength ? numLength : addLength;
    const pow = 10 ** MaxLength;
    const result = Math.round(add * pow + this.num * pow) / pow;
    return new NumberTools(result);
  }
  // 减法
  cut(num: number) {
    const numLength = numberSplitLength(this.num);
    const addLength = numberSplitLength(num) || 0;
    const MaxLength = numLength > addLength ? numLength : addLength;
    const pow = 10 ** MaxLength;
    const result = Math.round(this.num * pow - num * pow) / pow;
    return new NumberTools(result);
  }
  fixed(sub: number) {
    let res: number = this.num;
    const pow = 10 ** sub;
    res = Math.floor(res * pow) / pow;
    return new NumberTools(res);
  }
  // 获取当前数字
  get() {
    return this.num;
  }
}

// 获取数字最小位数
export const numberSplitLength = (num: number): number => {
  let length = 0;
  length = num.toString().split('.')?.[1]?.length || 0;
  return length;
};
