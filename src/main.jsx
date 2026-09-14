import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

const loadAdNetwork = () => {
  try {
    const s = document.createElement('script');
    s.async = true;
    s.dataset.cfasync = 'false';
    s.src = 'https://pl30777280.effectivecpmnetwork.com/b3/6c/7e/b36c7ed66c9b32639321def7461f1e82.js';
    document.head.appendChild(s);
  } catch (e) {
    console.warn('Ad network script failed to load', e);
  }
};

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(loadAdNetwork, { timeout: 1500 });
} else {
  setTimeout(loadAdNetwork, 1000);
}