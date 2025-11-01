import { Bind } from "@block-kit/utils";

const MEMORY_MAP: Record<string, number> = {};

export class TaskQueue {
  /** 实例/锁标识 */
  private readonly key: string;
  /** 并发运行数 */
  private readonly maxTasks: number;
  /** 本机正在运行任务数量 */
  private runningTasks: number;

  public constructor(
    /** 唯一标识 */
    key: string,
    /** 最大并行任务数 */
    maxTasks: number
  ) {
    this.key = key;
    this.runningTasks = 0;
    this.maxTasks = maxTasks;
  }

  /**
   * 尝试批量调度任务
   */
  @Bind
  public async tryRun() {
    const batch = this.maxTasks - this.runningTasks;
    for (let i = 0; i < batch; i++) {
      this.run();
    }
  }

  /**
   * 正式调度任务
   */
  @Bind
  public async run() {
    const assigned = await this.assign();
    if (!assigned) return void 0;
    let id: string | undefined = void 0;
    this.runningTasks++;
    try {
      id = await this.onRunning();
    } catch (error) {
      console.error("Task Queue Running Error:", error);
    }
    this.runningTasks--;
    await this.release();
    id && process.nextTick(this.tryRun);
  }

  /**
   * 调度运行任务
   * - 需要实例化后重写该方法
   * @returns 返回任务标识 id
   */
  public async onRunning(): Promise<string | undefined> {
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
    if (current >= this.maxTasks) {
      // console.log("Lock Limit", lockKey, "->", this.maxTasks);
      return false;
    }
    const serial = ++MEMORY_MAP[lockKey];
    console.log("Lock Assign", lockKey, "->", serial);
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
      console.log("Lock Zero", lockKey, "->", current);
      return true;
    }
    console.log("Lock Release", lockKey, "->", MEMORY_MAP[lockKey]);
    --MEMORY_MAP[lockKey];
    return true;
  }
}
