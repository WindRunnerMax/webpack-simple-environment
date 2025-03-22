import { useUpdateEffect } from "laser-utils/dist/es/hooks";
import type { FC } from "react";
import React from "react";

import styles from "../styles/node.module.scss";
import type { Node } from "../types/state";
import { Key } from "../utils/key";

const NodeView: FC<{
  node: Node;
}> = props => {
  const id = Key.getId(props.node);

  useUpdateEffect(() => {
    console.log("Update Render", id);
  });

  return <div className={styles.node}>{id}</div>;
};

export const NodeModel = React.memo(NodeView);
