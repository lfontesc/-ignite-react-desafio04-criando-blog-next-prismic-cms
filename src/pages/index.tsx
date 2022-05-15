import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { useState } from 'react';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

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
  const [nextPage, setNextPage] = useState<string>(postsPagination.next_page);
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  function loadMorePosts(): void {
    fetch(nextPage)
      .then(res => res.json())
      .then(data => {
        const newPosts = data.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });

        setPosts([...posts, ...newPosts]);
        setNextPage(data.next_page);
      });
  }

  return (
    <>
      <Head>
        <title>Home | SpaceTraveling</title>
      </Head>
      <main className={commonStyles.container}>
        <section className={styles.posts}>
          {posts.map(post => {
            return (
              <Link href={`/post/${post.uid}`} key={post.uid}>
                <div className={styles.postInfo}>
                  <h2>{post.data.title}</h2>
                  <span>{post.data.subtitle}</span>
                  <div className={styles.infoPublication}>
                    <div>
                      <FiUser />{' '}
                      <time>
                        {format(
                          new Date(post.first_publication_date),
                          'dd MMM yyyy',
                          {
                            locale: ptBR,
                          }
                        )}
                      </time>
                    </div>
                    <div>
                      <FiCalendar /> {post.data.author}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {nextPage && (
            <button
              type="button"
              className={styles.loadMore}
              onClick={loadMorePosts}
            >
              Carregar mais posts
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
  });

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        results,
        next_page: postsResponse.next_page,
      },
    },
  };
};
