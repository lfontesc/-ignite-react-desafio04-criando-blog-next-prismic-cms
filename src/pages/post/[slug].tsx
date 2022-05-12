import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <h2>Carregando...</h2>;
  }
  console.log('POST', post);

  return (
    <>
      <Head>
        <title>{post && post.data.title} | Space Traveling</title>
      </Head>

      {post.data.banner.url && (
        <img
          src={post.data.banner.url}
          alt="banner"
          className={styles.bannerImage}
        />
      )}

      <main className={styles.container}>
        <section className={styles.post}>aaaaa</section>
      </main>
    </>
  );
  // TODO
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', { pageSize: 3 });
  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug));
  return {
    props: {
      post: {
        first_publication_date: format(
          new Date(response.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        ),
        data: {
          title: RichText.asText(response.data.title),
          banner: {
            url: response.data.banner.url,
          },
          author: RichText.asText(response.data.author),
        },
        content: response.data.content,
      },
    },
    revalidate: 10,
  };
};
