import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/assets/styles/index.css';
import '@/assets/styles/global.scss';
import 'antd/dist/reset.css'; // Ant Design 스타일시트
import App from './App.jsx';

// 리덕스 툴킷 provider
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ConfigProvider } from 'antd';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{ algorithm: 'default' }}
      wave={{ disabled: true }}
      typography={{ style: { margin: '0 !important', padding: 0 } }}
      layout={{ style: { backgroundColor: 'transparent' } }}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </ConfigProvider>
  </StrictMode>
);
