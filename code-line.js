const fs = require('fs');
const { join } = require('path');

const getFile = (name) => {
  if (/assets$/.test(name)) return 0;
  let allNumber = 0;
  const status = fs.statSync(name);
  if (status.isDirectory()) {
    const list = fs.readdirSync(name);
    list.map(item => getFile(join(name, item))).forEach(item => { allNumber += item; });
  } else {
    const file = fs.readFileSync(name, 'utf-8');
    allNumber += file.split(/(\n)+/).filter(item => item.replace(/\s+/, '') !== '').length;
  }
  return allNumber;
};

console.log(`src code line: ${getFile('./src/')}`);