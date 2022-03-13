import { Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MenuAppBar from '../../components/model/appBar';
import TextChat from '../../components/model/textChat';
import { persistor, RootState } from '../../store';
import ShareScreen from '../../components/model/shareScreen';
import { updateRoomName } from '../../store/room';
import Header from '../../components/model/header';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { PersistGate } from 'redux-persist/integration/react';

const Chat = dynamic(() => import('../../components/model/chat'), { ssr: false });

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: ['/app/flowerturf', { params: { name: 'flowerturf' } }],
    fallback: true,
  };
};

const App = () => {
  const router = useRouter();
  const roomName: string = useSelector((state: RootState) => state.room.room.name);
  const userName: string = useSelector((state: RootState) => state.user.user.name);
  const dispatch = useDispatch();
  const { name } = router.query;

  useEffect(() => {
    if (userName == '') {
      if (typeof name === 'string' && name !== '') {
        dispatch(updateRoomName(name));
      }
      router.push('/home');
    }
  }, [name]);

  return (
    <div>
      <Header title={`FlowerTurf ${roomName}`}></Header>

      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </div>
  );
};

export default App;
