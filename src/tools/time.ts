export const changeSeconds = (num: number) => num * 1000;

export const formatTime = (time: Date, format = 'YY-MM-DD hh:mm:ss'): string => {
  const date = new Date(time);
  const year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  const preArr = Array.apply(null, Array(10)).map((__, index) => `0${index}`);

  const newTime = format
    .replace(/YY/g, year.toString())
    .replace(/MM/g, preArr[month] || month.toString())
    .replace(/DD/g, preArr[day] || day.toString())
    .replace(/hh/g, preArr[hour] || hour.toString())
    .replace(/mm/g, preArr[min] || min.toString())
    .replace(/ss/g, preArr[sec] || sec.toString());

  return newTime;
};
