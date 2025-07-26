#!/bin/bash
set -ex

# ps -A -o pid,ppid,comm,args > ps.txt
# lsof -i :3000
# kill -INT 1234
# Ctrl+C 会给整个前台进程组发送 SIGINT 信号
# 在业务中可能会仅可能给主进程发送 SIGINT 信号

echo "signal.sh PID-PPID $$,$PPID"

npx tsx ./src/index.ts
# exec npx tsx ./src/index.ts
# export PATH="$PWD/node_modules/.bin:$PATH"
# exec tsx ./src/index.ts
