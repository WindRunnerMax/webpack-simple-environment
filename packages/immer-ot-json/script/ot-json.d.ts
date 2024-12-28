/* eslint-disable @typescript-eslint/no-explicit-any */

// https://github.com/ottypes/docs
// https://github.com/ottypes/json0
// https://github.com/ottypes/json0/blob/master/lib/json0.js
declare module "ot-json0" {
  export type Path = Array<string | number>;

  export type Snapshot =
    | null
    | boolean
    | number
    | string
    | Array<Snapshot>
    | { [key: string]: Snapshot };

  export type Op = {
    p: Path;
    /** - adds x to the number at [path]. */
    na?: Snapshot;
    /** - inserts the object obj before the item at idx in the list at [path]. */
    li?: Snapshot;
    /** - deletes the object obj from the index idx in the list at [path]. */
    ld?: Snapshot;
    /** - replaces the object before at the index idx in the list at [path] with the object after. */
    ld?: Snapshot;
    li?: Snapshot;
    /** - moves the object at idx1 such that the object will be at index idx2 in the list at [path]. */
    lm?: Snapshot;
    /** - inserts the object obj into the object at [path] with key key. */
    oi?: Snapshot;
    /** - deletes the object obj with key key from the object at [path]. */
    od?: Snapshot;
    /** - replaces the object before with the object after at key key in the object at [path]. */
    od?: Snapshot;
    oi?: Snapshot;
    /** - applies the subtype op o of type t to the object at [path] */
    t?: Snapshot;
    o?: Snapshot;
    /** - inserts the string s at offset offset into the string at [path] (uses subtypes internally). */
    si?: Snapshot;
    /** - deletes the string s at offset offset from the string at [path] (uses subtypes internally). */
    sd?: Snapshot;
  };

  const otJSON0: {
    type: {
      uri: string;
      name: string;
      invert: (op: Op[]) => Op[];
      apply: (json: Snapshot, op: Op[]) => Snapshot;
      compose: (op1: Op[], op2: Op[]) => Op[];
      /** Transforms op with specified type ('left' or 'right') by otherOp. */
      transform: (op: Op[], otherOp: Op[], side: "left" | "right") => Op[];
      append: (dest: any[], op: Op) => void;
      canOpAffectPath: (op: Op, path: Path) => boolean;
      checkList: (list: any[]) => void;
      checkObj: (obj: any) => void;
      checkValidOp: (op: Op) => void;
      /** Returns the common length of the paths of ops a and b */
      commonLengthForOps: (a: Op, b: Op) => number;
      /** Clones the passed object using JSON serialization (which is slow). */
      create: <T>(json: T) => T;
      /**
       * Helper for incrementally applying an operation to a snapshot. Calls yield
       * after each op component has been applied.
       */
      incrementalApply: (snapshot: Snapshot, op: Op[], yield: (snapshot: any) => void) => void;
      invertComponent: (op: Op) => Op;
      normalize: (op: Op[]) => Op[];
      /** Checks if two paths, p1 and p2 match. */
      pathMatches: (p1: Path, p2: Path, ignoreLast: boolean) => boolean;
      /**
       * You can register another OT type as a subtype in a JSON document using
       * the following function. This allows another type to handle certain
       * operations instead of the builtin JSON type.
       */
      registerSubtype: (subtype: any) => void;
      /** Helper to break an operation up into a bunch of small ops. */
      shatter: (ops: Op[]) => [op: Op][];
      /** transform c so it applies to a document with otherC applied. */
      transformComponent: (dest: Op[], c: Op, otherC: Op, type: "left" | "string") => Op[];
      transformX: (leftOp: Op, rightOp: Op) => [leftOp: Op, newRightOp: Op];
    };
  };

  export = otJSON0;
}
