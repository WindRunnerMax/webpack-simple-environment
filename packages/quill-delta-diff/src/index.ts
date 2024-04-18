import "./styles.css";

import type Op from "quill-delta/dist/Op";

import { diffOps } from "./diff";

const ops1: Op[] = [
  {
    insert: "1234567890\n",
  },
];

const ops2: Op[] = [
  {
    attributes: {
      bold: "true",
    },
    insert: "45678",
  },
  {
    insert: "90123\n",
  },
];

const result = diffOps(ops1, ops2);
console.log(result);

// DELETE:-1 EQUAL:0 INSERT:1
// 1234567890 4567890123

// [[-1,"123"],[0,"4567890"],[1,"123"],[0,"\n"]]
// [
//   {
//     delete: 3 // del 123
//   },
//   {
//     retain: 5, // bold 45678
//     attributes: {
//       bold: "true"
//     }
//   },
//   {
//     retain: 2 // retain 90
//   },
//   {
//     insert: "123" // insert 123
//   }
// ];

document.getElementById("app")!.innerHTML = `查看控制台`;
