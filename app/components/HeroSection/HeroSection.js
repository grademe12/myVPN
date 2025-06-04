// app/components/HeroSection/HeroSection.js
import styles from './HeroSection.module.css';

// 서버 컴포넌트
export default function HeroSection({ serviceName, installerName }) {
    return (
        <section id="hero" className={styles.heroSection}>
            <div className={styles.heroContainer}>
                <h1 className={styles.heroTitle}>{serviceName}</h1>
                <p className={styles.heroSubtitle}>
                    윈도우 PC를 위한 가장 빠르고 안전하며 사용하기 쉬운 VPN 솔루션입니다. 지금 바로 당신의 온라인 프라이버시를 보호하세요.
                </p>
                <a href={`/${installerName}`} className={styles.ctaButton} download>
                    지금 Windows용으로 다운로드
                </a>
                <p className={styles.osNote}>Windows 10 및 11 64비트 환경을 지원합니다.</p>
            </div>
        </section>
    );
}