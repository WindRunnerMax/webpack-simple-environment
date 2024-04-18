import Op from "quill-delta/dist/Op";

export class Iterator {
  ops: Op[];
  index: number;
  offset: number;

  constructor(ops: Op[]) {
    this.ops = ops;
    this.index = 0;
    this.offset = 0;
  }

  hasNext(): boolean {
    return this.peekLength() < Infinity;
  }

  next(length?: number): Op {
    if (!length) {
      length = Infinity;
    }
    const nextOp = this.ops[this.index];
    if (nextOp) {
      const offset = this.offset;
      const opLength = Op.length(nextOp);
      if (length >= opLength - offset) {
        // 处理剩余所有的`insert
        length = opLength - offset;
        this.index += 1;
        this.offset = 0;
      } else {
        // 处理`length`长度的`insert`
        this.offset += length;
      }
      const retOp: Op = {};
      if (nextOp.attributes) {
        retOp.attributes = nextOp.attributes;
      }
      retOp.insert = (nextOp.insert as string).substr(offset, length);
      return retOp;
    } else {
      return { insert: "" };
    }
  }

  peek(): Op {
    return this.ops[this.index];
  }

  peekLength(): number {
    if (this.ops[this.index]) {
      // Should never return 0 if our index is being managed correctly
      return Op.length(this.ops[this.index]) - this.offset;
    } else {
      return Infinity;
    }
  }
}
