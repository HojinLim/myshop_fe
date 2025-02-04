import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/assets/styles/index.css';
import '@/assets/styles/global.scss';
import App from './App.jsx';

// 리덕스 툴킷 provider
import { Provider } from 'react-redux';
import { store } from '@/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
