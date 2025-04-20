import { cloneOps, Delta } from "@block-kit/delta";

export class DeltaComposer {
  /** 正在处理的 delta */
  public current: Delta | null;
  /** 归档的索引 */
  public archiveIndex: number;

  /**
   * 构造函数
   */
  public constructor() {
    this.current = null;
    this.archiveIndex = 0;
  }

  /**
   * 追加 delta
   * @returns 变更的差异
   */
  public compose(delta: Delta) {
    const copied = new Delta(cloneOps(delta.ops));
    if (!this.current) {
      this.current = copied;
      return delta;
    }
    // 这里也可以避免 diff, 直接构造删除原始内容再添加新内容即可
    // 由于本身会归档内容, 无论是比较差异还是删除/新增都不会太耗费性能
    const diff = this.current.diff(copied);
    this.current = copied;
    return diff;
  }

  /**
   * 归档部分内容
   * @returns archived 的 delta 长度
   */
  public archive() {
    if (this.current) {
      // 此处理论上只有 insert, 因此无需考虑 delete 的指针问题
      const len = this.current.length();
      this.archiveIndex = this.archiveIndex + len;
      this.current = null;
      return len;
    }
    return 0;
  }

  /**
   * 重置当前解析器
   */
  public reset() {
    this.current = null;
    this.archiveIndex = 0;
  }
}
