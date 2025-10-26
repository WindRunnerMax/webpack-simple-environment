const MEMORY_MAP: Record<string, number> = {};

export class TaskQueue {
  /** 实例/锁标识 */
  private readonly key: string;
  /** 并发运行数 */
  private readonly maxTasks: number;
  /** 本机正在运行任务数量 */
  private runningTasks: number;
  /** 调度运行任务 */
  private onRunning: () => Promise<void>;

  public constructor(options: { key: string; maxTasks: number; onRunning: () => Promise<void> }) {
    this.runningTasks = 0;
    this.key = options.key;
    this.maxTasks = options.maxTasks;
    this.onRunning = options.onRunning;
  }

  /**
   * 尝试批量调度任务
   */
  public async tryRun() {
    const batch = this.maxTasks - this.runningTasks;
    for (let i = 0; i < batch; i++) {
      this.run();
    }
  }

  /**
   * 正式调度任务
   */
  public async run() {
    const assigned = await this.assign();
    if (!assigned) return void 0;
    this.runningTasks++;
    try {
      // findAndModify + taskProcessing + updateTaskStatus
      await this.onRunning();
    } catch (error) {
      console.error("Task Queue Running Error:", error);
    }
    this.runningTasks--;
    await this.release();
    process.nextTick(this.tryRun);
  }

  /**
   * 分配 Quota
   */
  public async assign(): Promise<boolean> {
    const lockKey = "_lock_" + this.key;
    let current = MEMORY_MAP[lockKey];
    if (current === void 0) {
      current = MEMORY_MAP[lockKey] = 0;
    }
    if (current >= this.maxTasks) {
      console.log("Lock Limit", lockKey, "=>", this.maxTasks);
      return false;
    }
    const serial = ++MEMORY_MAP[lockKey];
    console.log("Lock Assign", lockKey, "=>", serial);
    return true;
  }

  /**
   * 释放 Quota
   */
  public async release(): Promise<boolean> {
    const lockKey = "_lock_" + this.key;
    const current = MEMORY_MAP[lockKey];
    if (current === void 0) {
      MEMORY_MAP[lockKey] = 0;
      return true;
    }
    if (current <= 0) {
      MEMORY_MAP[lockKey] = 0;
      console.log("Lock Zero", lockKey, "=>", current);
      return true;
    }
    const serial = --MEMORY_MAP[lockKey];
    console.log("Lock Release", lockKey, "=>", serial);
    return true;
  }
}
