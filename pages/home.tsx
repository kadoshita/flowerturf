import { Button, Stack } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import DeviceSelect from '../components/model/deviceSelect';
import NameInput from '../components/model/nameInput';
import { RootState } from '../store';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const currentRoomName = useSelector((state: RootState) => state.room.room.name);
  return (
    <div className={styles.container}>
      <Head>
        <title>FlowerTurf</title>
        <meta name="description" content="複数人対応、インストール不要のボイスチャットツール - FlowerTurf" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Stack spacing={2}>
          <DeviceSelect></DeviceSelect>
          <NameInput></NameInput>
          <Link href={`/app/${currentRoomName}`} passHref>
            <Button variant="contained">開始</Button>
          </Link>
        </Stack>
      </main>
    </div>
  );
};

export default Home;
