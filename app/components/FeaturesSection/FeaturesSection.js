// app/components/FeaturesSection/FeaturesSection.js
import Image from 'next/image'; // next/image 사용 권장
import styles from './FeaturesSection.module.css';

// 서버 컴포넌트
export default function FeaturesSection({ serviceName }) {
    const featuresData = [
        {
            iconSrc: '/images/speed-icon.svg', // public/images/ 부터의 경로
            altText: '속도 아이콘',
            tempIcon: '⚡',
            title: '초고속 연결',
            description: '최적화된 서버 네트워크를 통해 지연 없는 빠른 속도로 인터넷을 즐기세요.',
        },
        {
            iconSrc: '/images/security-icon.svg',
            altText: '보안 아이콘',
            tempIcon: '🛡️',
            title: '강력한 보안',
            description: '최신 WireGuard® 프로토콜 기반의 강력한 암호화로 당신의 개인 정보를 안전하게 보호합니다.',
        },
        {
            iconSrc: '/images/easy-icon.svg',
            altText: '사용 편의성 아이콘',
            tempIcon: '👍',
            title: '놀라운 사용 편의성',
            description: '간단한 설치 과정과 직관적인 인터페이스로 클릭 한 번이면 바로 연결됩니다.',
        },
    ];

    return (
        <section id="features" className={styles.featuresSection}>
            <div className="container"> {/* 글로벌 .container 클래스 활용 */}
                <h2 className={styles.sectionTitle}>왜 {serviceName}인가?</h2>
                <p className={styles.sectionSubtitle}>최고의 VPN 경험을 제공하기 위해 항상 노력합니다.</p>
                <div className={styles.featuresGrid}>
                    {featuresData.map((feature, index) => (
                        <div key={index} className={styles.featureItem}>
                            {/* public 폴더의 이미지를 next/image로 사용하려면 width와 height를 지정해야 합니다.
                실제 아이콘 이미지를 public/images 폴더에 넣고 사용하세요.
                만약 아이콘 파일이 없다면, 아래 tempIcon 부분을 사용합니다.
              */}
                            {/* <div className={styles.featureIcon}>
                <Image src={feature.iconSrc} alt={feature.altText} width={50} height={50} />
              </div> */}
                            <div className={styles.tempIcon}>{feature.tempIcon}</div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}