import { Button } from '@mui/material';
import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import Header from '../components/model/header';
import styles from '../styles/Index.module.css';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

const Index: NextPage = () => {
  return (
    <div className={styles.container}>
      <Header title='FlowerTurf'></Header>

      <main className={styles.main}>
        <h1 className={styles.title}>FlowerTurf</h1>

        <p className={styles.description}>
          FlowerTurfは複数人対応、インストール不要のボイスチャットツールです。URLを共有すれば、アカウント不要で誰でも参加できます。
        </p>

        <Link href="/home" passHref>
          <Button variant="contained" color="secondary">
            はじめる
          </Button>
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

          <div className={`${styles.card} ${styles.wip}`}>
            <h2>Youtube同時視聴</h2>
            <p>Youtubeのリンクを共有すれば、全員で同時に動画を見ることができます (WIP)</p>
          </div>

          <div className={`${styles.card} ${styles.wip}`}>
            <h2>配信モード</h2>
            <p>話している内容をラジオ放送のように複数人に配信できます (WIP)</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
