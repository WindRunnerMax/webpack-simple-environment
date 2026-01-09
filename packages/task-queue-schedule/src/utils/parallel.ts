import { Bind } from "@block-kit/utils";

import type { ParallelContext } from "../types/parallel";

const MEMORY_MAP: Record<string, number> = {};

export class ParallelScheduler {
  /** 实例/锁标识 */
  private readonly key: string;
  /** 最大并发运行数 */
  private readonly max: number;
  /** 本机正在运行任务数量 */
  private running: number;

  public constructor(
    /** 唯一标识 */
    key: string,
    /** 最大并行任务数 */
    max: number
  ) {
    this.key = key;
    this.max = max;
    this.running = 0;
  }

  /**
   * 尝试批量调度任务
   */
  @Bind
  public async tryBatchRun(): Promise<void> {
    const batch = this.max - this.running;
    for (let i = 0; i < batch; i++) {
      this.run();
    }
  }

  /**
   * 正式调度任务
   */
  @Bind
  public async run(): Promise<void> {
    if (this.running >= this.max) return void 0;
    const assigned = await this.assign();
    if (!assigned) return void 0;
    const index = ++this.running;
    const context: ParallelContext = {
      index: index,
      tryNextTask: this.run,
    };
    let grantNextTask: boolean | undefined = false;
    try {
      grantNextTask = await this.onRunning(context);
    } catch (error) {
      console.error("Task Queue Running Error:", error);
    }
    this.running--;
    await this.release();
    grantNextTask && process.nextTick(this.run);
  }

  /**
   * 调度运行任务
   * - 需要实例化后重写该方法
   * @returns 返回 true 则触发下一个任务执行
   */
  public async onRunning(context: ParallelContext): Promise<boolean | undefined>;
  public async onRunning(): Promise<boolean | undefined> {
    return void 0;
  }

  /**
   * 分配 Quota
   */
  @Bind
  public async assign(): Promise<boolean> {
    const lockKey = "_lock_" + this.key;
    let current = MEMORY_MAP[lockKey];
    if (current === void 0) {
      current = MEMORY_MAP[lockKey] = 0;
    }
    if (current >= this.max) {
      // console.log("Lock Limit", lockKey, "->", this.maxTasks);
      return false;
    }
    const serial = ++MEMORY_MAP[lockKey];
    console.log("Lock Assign", lockKey, serial - 1, "->", serial);
    return true;
  }

  /**
   * 释放 Quota
   */
  @Bind
  public async release(): Promise<boolean> {
    const lockKey = "_lock_" + this.key;
    const current = MEMORY_MAP[lockKey];
    if (current === void 0) {
      MEMORY_MAP[lockKey] = 0;
      return true;
    }
    if (current <= 0) {
      MEMORY_MAP[lockKey] = 0;
      // console.log("Lock Zero", lockKey, "->", current);
      return true;
    }
    const serial = MEMORY_MAP[lockKey];
    console.log("Lock Release", lockKey, serial, "->", serial - 1);
    --MEMORY_MAP[lockKey];
    return true;
  }
}
