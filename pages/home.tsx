import type { NextPage } from 'next';
import Head from 'next/head';
import { useSelector } from 'react-redux';
import DeviceSelect from '../components/model/deviceSelect';
import { RootState } from '../store';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>FlowerTurf</title>
        <meta name="description" content="複数人対応、インストール不要のボイスチャットツール - FlowerTurf" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <DeviceSelect></DeviceSelect>
      </main>
    </div>
  );
};

export default Home;
