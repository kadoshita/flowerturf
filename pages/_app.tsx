import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { persistor, store } from '../store';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '@mui/system';
import { theme } from '../styles/theme';
import { CssBaseline } from '@mui/material';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline></CssBaseline>
          <Head>
            <link rel="icon" href="/favicon.ico" />

            <meta name="theme-color" content="#009688" />

            <meta property="og:title" content="FlowerTurf" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://flowerturf.tk" />
            <meta property="og:image" content="https://flowerturf.tk/logo.png" />
            <meta property="og:description" content="複数人対応、インストール不要のボイスチャットツール - FlowerTurf" />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@lz650sss" />
            <meta name="twitter:title" content="FlowerTurf" />
            <meta
              name="twitter:description"
              content="複数人対応、インストール不要のボイスチャットツール - FlowerTurf"
            />
            <meta name="twitter:image" content="https://flowerturf.tk/logo.png" />
            <meta name="twitter:url" content="https://flowerturf.tk" />
          </Head>
          <Component {...pageProps} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
