import React from "react";

import type { Editor } from "../editor";

export const EditorContext = React.createContext<Editor | null>(null);

export const useEditor = (): Editor => {
  const editor = React.useContext(EditorContext);

  if (!editor) {
    throw new Error("Editor Not Found");
  }

  return editor;
};
