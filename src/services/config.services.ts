import { useCallback, useRef, useEffect } from 'react';
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
  const inTime = useRef(false);
  const languageRef = useRef(language);

  useEffect(() => {
    languageRef.current = language;
  }, [ language ]);

  const changeLanguage = useCallback((setLanguage: InRootState['config']['language']) => {
    if (languageRef.current === setLanguage || inTime.current) return Promise.resolve();
    inTime.current = true;
    const shadowView = window.document.createElement('div');
    shadowView.classList.add('change-language-shadow');
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
          inTime.current = false;
        }, 500);
      }, 500);
    });
  }, [ setConfig ]);
  return [ language, changeLanguage ];
};