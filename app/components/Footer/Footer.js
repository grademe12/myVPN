// app/components/Footer/Footer.js
import Link from 'next/link';
import styles from './Footer.module.css';

// Footer도 서버 컴포넌트로 유지 가능
export default function Footer({ serviceName }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} {serviceName}. 모든 권리 보유.
        </p>
        <p className={styles.footerLinks}>
          <Link href="/privacy-policy">개인정보처리방침</Link> | <Link href="/terms-of-service">이용약관</Link>
        </p>
      </div>
    </footer>
  );
}