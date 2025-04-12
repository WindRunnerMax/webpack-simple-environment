import type { MarkedToken } from "marked";

import type { MdComposer } from "../modules/md-composer";

export const DEFAULT_OPTIONS: TokenParserOptions = {
  depth: 0,
  parent: null,
  index: 0,
};

export type TokenParserOptions = {
  /**
   * 递归深度
   */
  depth: number;
  /**
   * 节点索引
   * - 所属父节点的第 i 个元素
   */
  index: number;
  /**
   * 父节点
   */
  parent: MarkedToken | null;
  /**
   * 列表深度
   * - 依赖 list_item 层级
   */
  listLevel?: number;
  /**
   * Markdown 调度器
   * - 通常仅表格、代码块等节点需要传递
   */
  mc?: MdComposer;
};
