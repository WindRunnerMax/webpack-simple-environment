#!/bin/bash

# 获取脚本所在目录
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
HOST=https://huggingface.co
MODEL=Xenova/all-MiniLM-L6-v2

# 切换到脚本目录
cd "$SCRIPT_DIR" || exit 1


mkdir -p $MODEL
cd $MODEL || exit 1

rm -rf *
wget ${HOST}/$MODEL/resolve/main/tokenizer.json
wget ${HOST}/$MODEL/resolve/main/tokenizer_config.json
wget ${HOST}/$MODEL/resolve/main/config.json

mkdir -p onnx
cd onnx || exit 1
wget ${HOST}/$MODEL/resolve/main/onnx/model_quantized.onnx

