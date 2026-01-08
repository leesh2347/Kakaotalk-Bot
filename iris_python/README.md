초기세팅방법.txt를 참고하여 도커 및 iris 초기세팅부터 진행해 주세요

/home/user 가 루트 디렉토리라고 가정,
/home/user/iris 안에 start_all.sh 를,
/home/user/iris/irispy-client 안에 run_iris_server.sh 를 넣어준 후
crontab 설정을 해두면 재부팅마다 봇 자동 세팅이 완료됩니다.

./iris_control install
./iris control start

irispy가 위치한 백엔드 서버 쪽에서 다음을 실행합니다
백엔드 서버 메인 실행:
python irispy.py
