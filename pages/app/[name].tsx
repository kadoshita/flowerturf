import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

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

  return <Chat></Chat>;
};

export default App;
