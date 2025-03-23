import { Button } from "@arco-design/web-react";
import { getUniqueId } from "laser-utils";
import { useMemoFn } from "laser-utils/dist/es/hooks";
import type { FC } from "react";
import { Fragment, useEffect, useState } from "react";

import { useEditor } from "../hooks/use-editor";
import type { SelectionChangeEvent } from "../types/event";
import { EVENTS } from "../types/event";
import type { Node } from "../types/state";

export const Tools: FC = () => {
  const editor = useEditor();
  const [selection, setSelection] = useState<string>("null");

  const onAddNode = () => {
    const letters = "0123456789ABCDEF";
    const color = Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]);
    const node: Node = {
      key: getUniqueId(),
      attrs: { color: "#" + color.join("") },
    };
    const index = editor.state.data.length;
    editor.state.apply([{ p: [index], li: node }]);
  };

  const onSelectionChange = useMemoFn((e: SelectionChangeEvent) => {
    const { current } = e;
    setSelection(current ? `[${String(current)}]` : "null");
  });

  useEffect(() => {
    editor.event.on(EVENTS.SELECTION_CHANGE, onSelectionChange);
    return () => {
      editor.event.off(EVENTS.SELECTION_CHANGE, onSelectionChange);
    };
  }, [editor.event, onSelectionChange]);

  return (
    <Fragment>
      <div>选区: {selection}</div>
      <Button long onClick={onAddNode}>
        添加节点
      </Button>
    </Fragment>
  );
};
