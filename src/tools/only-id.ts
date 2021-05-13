import { randomString } from './random-str';

// 全局唯一值
class CreateGlobalOne {
  // 全局唯一值储存区
  private globalArr: string[] = [];
  // 获取随机值
  getRandom = () => {
    let str = randomString();
    str = this.getRealRandom(str);
    this.globalArr.push(str);
    return str;
  }
  // 删除唯一id
  delRandom = (str: string) => {
    const strIndex = this.globalArr.indexOf(str);
    if (strIndex !== -1) this.globalArr.splice(strIndex, 1);
  }
  // 进行随机值检测
  verifyRandom = (str: string) => this.globalArr.includes(str);
  // 返回无重复值
  private getRealRandom = (str: string) => {
    if (this.globalArr.includes(str)) return this.getRandom();
    return str;
  }
}

const createGlobalOne = new CreateGlobalOne();
export const getOnlyId = createGlobalOne.getRandom;
export const delOnlyId = createGlobalOne.delRandom;
export const verifyOnlyId = createGlobalOne.verifyRandom;