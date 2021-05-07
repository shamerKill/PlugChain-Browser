import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import { reportWebVitals, getEnvConfig } from './tools';


(async () => {
  // 如果不是正式，使用mock
  if (getEnvConfig.PRODUCTION === false) (await import('./mocks')).default();

  const readerDom = getEnvConfig.PRODUCTION
    ? (<StrictMode>
        <App />
      </StrictMode>)
    : <App />;
  ReactDOM.render(
    readerDom,
    document.getElementById('app')
  );
})();


reportWebVitals(!getEnvConfig.PRODUCTION ? console.log : undefined);
