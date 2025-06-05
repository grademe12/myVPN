// app/components/HowItWorksSection/HowItWorksSection.js
import styles from './HowItWorksSection.module.css';

// 서버 컴포넌트
export default function HowItWorksSection() {
  const stepsData = [
    {
      number: '1',
      title: '다운로드',
      description: 'Windows용 최신 버전 설치 파일을 다운로드합니다.',
    },
    {
      number: '2',
      title: '설치',
      description: '다운로드한 .exe 파일을 실행하여 화면의 안내에 따라 설치를 완료합니다.',
    },
    {
      number: '3',
      title: '연결',
      description: '프로그램을 실행하고, 원하는 서버를 선택한 후 \'연결\' 버튼을 클릭하세요!',
    },
  ];

  return (
    <section id="how-it-works" className={styles.howItWorksSection}>
      <div className="container"> {/* app/globals.css의 .container 사용 */}
        <h2 className={styles.sectionTitle}>3단계로 시작하기</h2>
        <p className={styles.sectionSubtitle}>
          복잡한 과정 없이 누구나 쉽게 VPN을 사용할 수 있습니다.
        </p>
        <div className={styles.stepsGrid}>
          {stepsData.map((step, index) => (
            <div key={index} className={styles.stepItem}>
              <div className={styles.stepNumber}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}