import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Routers from './routers';

import './scss/reset.scss';
import './scss/App.scss';

const App = () => {
  const store = createStore(() => {});
  return (
    <Provider store={store}>
      <Routers />
    </Provider>
  );
}

export default App;
