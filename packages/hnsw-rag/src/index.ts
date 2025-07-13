import path from "node:path";

import type { FeatureExtractionPipeline } from "@xenova/transformers";
import { env, pipeline } from "@xenova/transformers";
import { HierarchicalNSW } from "hnswlib-node";

import type { DocumentChunk } from "./types";

/**
 * 初始化向量数据库和嵌入模型
 */
const initialize = async () => {
  const model = "Xenova/all-MiniLM-L6-v2";
  console.log("初始化 embedding 模型...", model);
  env.localModelPath = path.resolve(__dirname, "../", "embedding");
  const featureExtractor = await pipeline("feature-extraction", model);

  console.log("初始化向量数据库...", "HierarchicalNSW");
  const embeddingDIM = 384; // 嵌入向量的维度
  const maxElements = 1000; // 最大元素数量
  const efConstruction = 200; // 构建时动态候选列表大小
  const M = 16; // 每个节点的最大连接数
  const vectorStore = new HierarchicalNSW("cosine", embeddingDIM);
  vectorStore.initIndex(maxElements, efConstruction, M);
  return { featureExtractor, vectorStore };
};

/**
 * 文本分片方法
 */
const spiltTextChunks = (text: string): string[] => {
  // 这里是直接根据 固定长度 + overlap 分片，此外还有 结构分片 等策略
  const chunkSize = 100;
  const overlap = 20;
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    const chunk = text.slice(i, i + chunkSize);
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }
  }
  return chunks;
};

/**
 * 文本 embedding
 */
const embeddingTextChunk = async (
  featureExtractor: FeatureExtractionPipeline,
  text: string
): Promise<number[]> => {
  const output = await featureExtractor(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
};

/**
 * 并行存储
 */
const docMap: Record<string, DocumentChunk & { label: number }> = {};
const labelMap: Record<number, DocumentChunk> = {};
const getParallelStoreLabel = async (chunk: DocumentChunk) => {
  if (docMap[chunk.id]) {
    const meta = docMap[chunk.id];
    labelMap[meta.label] = chunk;
    return { meta, label: meta.label };
  }
  const label = Object.keys(docMap).length;
  docMap[chunk.id] = { ...chunk, label };
  labelMap[label] = chunk;
  return { meta: docMap[chunk.id], label };
};

/**
 * 添加文本到向量数据库
 */
const addTextToVectorStore = async (
  vectorStore: HierarchicalNSW,
  featureExtractor: FeatureExtractionPipeline,
  documents: string[]
): Promise<void> => {
  for (let docIndex = 0; docIndex < documents.length; docIndex++) {
    const doc = documents[docIndex];
    const textChunks = spiltTextChunks(doc);
    for (let chunkIndex = 0; chunkIndex < textChunks.length; chunkIndex++) {
      const chunk = textChunks[chunkIndex];
      const chunkId = `doc_${docIndex}_chunk_${chunkIndex}`;
      const vector = await embeddingTextChunk(featureExtractor, chunk);
      const documentChunk: DocumentChunk = {
        id: chunkId,
        content: chunk,
        metadata: { docIndex, chunkIndex },
      };
      const { label } = await getParallelStoreLabel(documentChunk);
      vectorStore.addPoint(vector, label);
    }
  }
};

(async () => {
  const { featureExtractor, vectorStore } = await initialize();
  const documents = [
    "量子计算是一种利用量子力学原理进行计算的新型计算模式。与传统计算机不同，量子计算机使用量子比特(qubit)作为基本信息单位。",
    "巴黎是法国的首都，位于塞纳河畔，以其艺术、文化和历史闻名。著名地标包括埃菲尔铁塔和卢浮宫。",
    "机器学习是人工智能的一个分支，涉及使用算法和统计模型使计算机系统能够执行特定任务，而无需使用显式指令。它依赖于模式识别和推理。",
    "自然语言处理(NLP)是人工智能的一个领域，专注于计算机与人类语言之间的交互。它涉及文本分析、语音识别和生成等技术。",
    "深度学习是机器学习的一个子领域，使用多层神经网络来学习数据的复杂表示。它在图像识别和自然语言处理方面表现出色。",
    "深度学习是机器学习的一个子集，使用多层神经网络来模拟人脑处理信息的方式。它在图像识别、语音识别和自然语言处理等领域取得了显著进展。",
  ];
  console.log("添加文档到向量数据库...");
  await addTextToVectorStore(vectorStore, featureExtractor, documents);

  console.log("搜索向量数据库...");
  const searchQuery = "机器学习是什么？";
  const queryEmbedding = await embeddingTextChunk(featureExtractor, searchQuery);
  const searchResults = vectorStore.searchKnn(queryEmbedding, /** TopK */ 3);
  const results = searchResults.neighbors.map((index, i) => ({
    id: labelMap[index].id,
    chunk: labelMap[index].content,
    metadata: labelMap[index].metadata,
    score: 1 - searchResults.distances[i],
  }));
  console.log("搜索结果:", results);
})();
