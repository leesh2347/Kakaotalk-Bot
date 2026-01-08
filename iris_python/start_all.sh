#!/bin/bash

set -e

echo "rebooting docker..."
docker restart redroid13

echo "[1/11] Waiting 60 seconds..."
sleep 60

echo "[2/11] iris_control install"
/home/leesh2347/iris/iris_control install

echo "[3/11] Waiting 30 seconds..."
sleep 30

echo "[4/11] iris_control start"
/home/leesh2347/iris/iris_control start

echo "[5/11] Waiting 30 seconds..."
sleep 30

echo "[6/11] Starting iris_server screen session"
/usr/bin/screen -dmS iris_server bash -c "/home/leesh2347/iris/irispy-client/run_iris_server.sh"

echo "[7/11] Waiting 30 seconds..."
sleep 30

echo "[8/11] starting kakaotalk..."
adb shell am start -n com.kakao.talk/.activity.SplashActivity

echo "[9/11] Waiting 30 seconds..."
sleep 30

echo "[10/11] Starting llm_server screen session"
/usr/bin/screen -dmS llm_server bash -c "/home/leesh2347/test/katalkbot_llm_server/run_llm_server.sh"

echo "[11/11] All Startup Complete"
