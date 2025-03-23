import { useMemoFn } from "laser-utils/dist/es/hooks";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import { useEditor } from "../hooks/use-editor";
import styles from "../styles/list.module.scss";
import type { ContentChangeEvent } from "../types/event";
import { EVENTS } from "../types/event";
import { NODE_TO_INDEX, NODE_TO_PARENT } from "../utils/weak-map";
import { NodeModel } from "./node";

export const List: FC = () => {
  const editor = useEditor();
  const [nodes, setNodes] = useState(() => editor.state.data);

  const onContentChange = useMemoFn((e: ContentChangeEvent) => {
    setNodes(e.current);
  });

  useEffect(() => {
    editor.event.on(EVENTS.CONTENT_CHANGE, onContentChange);
    return () => {
      editor.event.off(EVENTS.CONTENT_CHANGE, onContentChange);
    };
  }, [editor.event, onContentChange]);

  const children = useMemo(() => {
    const children: JSX.Element[] = [];
    for (let i = 0; i < nodes.length; ++i) {
      const n = nodes[i];
      NODE_TO_INDEX.set(n, i);
      NODE_TO_PARENT.set(n, editor);
      children.push(<NodeModel key={n.key} node={n}></NodeModel>);
    }
    return children;
  }, [editor, nodes]);

  return <div className={styles.container}>{children}</div>;
};
