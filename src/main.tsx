import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './app/App';
// import { reportWebVitals } from './tools';
import 'default-passive-events';


(async () => {
  render(
    <StrictMode>
      <App />
    </StrictMode>,
    document.getElementById('app')
  );
})();


// reportWebVitals(undefined);
