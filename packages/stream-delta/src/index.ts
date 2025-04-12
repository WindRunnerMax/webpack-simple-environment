import { Delta } from "@block-kit/delta";

import { DeltaComposer } from "./modules/delta-composer";
import { MdComposer } from "./modules/md-composer";
import { getReadableMarkdown } from "./utils/stream";

let delta = new Delta().insertEOL();
const readable = getReadableMarkdown();
const reader = readable.getReader();
const ds = new DeltaComposer();
const ms = new MdComposer(ds);

const reconcile = (text: string) => {
  const diff = ms.append(text);
  delta = delta.compose(diff);
  console.log(JSON.stringify(diff.ops));
};

const start = async () => {
  const { done, value } = await reader.read();
  if (done) return;
  reconcile(value.replace(/\\n/g, "\n"));
  start();
};
start();
