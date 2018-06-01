import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import StateManagerWithApp from './StateManagerWithApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
<StateManagerWithApp />, document.getElementById('root'));
registerServiceWorker();
