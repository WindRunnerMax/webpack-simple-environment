import { cloneOps, Delta } from "@block-kit/delta";

export class DeltaComposer {
  /** 归档的索引 */
  public archivedIndex: number;
  /** 正在处理的 delta */
  public current: Delta | null;

  public constructor() {
    this.archivedIndex = 0;
    this.current = new Delta();
  }

  /**
   * 追加 delta
   * - 返回变更的差异
   */
  public compose(delta: Delta) {
    const copied = new Delta(cloneOps(delta.ops));
    if (!this.current) {
      this.current = copied;
      return delta;
    }
    const diff = this.current.diff(delta);
    this.current = copied;
    return diff;
  }

  /**
   * 归档部分内容
   * - 返回 archived 增量长度
   */
  public archive() {
    if (this.current) {
      const len = this.current.length();
      this.archivedIndex = this.archivedIndex + len;
      this.current = null;
      return len;
    }
    return 0;
  }
}
