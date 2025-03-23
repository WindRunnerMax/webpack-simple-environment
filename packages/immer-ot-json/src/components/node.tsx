import { useUpdateEffect } from "laser-utils/dist/es/hooks";
import type { FC } from "react";
import React from "react";

import { useEditor } from "../hooks/use-editor";
import styles from "../styles/node.module.scss";
import type { Node } from "../types/state";
import { Key } from "../utils/key";
import { findPath } from "../utils/path";

const NodeView: FC<{
  node: Node;
}> = props => {
  const { node } = props;
  const attrs = node.attrs;
  const id = Key.getId(node);
  const editor = useEditor();

  useUpdateEffect(() => {
    console.log("Update Render", id);
  });

  const onMouseDown = () => {
    const path = findPath(node);
    editor.selection.set(path);
  };

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        borderColor: attrs.color,
        color: attrs.color,
      }}
      className={styles.node}
    >
      {id}
    </div>
  );
};

export const NodeModel = React.memo(NodeView);
