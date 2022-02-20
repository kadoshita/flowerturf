import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const App = () => {
  const router = useRouter();
  const roomName = router.query.name;
  const currentDevice = useSelector((state: RootState) => state.device);
  if (roomName === '') {
    router.push('/home');
  }
  return (
    <div>
      <p>{roomName}</p>
      <p>{currentDevice.audioInput.deviceId}</p>
      <p>{currentDevice.audioOutput.deviceId}</p>
    </div>
  );
};

export default App;
