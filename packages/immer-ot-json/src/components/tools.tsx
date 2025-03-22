import { Button } from "@arco-design/web-react";
import { getUniqueId } from "laser-utils";
import type { FC } from "react";
import { Fragment } from "react";

import { useEditor } from "../hooks/use-editor";
import type { Node } from "../types/state";

export const Tools: FC = () => {
  const editor = useEditor();

  const onAddNode = () => {
    const node: Node = {
      key: getUniqueId(),
      attrs: {},
    };
    const index = editor.state.data.length;
    editor.state.apply([{ p: [index], li: node }]);
  };

  return (
    <Fragment>
      <Button long onClick={onAddNode}>
        添加节点
      </Button>
    </Fragment>
  );
};
