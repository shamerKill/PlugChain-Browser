export class RandomNumber {
  private numLength = 12;
  constructor (numLength = 12) {
    this.numLength = numLength;
  }
  random = (seedNumber = 0): number => {
    const numArr = Array.from({ length: this.numLength }).map(() => (Math.floor(Math.random() * 10) + seedNumber) % 10);
    return parseInt(numArr.join(''));
  }
}
export const randomNumber = new RandomNumber().random;