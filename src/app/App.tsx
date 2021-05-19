import { Provider } from 'react-redux';
import { useEffect } from 'react';
import Routers from './routers';
import dataStore from '../databases';
import { themeService } from '../services/config.services';

import './scss/reset.scss';
import './scss/App.scss';
import { ComToolAlertBox } from './components/tools/alert';

const checkoutTheme = () => {
  let linkEle: HTMLLinkElement | null;
  themeService.subscribe(theme => {
    if (!linkEle) linkEle = document.getElementById("HeadTheme") as HTMLLinkElement;
    switch (theme) {
      case 'light':
        linkEle && (linkEle.href = '/theme/theme-light.module.css');
        break;
      case 'dark':
        linkEle && (linkEle.href = '/theme/theme-dark.module.css');
        break;
    }
  });
};

const App = () => {
  useEffect(() => {
    checkoutTheme();
  }, []);
  return (
    <Provider store={dataStore}>
      <Routers />
      <ComToolAlertBox />
    </Provider>
  );
}

export default App;
