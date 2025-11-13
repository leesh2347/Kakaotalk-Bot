./iris_control install
./iris control start

irispy가 위치한 백엔드 서버 쪽에서 다음을 실행합니다
백엔드 서버 메인 실행:
python irispy.py

iris_status_check.sh: 프론트엔드측(안드로이드) iris 프로세스 kill 방지 스크립트. 봇이 죽을 때마다 위 명령어를 자동으로 입력해서 재시작시키는 용도입니다.
(2025.11.13 기준, 아직 테스트 미완료 상태. 작동 여부 확실하지는 않음)
