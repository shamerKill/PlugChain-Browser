import { useState } from 'react';
import { InRootState } from '../@types/redux';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import dataStore from '../databases';
import useGetDispatch from '../databases/hook';
import { changeConfig } from '../databases/store/config';

// Config
const configServiceBase = new BehaviorSubject(dataStore.getState().config);
dataStore.subscribe(() => {
  configServiceBase.next(dataStore.getState().config);
});
const configService = configServiceBase.pipe(distinctUntilChanged());
export default configService;

// Theme
const themeServiceBase = new BehaviorSubject(dataStore.getState().config.theme);
export const themeService = themeServiceBase.pipe(distinctUntilChanged());
configService.subscribe(({ theme }) => {
  themeServiceBase.next(theme);
});

// Change Language Hook
export const useLanguageHook = (): [InRootState['config']['language'], (setLanguage: InRootState['config']['language']) => Promise<void>] => {
  const [ { language }, setConfig ] = useGetDispatch<InRootState['config']>('config');
  const [ inTime, setInTime ] = useState(false);

  const shadowView = window.document.createElement('div');
  shadowView.classList.add('change-language-shadow');

  const changeLanguage = (setLanguage: InRootState['config']['language']) => {
    if (language === setLanguage || inTime) return Promise.resolve();
    setInTime(true);
    window.document.body.appendChild(shadowView);
    return new Promise<void>(resolve => {
      setTimeout(() => {
        setConfig({
          type: changeConfig,
          data: { language: setLanguage },
        });
        resolve();
        setTimeout(() => {
          window.document.body.removeChild(shadowView);
          setInTime(false);
        }, 500);
      }, 500);
    });
  };
  return [ language, changeLanguage ];
};