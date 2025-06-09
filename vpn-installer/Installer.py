import sys
import os
import subprocess
import json
import requests # API 통신을 위해 필요

# --- 설정 값들 (실제 환경에 맞게 수정 필요) ---
CONFIG_DIR = r"C:\Program Files\WireGuard\Data\Configurations" # WireGuard 설정 파일 디렉토리 (관리자 권한 필요)
WIREGUARD_EXE_PATH = r"C:\Program Files\WireGuard\wireguard.exe" # wireguard.exe 경로
API_ENDPOINT = "https://your-vpn-service.com/api/get_wg_config" # 백엔드 API 엔드포인트
LOG_FILE = "vpn_helper_log.txt" # 로그 파일 경로 (선택 사항)

def log_message(message):
    """간단한 로깅 함수"""
    print(message) # 개발 중에는 콘솔에도 출력
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(f"{message}\n")
    except Exception as e:
        print(f"로깅 오류: {e}")

def get_config_from_api(token):
    """API를 통해 WireGuard 설정 정보를 가져오는 함수"""
    headers = {"Authorization": f"Bearer {token}"}
    try:
        log_message(f"API 요청 시작: {API_ENDPOINT}")
        response = requests.post(API_ENDPOINT, headers=headers, timeout=10) # POST 또는 GET, API 스펙에 따라
        response.raise_for_status() # 200 OK가 아니면 예외 발생

        config_data = response.json() # JSON 응답이라고 가정
        log_message(f"API 응답 성공: {config_data}")
        return config_data
    except requests.exceptions.RequestException as e:
        log_message(f"API 통신 오류: {e}")
        return None
    except json.JSONDecodeError as e:
        log_message(f"API 응답 JSON 파싱 오류: {e}")
        return None

def write_wireguard_config(config_content, tunnel_name="MyVPNServiceTunnel"):
    """WireGuard .conf 파일을 생성/덮어쓰는 함수"""
    if not os.path.exists(CONFIG_DIR):
        try:
            os.makedirs(CONFIG_DIR) # 이 경로는 보통 관리자 권한으로만 생성 가능
            log_message(f"설정 디렉토리 생성: {CONFIG_DIR}")
        except OSError as e:
            log_message(f"설정 디렉토리 생성 실패 ({CONFIG_DIR}): {e} - 관리자 권한으로 실행해야 할 수 있습니다.")
            return None

    conf_file_path = os.path.join(CONFIG_DIR, f"{tunnel_name}.conf")
    try:
        with open(conf_file_path, "w", encoding="utf-8") as f:
            f.write(config_content)
        log_message(f"WireGuard 설정 파일 저장 성공: {conf_file_path}")
        return conf_file_path
    except IOError as e:
        log_message(f"WireGuard 설정 파일 저장 실패 ({conf_file_path}): {e} - 관리자 권한으로 실행해야 할 수 있습니다.")
        return None

def control_wireguard_tunnel(conf_file_path, action="start"):
    """WireGuard 터널을 제어하는 함수 (서비스 기반)"""
    if not conf_file_path:
        return False

    # .conf 파일명에서 터널 이름 추출 (확장자 제외)
    tunnel_name_from_file = os.path.splitext(os.path.basename(conf_file_path))[0]
    service_name = f"WireGuardTunnel${tunnel_name_from_file}"

    try:
        if action == "start":
            # 1. 기존 서비스가 있다면 중지 시도 (설정 변경을 위해)
            #    만약 항상 같은 tunnel_name_from_file을 쓴다면 이 과정이 중요.
            #    sc.exe query <service_name> 으로 상태 확인 후 stop 가능
            try:
                subprocess.run([WIREGUARD_EXE_PATH, "/uninstallservice", tunnel_name_from_file], check=False, capture_output=True) # 기존 서비스 제거 시도
                log_message(f"기존 서비스 제거 시도: {service_name}")
            except FileNotFoundError:
                log_message(f"wireguard.exe 경로 오류: {WIREGUARD_EXE_PATH}")
                return False
            except Exception: # 다른 오류는 일단 무시하고 진행
                pass

            # 2. 서비스 설치 (또는 업데이트)
            # 이 명령어는 .conf 파일을 WireGuard의 내부 관리 폴더로 복사하고 서비스를 준비시킵니다.
            result = subprocess.run([WIREGUARD_EXE_PATH, "/installservice", conf_file_path], check=True, capture_output=True, text=True, encoding='utf-8', errors='ignore')
            log_message(f"WireGuard 서비스 설치/업데이트 성공: {service_name}\n{result.stdout}\n{result.stderr}")

            # 3. 서비스 시작
            result = subprocess.run(["sc.exe", "start", service_name], check=True, capture_output=True, text=True, encoding='utf-8', errors='ignore')
            log_message(f"WireGuard 서비스 시작 성공: {service_name}\n{result.stdout}\n{result.stderr}")
            return True

        elif action == "stop":
            result = subprocess.run(["sc.exe", "stop", service_name], check=True, capture_output=True, text=True, encoding='utf-8', errors='ignore')
            log_message(f"WireGuard 서비스 중지 성공: {service_name}\n{result.stdout}\n{result.stderr}")

            # 서비스 제거 (선택 사항: 연결 끊을 때마다 서비스를 제거할지, 아니면 중지만 할지)
            # result = subprocess.run([WIREGUARD_EXE_PATH, "/uninstallservice", tunnel_name_from_file], check=True, capture_output=True, text=True, encoding='utf-8', errors='ignore')
            # log_message(f"WireGuard 서비스 제거 성공: {tunnel_name_from_file}\n{result.stdout}\n{result.stderr}")
            return True

    except subprocess.CalledProcessError as e:
        error_output = e.stderr if e.stderr else e.stdout # sc.exe는 stdout으로 에러를 출력할 때가 있음
        log_message(f"WireGuard 서비스 제어 오류 ({action} {service_name}): {error_output}")
        return False
    except FileNotFoundError:
        log_message(f"실행 파일(wireguard.exe 또는 sc.exe) 경로 오류. PATH 또는 WIREGUARD_EXE_PATH 확인 필요.")
        return False
    return False

def main():
    log_message("VPN 헬퍼 시작.")

    # 사용자 정의 URL 스킴을 통해 실행될 경우, 첫 번째 인자가 URL 전체가 됩니다.
    # 예: myvpn://configure?token=ABC123
    # sys.argv[0]는 스크립트/exe 자신의 경로입니다.
    if len(sys.argv) > 1:
        url_scheme_arg = sys.argv[1]
        log_message(f"전달받은 인자: {url_scheme_arg}")

        # 간단한 파싱 예제 (실제로는 urllib.parse 등을 사용하는 것이 좋음)
        if "token=" in url_scheme_arg:
            try:
                token = url_scheme_arg.split("token=")[1].split("&")[0] # 매우 단순한 파싱
                log_message(f"추출된 토큰: {token}")

                # 1. API에서 설정 정보 가져오기
                wg_config_params = get_config_from_api(token)

                if wg_config_params and "config_content" in wg_config_params:
                    # API 응답에서 실제 .conf 파일 내용을 받아온다고 가정
                    config_content = wg_config_params["config_content"]
                    tunnel_name = wg_config_params.get("tunnel_name", "MyVPNServiceTunnel") # API에서 터널 이름도 받아올 수 있음

                    # 2. .conf 파일 작성
                    conf_file_path = write_wireguard_config(config_content, tunnel_name)

                    if conf_file_path:
                        # 3. WireGuard 터널 시작
                        if control_wireguard_tunnel(conf_file_path, action="start"):
                            log_message(f"{tunnel_name} VPN 연결 프로세스 성공.")
                            # 여기에 성공 알림 (예: 간단한 팝업) 추가 가능
                        else:
                            log_message(f"{tunnel_name} VPN 연결 프로세스 실패.")
                            # 실패 알림 추가 가능
                else:
                    log_message("API로부터 유효한 설정 정보를 받지 못했습니다.")
                    # 실패 알림 추가 가능

            except IndexError:
                log_message("토큰 파싱 오류: token= 다음에 값이 없습니다.")
            except Exception as e:
                log_message(f"메인 로직 처리 중 예외 발생: {e}")

        else:
            log_message("URL 인자에서 'token='을 찾을 수 없습니다.")
    else:
        log_message("실행 시 필요한 인자(URL 스킴)가 없습니다.")
        # 이 헬퍼는 보통 URL 스킴을 통해 실행되므로, 직접 실행 시 사용법 안내 등을 할 수 있음

    log_message("VPN 헬퍼 종료.")

if __name__ == "__main__":
    # 실제 배포 시에는 이 스크립트가 관리자 권한으로 실행되어야 할 가능성이 높습니다.
    # 관리자 권한으로 실행되지 않았다면, 사용자에게 알리거나 자동 권한 상승 로직이 필요할 수 있습니다.
    main()