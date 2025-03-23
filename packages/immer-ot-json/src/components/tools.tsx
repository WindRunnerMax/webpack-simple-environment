import { Button, ColorPicker } from "@arco-design/web-react";
import { getUniqueId } from "laser-utils";
import type { FC } from "react";
import { Fragment, useEffect, useState } from "react";

import { useEditor } from "../hooks/use-editor";
import { useSelection } from "../hooks/use-selection";
import type { Node } from "../types/state";
import { getNode } from "../utils/path";

export const Tools: FC = () => {
  const editor = useEditor();
  const selection = useSelection();
  const [sel, setSel] = useState<string>("null");
  const [color, setColor] = useState<string>("#000");

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

  useEffect(() => {
    setSel(selection ? `[${String(selection)}]` : "null");
    if (selection) {
      const node = getNode(editor.state.data, selection);
      node && setColor(node.attrs.color);
    } else {
      setColor("#000");
    }
  }, [editor.state.data, selection]);

  const onDeleteNode = () => {
    if (!selection) return void 0;
    const node = getNode(editor.state.data, selection);
    editor.state.apply([{ p: selection, ld: node }]);
  };

  const onColorChange = (v: string) => {
    if (!selection) return void 0;
    const node = getNode(editor.state.data, selection);
    if (!node) return void 0;
    editor.state.apply([
      {
        p: [...selection, "attrs", "color"],
        od: node.attrs.color,
        oi: v,
      },
    ]);
  };

  return (
    <Fragment>
      <div>选区: {sel}</div>
      <Button style={{ marginTop: 10 }} long onClick={onAddNode}>
        添加节点
      </Button>
      <Button style={{ marginTop: 10 }} long disabled={!selection} onClick={onDeleteNode}>
        删除节点
      </Button>
      <ColorPicker
        disabled={!selection}
        style={{ marginTop: 10, width: "100%" }}
        value={color}
        showText
        onChange={onColorChange}
      />
    </Fragment>
  );
};
