import { useMemoFn } from "laser-utils/dist/es/hooks";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import { useEditor } from "../hooks/use-editor";
import { SelectedContext } from "../hooks/use-selected";
import { useSelection } from "../hooks/use-selection";
import styles from "../styles/list.module.scss";
import type { ContentChangeEvent } from "../types/event";
import { EVENTS } from "../types/event";
import { isEqual } from "../utils/is";
import { findPath } from "../utils/path";
import { NODE_TO_INDEX, NODE_TO_PARENT } from "../utils/weak-map";
import { NodeModel } from "./node";

export const List: FC = () => {
  const editor = useEditor();
  const selection = useSelection();
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
    const path = findPath(editor);
    for (let i = 0; i < nodes.length; ++i) {
      const p = path.concat(i);
      const n = nodes[i];
      const isSelected = selection && isEqual(selection, p);
      NODE_TO_INDEX.set(n, i);
      NODE_TO_PARENT.set(n, editor);
      children.push(
        <SelectedContext.Provider key={n.key} value={!!isSelected}>
          <NodeModel selected={!!isSelected} node={n}></NodeModel>
        </SelectedContext.Provider>
      );
    }
    return children;
  }, [editor, nodes, selection]);

  return <div className={styles.container}>{children}</div>;
};
