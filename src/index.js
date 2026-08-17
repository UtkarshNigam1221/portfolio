import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

/* GLOBAL VARIABLES */

window.$primaryLanguage = 'en';
window.$primaryLanguageIconId = 'primary-lang-icon';

ReactDOM.render(<App />, document.getElementById('root'));
// unregister, not register: the cached shell served stale content after a
// deploy, and this site has nothing to gain from offline support.
serviceWorker.unregister();
