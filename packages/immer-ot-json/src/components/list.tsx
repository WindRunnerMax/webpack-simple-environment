import { useMemoFn } from "laser-utils/dist/es/hooks";
import type { FC } from "react";
import { useEffect, useState } from "react";

import { useEditor } from "../hooks/use-editor";
import styles from "../styles/list.module.scss";
import type { ContentChangeEvent } from "../types/event";
import { EVENTS } from "../types/event";
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

  return (
    <div className={styles.container}>
      {nodes.map(n => {
        return <NodeModel key={n.key} node={n}></NodeModel>;
      })}
    </div>
  );
};
