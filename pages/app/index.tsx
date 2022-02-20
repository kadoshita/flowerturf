import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AppIndex = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/home');
  }, []);

  return <></>;
};
export default AppIndex;
