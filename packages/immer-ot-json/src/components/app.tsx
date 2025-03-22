import type { FC } from "react";
import { useEffect, useMemo } from "react";

import { Editor } from "../editor";
import { EditorContext } from "../hooks/use-editor";
import styles from "../styles/app.module.scss";
import { List } from "./list";
import { Tools } from "./tools";

export const App: FC = () => {
  const editor = useMemo(() => new Editor(), []);

  useEffect(() => {
    return () => {
      editor.destroy();
    };
  }, [editor]);

  return (
    <EditorContext.Provider value={editor}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Tools></Tools>
        </div>
        <div className={styles.right}>
          <List></List>
        </div>
      </div>
    </EditorContext.Provider>
  );
};
