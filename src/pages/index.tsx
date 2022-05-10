import { GetStaticProps } from 'next';
import Head from 'next/head';

// import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | SpaceTraveling</title>
      </Head>
      <main className={styles.container}>
        <h1>Olá Mundo</h1>
      </main>
    </>
  );
  // TODO
}

export const getStaticProps: GetStaticProps = async () => {
  console.log('teste');
  // const prismic = getPrismicClient({});
  // const postsResponse = await prismic.getByType(TODO);
  // TODO
  return {
    props: {
      a: 1,
    },
  };
};
