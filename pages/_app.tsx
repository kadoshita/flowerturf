import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { persistor, store } from '../store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/system';
import { theme } from '../styles/theme';
import { CssBaseline } from '@mui/material';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline></CssBaseline>
          <Component {...pageProps} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
