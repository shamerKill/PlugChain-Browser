import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import reportWebVitals from './tools/reportWebVitals';


ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('app')
);

reportWebVitals(process.env.NODE_ENV !== 'production' ? console.log : undefined);
