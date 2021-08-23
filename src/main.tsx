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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', 'ok');
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
// reportWebVitals(undefined);
