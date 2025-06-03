// app/components/Navbar/Navbar.js
import Link from 'next/link';
import styles from './Navbar.module.css';

// Navbar는 서버 컴포넌트로 유지 가능 (클라이언트 사이드 상태나 이벤트 핸들러가 없다면)
export default function Navbar({ serviceName }) {
  return (
    <header className={styles.header}>
      <nav>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            {serviceName}
          </Link>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              {/* 페이지 내 앵커 링크는 단순 <a> 태그로도 충분 */}
              <a href="/#features">주요 기능</a>
            </li>
            <li className={styles.navItem}>
              <a href="/#download-cta">다운로드</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}