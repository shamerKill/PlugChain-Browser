export const formatNumberStr = (input: string|number): string => {
  let doStr = typeof input === 'number' ? input.toString() : input;
  if (Number(parseFloat(doStr)) !== Number(input)) return `${input}`;
  let result = '';
  let intValue = doStr;
  const spl = doStr.split('.');
  if (spl.length === 2) (intValue = spl[0]) && (result += `.${spl[1]}`);
  const intResult = intValue.split('').reverse().map((item, index) => {
    if (index % 3 === 0 && index !== 0) return item + ',';
    return item;
  }).reverse().join('');
  result = intResult + result;
  return result;
};