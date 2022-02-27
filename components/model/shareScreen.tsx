import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ShareScreen = () => {
  const currentScreenStream = useSelector((state: RootState) => state.stream.screen);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    if (currentScreenStream.stream) {
      currentScreenStream.stream.attach(videoRef.current);
      videoRef.current.play();
    } else {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  }, [currentScreenStream]);

  if (currentScreenStream.stream) {
    return <video ref={videoRef} autoPlay style={{ width: '100%' }}></video>;
  } else {
    return <></>;
  }
};

export default ShareScreen;
