import { useMemoFn } from "laser-utils/dist/es/hooks";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import { Editor } from "../editor";
import { EditorContext } from "../hooks/use-editor";
import { SelectionContext } from "../hooks/use-selection";
import styles from "../styles/app.module.scss";
import type { SelectionChangeEvent } from "../types/event";
import { EVENTS } from "../types/event";
import type { Range } from "../types/selection";
import { List } from "./list";
import { Tools } from "./tools";

export const App: FC = () => {
  const editor = useMemo(() => new Editor(), []);
  const [selection, setSelection] = useState<Range | null>(() => editor.selection.get());

  const onSelectionChange = useMemoFn((e: SelectionChangeEvent) => {
    const { current } = e;
    setSelection(current);
  });

  useEffect(() => {
    // @ts-expect-error window
    window.editor = editor;
    editor.event.on(EVENTS.SELECTION_CHANGE, onSelectionChange);
    return () => {
      editor.event.off(EVENTS.SELECTION_CHANGE, onSelectionChange);
      editor.destroy();
    };
  }, [editor, onSelectionChange]);

  return (
    <EditorContext.Provider value={editor}>
      <SelectionContext.Provider value={selection}>
        <div className={styles.container}>
          <div className={styles.left}>
            <Tools></Tools>
          </div>
          <div className={styles.right}>
            <List></List>
          </div>
        </div>
      </SelectionContext.Provider>
    </EditorContext.Provider>
  );
};
