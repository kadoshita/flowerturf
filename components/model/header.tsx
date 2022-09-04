import Head from 'next/head';

export type HeaderProps = {
  title: string;
};

const Header = (props: HeaderProps) => {
  return (
    <Head>
      <title>{props.title}</title>
      <link rel="icon" href="/favicon.ico" />

      <meta name="theme-color" content="#009688" />

      <meta property="og:title" content="FlowerTurf" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://flowerturf.sublimer.me" />
      <meta property="og:image" content="https://flowerturf.sublimer.me/logo.png" />
      <meta property="og:description" content="複数人対応、インストール不要のボイスチャットツール - FlowerTurf" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@lz650sss" />
      <meta name="twitter:title" content="FlowerTurf" />
      <meta name="twitter:description" content="複数人対応、インストール不要のボイスチャットツール - FlowerTurf" />
      <meta name="twitter:image" content="https://flowerturf.sublimer.me/logo.png" />
      <meta name="twitter:url" content="https://flowerturf.sublimer.me" />
    </Head>
  );
};

export default Header;
