#!/bin/bash

cd /home/leesh2347/iris/irispy-client || exit 1
source venv/bin/activate
python irispy.py 172.17.0.2:3000
