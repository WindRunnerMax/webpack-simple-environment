#!/bin/bash
# set -ex

echo "fork.sh PID-PPID $$,$PPID"

# linux setsid / mac disown
# 注意重定向到 tty 终端不会停, 可以输出到文件
bash child.sh > /dev/tty 2>&1 &
disown -h %1
