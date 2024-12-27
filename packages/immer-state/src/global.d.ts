/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "ot-json0" {
  type Op = {
    p: string[] | number[];
    // adds x to the number at [path].
    na?: any;
    // inserts the object obj before the item at idx in the list at [path].
    li?: any;
    // deletes the object obj from the index idx in the list at [path].
    ld?: any;
    // replaces the object before at the index idx in the list at [path] with the object after.
    // ld:before,
    // li:after
    // moves the object at idx1 such that the object will be at index idx2 in the list at [path].
    lm?: any;
    // inserts the object obj into the object at [path] with key key.
    oi?: any;
    // deletes the object obj with key key from the object at [path].
    od?: any;
    // replaces the object before with the object after at key key in the object at [path].
    // od:before,
    // oi:after
    // applies the subtype op o of type t to the object at [path]
    t: any;
    o: any;
    // inserts the string s at offset offset into the string at [path] (uses subtypes internally).
    si?: any;
    // deletes the string s at offset offset from the string at [path] (uses subtypes internally).
    sd?: any;
  };

  const otJSON0: {
    type: {
      append: any;
      apply: (json: any, op: Op[]) => any;
      canOpAffectPath: any;
      checkList: any;
      checkObj: any;
      checkValidOp: any;
      commonLengthForOps: any;
      compose: (op1: Op[], op2: Op[]) => any[];
      create: any;
      incrementalApply: any;
      invert: any;
      invertComponent: any;
      name: string;
      normalize: (op: Op[]) => any[];
      pathMatches: any;
      registerSubtype: any;
      shatter: any;
      transform: (op: Op[], otherOp: Op[], side: "left" | "right") => Op[];
      transformComponent: any;
      transformX: any;
      uri: string;
    };
  };
  export = otJSON0;
}
