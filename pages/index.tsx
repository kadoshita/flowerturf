import { Button } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Index.module.css';

const Index: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>FlowerTurf</title>
        <meta name="description" content="複数人対応、インストール不要のボイスチャットツール - FlowerTurf" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>FlowerTurf</h1>

        <p className={styles.description}>
          FlowerTurfは複数人対応、インストール不要のボイスチャットツールです。URLを共有すれば、誰でも参加できます。
        </p>

        <Link href="/home" passHref>
          <Button variant='contained'>はじめる</Button>
        </Link>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>ボイスチャット</h2>
            <p>ボイスチャット機能を時間・人数無制限で利用可能</p>
          </div>

          <div className={styles.card}>
            <h2>画面共有</h2>
            <p>音声と同時に画面の映像を共有可能</p>
          </div>

          <div className={styles.card}>
            <h2>Youtube同時視聴</h2>
            <p>Youtubeのリンクを共有すれば、全員で同時に動画を見ることができます</p>
          </div>

          <div className={styles.card}>
            <h2>配信モード</h2>
            <p>話している内容をラジオ放送のように複数人に配信できます</p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Index;
