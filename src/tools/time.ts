import { timer } from 'rxjs';

export const changeSeconds = (num: number) => num * 1000;

export const sleep = (time: number) => new Promise(resolve => timer(changeSeconds(time)).subscribe(resolve));

export const formatTime = (time: string, format = 'YY-MM-DD hh:mm:ss'): string => {
  let date = new Date();
  if (!isNaN(new Date(time).getDate())) date = new Date(time);
  else date = new Date((time || '').replace(new RegExp('-', 'g'), '/'));
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
