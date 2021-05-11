import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import dataStore from '../databases';

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
