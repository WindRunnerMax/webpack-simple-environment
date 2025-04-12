import type { A, F } from "laser-utils/dist/es/types";
import type { fromMarkdown } from "mdast-util-from-markdown";

export type Root = F.Return<typeof fromMarkdown>;
export type RootContent = A.Tuple<Root["children"]>;
