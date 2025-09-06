import fs from "node:fs";

const content = fs.readFileSync(__dirname + "/data.md").toString();

export const getReadableMarkdown = (baseRandom = 30) => {
  let start = 0;
  const options: UnderlyingDefaultSource<string> = {
    start(controller) {
      const interval = setInterval(() => {
        const slice = Math.floor(Math.random() * baseRandom) + 1;
        const end = start + slice;
        const fragment = content.slice(start, end).replace(/\n/g, "\\n");
        controller.enqueue(fragment);
        start = end;
        if (start >= content.length) {
          clearInterval(interval);
          controller.close();
        }
      }, 500);
    },
  };
  const readable = new ReadableStream<string>(options);
  return readable;
};
