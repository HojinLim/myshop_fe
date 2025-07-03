import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/assets/styles/index.css';
import '@/assets/styles/global.scss';
import 'antd/dist/reset.css'; // Ant Design 스타일시트
import App from './App.jsx';

// 리덕스 툴킷 provider
import { Provider } from 'react-redux';
import { persistor } from '@/store';
import store from '@/store';
import { ConfigProvider, theme } from 'antd';
import { PersistGate } from 'redux-persist/integration/react';

// react query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{ algorithm: theme.defaultAlgorithm }}
      wave={{ disabled: true }}
      typography={{ style: { margin: '0 !important', padding: 0 } }}
      layout={{ style: { backgroundColor: 'transparent' } }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </ConfigProvider>
  </QueryClientProvider>
  // </StrictMode>
);
