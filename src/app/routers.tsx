import { useEffect } from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import RoutersRoot from '../routers';
import { useLanguageHook } from '../services/config.services';

const Routers = () => {
  const [, changeLanguage] = useLanguageHook();
  useEffect(() => {
    let userLanguage = window.navigator.language;
    if (/zh/.test(userLanguage)) userLanguage = 'zh-CN';
    else if (/en/.test(userLanguage)) userLanguage = 'en-US';
    switch (userLanguage) {
      case 'zh-CN': changeLanguage('zh-CN'); break;
      case 'en-US': changeLanguage('en-US'); break;
      default: changeLanguage('en-US');
      }
  }, [changeLanguage]);
  return (
    <BrowserRouter>
      <Switch>
        {
          RoutersRoot.map(router => (
            <Route {...router} />
          ))
        }
      </Switch>
    </BrowserRouter>
  );
};

export default Routers;
