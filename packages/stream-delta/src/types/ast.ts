import type { A, F } from "laser-utils/dist/es/types";
import type { fromMarkdown } from "mdast-util-from-markdown";

// const tree = fromMarkdown(this.content, {
//   mdastExtensions: [gfmFromMarkdown()],
// });

// const position = block.position!;
// const offset = position.end.offset!;
// this.content = this.content.slice(offset + 1);

export type Root = F.Return<typeof fromMarkdown>;
export type RootContent = A.Tuple<Root["children"]>;
