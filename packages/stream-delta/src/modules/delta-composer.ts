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
  public append(delta: Delta) {
    if (!this.current) {
      return delta;
    }
    const diff = this.current.diff(delta);
    this.current = new Delta(cloneOps(delta.ops));
    return diff;
  }

  /**
   * 归档部分内容
   */
  public archive() {
    if (this.current) {
      const len = this.current.length();
      this.archivedIndex = this.archivedIndex + len;
    }
    this.current = null;
  }
}
