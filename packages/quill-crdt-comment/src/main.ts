import "./index.css";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { QuillBinding } from "y-quill";
import Quill from "quill";
import { initLayerDOM, Range, renderLayer } from "./layer";

const ydoc = new Y.Doc();
new IndexeddbPersistence("y-indexeddb", ydoc);

const dom = document.getElementById("editor")!;
const toolbar = document.getElementById("toolbar")!;
const editor = new Quill(dom, {
  modules: {
    toolbar: toolbar,
  },
  placeholder: "Enter Text...",
  theme: "snow",
});
window.editor = editor;
toolbar.style.display = "block";
const ytext = ydoc.getText("quill");
new QuillBinding(ytext, editor);

const COMMENT_LIST: [string, string][] = [];
const layerDOM = initLayerDOM();
const renderAllCommentWithRelativePosition = () => {
  const ranges: Range[] = [];
  for (const item of COMMENT_LIST) {
    const start = JSON.parse(item[0]);
    const end = JSON.parse(item[1]);
    const stratPosition = Y.createAbsolutePositionFromRelativePosition(
      start,
      ydoc,
    );
    const endPosition = Y.createAbsolutePositionFromRelativePosition(end, ydoc);
    if (stratPosition && endPosition) {
      ranges.push({
        index: stratPosition.index,
        length: endPosition.index - stratPosition.index,
      });
    }
  }
  renderLayer(layerDOM, ranges);
};
const applyComment = document.querySelector(".apply-comment") as HTMLDivElement;
applyComment.onmousedown = (e) => {
  e.stopPropagation();
  e.preventDefault();
};
applyComment.onclick = () => {
  const selection = editor.getSelection();
  if (selection) {
    const sel = { ...selection };
    console.log("添加评论:", sel);
    const start = Y.createRelativePositionFromTypeIndex(ytext, sel.index);
    const end = Y.createRelativePositionFromTypeIndex(
      ytext,
      sel.index + sel.length,
    );
    COMMENT_LIST.push([JSON.stringify(start), JSON.stringify(end)]);
    renderAllCommentWithRelativePosition();
    editor.setSelection(sel.index + sel.length);
  }
};

editor.on("text-change", () => {
  renderAllCommentWithRelativePosition();
});
