import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

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
  const WORD_PER_MINUTE = 200;
  const { content } = post.data;
  const router = useRouter();

  const wordsContent = content.reduce((total, contentItem) => {
    // eslint-disable-next-line no-param-reassign
    total += contentItem.heading.split(' ').length;

    const words = contentItem.body.map(item => item.text.split(' ').length);
    // eslint-disable-next-line array-callback-return
    words.map(word => {
      total += word;
    });

    return total;
  }, 0);

  const timeRead = `${Math.ceil(wordsContent / WORD_PER_MINUTE)} min`;
  const date_publication = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );

  if (router.isFallback) {
    return <h2>Carregando...</h2>;
  }

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
        <article className={styles.post}>
          <header className={styles.postInfo}>
            <h2>{post.data.title}</h2>
            <div className={styles.infoPublication}>
              <div>
                <FiCalendar /> {date_publication}
              </div>
              <div>
                <FiUser /> {post.data.author}
              </div>
              <div>
                <FiClock /> {timeRead}
              </div>
            </div>
          </header>

          {content &&
            content.map(element => (
              <div key={element.heading} className={styles.postContent}>
                {element.heading && <h2>{element.heading}</h2>}

                <div
                  className={styles.postSection}
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(element.body),
                  }}
                />
              </div>
            ))}
        </article>
      </main>
    </>
  );
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
  const response = await prismic.getByUID('posts', String(slug), {});
  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      author: response.data.author,
      title: response.data.title,
      subtitle: response.data.subtitle,
      content: response.data.content,
      banner: {
        url: response.data.banner.url,
      },
    },
  };
  return {
    props: {
      post,
    },
  };
};
