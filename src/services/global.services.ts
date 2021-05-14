import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const getWindowSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return { width, height };
};

const windowResizeSubject = new BehaviorSubject<{width: number, height: number}>(getWindowSize());
window.onresize = () => {
  windowResizeSubject.next(getWindowSize());
};


export const windowResizeObserver = windowResizeSubject.pipe(distinctUntilChanged());
