// app/layout.js
import './globals.css'; // 글로벌 스타일 임포트
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// 여기에 기본 메타데이터를 정의할 수 있습니다.
export const metadata = {
    title: '[Your VPN Service Name] - Default Title', // 기본 타이틀, 각 페이지에서 오버라이드 가능
    description: '윈도우를 위한 빠르고 안전한 VPN 서비스입니다.',
    icons: {
        icon: '/favicon.ico', // public 폴더의 favicon.ico
    },
};

const serviceName = "[Your VPN Service Name]"; // props로 전달하기 위해 여기서 정의

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
        <body>
        <Navbar serviceName={serviceName} />
        <main>{children}</main>
        <Footer serviceName={serviceName} />
        </body>
        </html>
    );
}