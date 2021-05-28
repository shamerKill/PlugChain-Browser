import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import { reportWebVitals } from './tools';


(async () => {
  // 如果不是正式，使用mock
  // if (getEnvConfig.PRODUCTION === false) (await import('./mocks')).default();

  ReactDOM.render(
    <StrictMode>
      <App />
    </StrictMode>,
    document.getElementById('app')
  );
})();


reportWebVitals(undefined);
