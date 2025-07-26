#!/bin/bash
# set -ex

# ps -ef | grep normal.sh
# ps -ef --forest
# ps -A -o pid,ppid,comm,args > ps.txt

echo "normal.sh PID-PPID $$,$PPID"
bash child.sh > /dev/tty 2>&1
