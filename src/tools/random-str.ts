// 生成随机字符串
export class RandomString {
  stringArr = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
    'u', 'v', 'w', 'x', 'y', 'z', '-', '~', '$', '&',
  ];
  // 默认字符串长度为16
  strLength = 16;
  constructor (strLength = 16) {
    this.strLength = strLength;
  }
  // 进行随机
  random = (str = ''): string => {
    if (str.length < this.strLength) {
      // 随机
      str += this.stringArr[Math.floor(Math.random() * this.stringArr.length)];
      return this.random(str);
    } else if (str.length > this.strLength) {
      str = str.substr(0, this.strLength);
      return this.random(str);
    }
    return str;
  }
}
export const randomString = new RandomString().random;