import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.containerHeader}>
      <div className={styles.headerContent}>
        <Link href="/">
          <figure className={styles.logo}>
            <img src="/images/logo.svg" alt="logo" />
          </figure>
        </Link>
      </div>
    </header>
  );
}
