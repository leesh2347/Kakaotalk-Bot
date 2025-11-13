#사용법: iris_status_check.sh


TARGET_IP="172.17.0.2"
TARGET_PORT=3000
INTERVAL_SEC=600   # 10분 = 600초

IRIS_CTL="/home/leesh2347/iris/iris_control"

while true; do
    NOW="$(date '+%Y-%m-%d %H:%M:%S')"
    echo "[$NOW] 🔍 $TARGET_IP:$TARGET_PORT 연결 확인 중..."

    # ---- 포트 연결 확인 (/dev/tcp 사용, bash 전용) ----
    if timeout 3 bash -c "echo > /dev/tcp/$TARGET_IP/$TARGET_PORT" 2>/dev/null; then
        echo "[$NOW] ✅ $TARGET_IP:$TARGET_PORT 연결 양호. 아무 작업도 하지 않습니다."
    else
        echo "[$NOW] ❌ $TARGET_IP:$TARGET_PORT 연결 실패. iris_control 실행."

        # 실패 시 실행할 명령어들
        "$IRIS_CTL" install
        "$IRIS_CTL" start
    fi

    echo "[$NOW] ⏱ 다음 체크까지 ${INTERVAL_SEC}초 대기..."
    sleep "$INTERVAL_SEC"
done
