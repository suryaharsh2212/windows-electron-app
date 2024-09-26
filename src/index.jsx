import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
const root = createRoot(document.body);
root.render(


  <Provider store={store}>
  <App />
</Provider>,

);