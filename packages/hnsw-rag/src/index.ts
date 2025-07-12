/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "node:path";

import type { FeatureExtractionPipeline } from "@xenova/transformers";
import { env, pipeline } from "@xenova/transformers";
import { HierarchicalNSW } from "hnswlib-node";

// 文档分片接口
interface DocumentChunk {
  id: string;
  content: string;
  metadata?: Record<string, any>;
}

// 搜索结果接口
interface SearchResult {
  chunk: DocumentChunk;
  score: number;
}

// 分片配置接口
interface ChunkConfig {
  chunkSize: number;
  overlap: number;
}

// 简易 RAG 系统类
class SimpleRAGSystem {
  private vectorStore!: HierarchicalNSW;
  private embedder!: FeatureExtractionPipeline;
  private chunks: DocumentChunk[] = [];
  private initialized = false;
  private readonly embeddingDim = 384; // all-MiniLM-L6-v2 的维度

  constructor(
    private maxElements: number = 1000,
    private efConstruction: number = 200,
    private M: number = 16
  ) {}

  // 初始化系统
  async initialize(): Promise<void> {
    console.log("正在初始化 embedding 模型...");
    env.localModelPath = path.resolve(__dirname, "../", "embedding");
    this.embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

    console.log("正在初始化向量数据库...");
    this.vectorStore = new HierarchicalNSW("cosine", this.embeddingDim);
    this.vectorStore.initIndex(this.maxElements, this.efConstruction, this.M);

    this.initialized = true;
    console.log("系统初始化完成！");
  }

  // 文本分片方法
  private chunkText(text: string, config: ChunkConfig): string[] {
    const { chunkSize, overlap } = config;
    const chunks: string[] = [];

    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      const chunk = text.slice(i, i + chunkSize);
      if (chunk.trim().length > 0) {
        chunks.push(chunk.trim());
      }
    }

    return chunks;
  }

  // 生成文本的 embedding
  private async generateEmbedding(text: string): Promise<number[]> {
    const output = await this.embedder(text, {
      pooling: "mean",
      normalize: true,
    });
    return Array.from(output.data);
  }

  // 添加文档到系统
  async addDocuments(
    documents: string[],
    chunkConfig: ChunkConfig = { chunkSize: 500, overlap: 50 }
  ): Promise<void> {
    if (!this.initialized) {
      throw new Error("系统未初始化，请先调用 initialize() 方法");
    }

    console.log(`正在处理 ${documents.length} 个文档...`);

    for (let docIndex = 0; docIndex < documents.length; docIndex++) {
      const document = documents[docIndex];
      const textChunks = this.chunkText(document, chunkConfig);

      for (let chunkIndex = 0; chunkIndex < textChunks.length; chunkIndex++) {
        const chunk = textChunks[chunkIndex];
        const chunkId = `doc_${docIndex}_chunk_${chunkIndex}`;

        const embedding = await this.generateEmbedding(chunk);

        const documentChunk: DocumentChunk = {
          id: chunkId,
          content: chunk,
          metadata: { docIndex, chunkIndex },
        };

        this.vectorStore.addPoint(embedding, this.chunks.length);
        this.chunks.push(documentChunk);
      }
    }

    console.log(`共添加 ${this.chunks.length} 个分片到向量数据库`);
  }

  // 搜索相关文档
  async search(query: string, topK: number = 5): Promise<SearchResult[]> {
    if (!this.initialized) {
      throw new Error("系统未初始化");
    }

    if (this.chunks.length === 0) {
      throw new Error("没有文档可搜索");
    }

    console.log(`正在搜索: "${query}"`);

    const queryEmbedding = await this.generateEmbedding(query);
    const searchResults = this.vectorStore.searchKnn(queryEmbedding, topK);

    const results: SearchResult[] = searchResults.neighbors.map((index, i) => ({
      chunk: this.chunks[index],
      score: 1 - searchResults.distances[i],
    }));

    return results;
  }
}

// 主函数 - 一次性执行演示
async function main() {
  console.log("🚀 启动简易 RAG 系统演示");

  const ragSystem = new SimpleRAGSystem();

  try {
    // 初始化
    await ragSystem.initialize();

    // 示例文档数据
    const documents = [
      "人工智能（AI）是计算机科学的一个分支，它试图理解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。人工智能从诞生以来，理论和技术日益成熟，应用领域也不断扩大。",

      "机器学习是人工智能的一个重要分支，它是一种数据分析方法，能够自动化分析模型的构建过程。机器学习基于系统可以从数据中学习，识别模式并做出决策的想法。",

      "深度学习是机器学习的一个子领域，它基于人工神经网络，特别是深度神经网络。深度学习模型能够学习数据的多层次特征表示，在图像识别、语音识别等任务中取得突破性成果。",

      "自然语言处理（NLP）是人工智能和语言学的交叉领域，它研究如何让计算机理解和生成人类语言。NLP 的应用包括机器翻译、情感分析、问答系统等。",

      "计算机视觉是人工智能的一个重要分支，它使计算机能够从数字图像或视频中获取高层次的理解。计算机视觉技术被广泛应用于人脸识别、自动驾驶、医学图像分析等领域。",
    ];

    // 添加文档
    await ragSystem.addDocuments(documents, {
      chunkSize: 150,
      overlap: 20,
    });

    // 测试查询
    const testQueries = [
      "什么是人工智能？",
      "机器学习如何工作？",
      "深度学习的特点",
      "自然语言处理应用",
      "计算机视觉技术",
    ];

    // 执行搜索并显示结果
    for (const query of testQueries) {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`🔍 查询: "${query}"`);
      console.log(`${"=".repeat(60)}`);

      const results = await ragSystem.search(query, 3);

      results.forEach((result, index) => {
        console.log(`\n📄 结果 ${index + 1} (相似度: ${result.score.toFixed(4)})`);
        console.log(`ID: ${result.chunk.id}`);
        console.log(`内容: ${result.chunk.content}`);
        console.log(`-`.repeat(40));
      });
    }

    console.log("\n✅ RAG 系统演示完成！");
  } catch (error) {
    console.error("❌ 发生错误:", error);
  }
}

// 直接执行
main().catch(console.error);

export { SimpleRAGSystem };
