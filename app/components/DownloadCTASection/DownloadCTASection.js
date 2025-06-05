// app/components/DownloadCTASection/DownloadCTASection.js
import styles from './DownloadCTASection.module.css';

// 서버 컴포넌트
export default function DownloadCTASection({ serviceName, installerName }) {
  return (
    <section id="download-cta" className={styles.ctaSection}>
      <div className="container"> {/* app/globals.css의 .container 사용 */}
        <h2 className={styles.sectionTitle}>지금 바로 시작하세요</h2>
        <p className={styles.sectionSubtitle}>
          더 이상 망설이지 마세요. {serviceName}과 함께 안전하고 자유로운 인터넷을 경험할 시간입니다.
        </p>
        {/* public 폴더에 있는 YOUR_VPN_INSTALLER.exe 파일을 다운로드 링크로 연결합니다.
          파일 이름은 app/page.js 에서 props로 전달받습니다.
        */}
        <a href={`/${installerName}`} className={styles.ctaButton} download>
          Windows용 무료 다운로드
        </a>
      </div>
    </section>
  );
}