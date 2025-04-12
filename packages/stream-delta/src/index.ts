import { Delta } from "@block-kit/delta";

import { MdComposer } from "./modules/md-composer";
import { getReadableMarkdown } from "./utils/stream";

const delta = new Delta().insertEOL();
const readable = getReadableMarkdown();
const reader = readable.getReader();
const md = new MdComposer();

const reconcile = (text: string) => {
  md.append(text);
  delta.insert(text);
};

const start = async () => {
  const { done, value } = await reader.read();
  if (done) return;
  reconcile(value.replace(/\\n/g, "\n"));
  start();
};
start();
