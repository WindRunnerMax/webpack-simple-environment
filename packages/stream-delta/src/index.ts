import { Delta } from "@block-kit/delta";

import { getReadableMarkdown } from "./utils/stream";

const delta = new Delta().insertEOL();
const readable = getReadableMarkdown();
const reader = readable.getReader();

const reconcile = (text: string) => {};

const start = async () => {
  const { done, value } = await reader.read();
  if (done) return;
  reconcile(value);
  start();
};
start();
