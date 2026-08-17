import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// Older deploys registered a service worker that then served a stale shell.
// Tear it down for anyone still carrying one; nothing registers it now.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
}
