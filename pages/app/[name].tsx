import { Grid } from '@mui/material';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import MenuAppBar from '../../components/model/appBar';
import TextChat from '../../components/model/textChat';
import { RootState } from '../../store';
import ShareScreen from '../../components/model/shareScreen';

const Chat = dynamic(() => import('../../components/model/chat'), { ssr: false });

const App = () => {
  const router = useRouter();
  const roomName: string = useSelector((state: RootState) => state.room.room.name);
  const userName: string = useSelector((state: RootState) => state.user.user.name);

  useEffect(() => {
    if (roomName === '' || userName === '') {
      router.push('/home');
    }
  }, []);

  return (
    <div>
      <Head>
        <title>FlowerTurf {roomName}</title>
        <meta name="description" content="複数人対応、インストール不要のボイスチャットツール - FlowerTurf" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MenuAppBar roomName={roomName} userName={userName}></MenuAppBar>
      <Grid container style={{ height: 'calc(100vmin - 64px)', minHeight: 'calc(100vh - 64px)' }}>
        <Grid item xs={12} lg={10} className="user-items">
          <ShareScreen></ShareScreen>
          <Chat></Chat>
        </Grid>
        <Grid item xs={12} lg={2} style={{ minHeight: '80vh' }}>
          <TextChat></TextChat>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
