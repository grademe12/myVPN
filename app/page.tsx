// app/page.js
// 이 페이지는 서버 컴포넌트입니다.
import HeroSection from './components/HeroSection/HeroSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection/HowItWorksSection'; // 생성했다고 가정
import DownloadCTASection from './components/DownloadCTASection/DownloadCTASection'; // 생성했다고 가정

// 페이지별 메타데이터 (app/layout.js의 메타데이터를 오버라이드하거나 보강)
export const metadata = {
  title: '[Your VPN Service Name] - 윈도우를 위한 빠르고 안전한 VPN',
  description: '[Your VPN Service Name]은 윈도우 사용자를 위한 최고의 VPN 솔루션입니다. 빠르고 안전하게 온라인 프라이버시를 보호하세요.',
  keywords: 'VPN, Windows VPN, [Your VPN Service Name], WireGuard, 보안, 프라이버시',
};

const serviceName = "[Your VPN Service Name]"; // 실제 서비스 이름으로 변경
const installerName = "YOUR_VPN_INSTALLER.exe"; // public 폴더 내의 실제 설치 파일명

export default function HomePage() {
  return (
      <>
        {/* Navbar와 Footer는 app/layout.js에서 처리 */}
        <HeroSection serviceName={serviceName} installerName={installerName} />
        <FeaturesSection serviceName={serviceName} />
        <HowItWorksSection /> {/* Props가 필요하면 전달 */}
        <DownloadCTASection serviceName={serviceName} installerName={installerName} />
      </>
  );
}