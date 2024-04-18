export type Range = {
  index: number;
  length: number;
};

export const initLayerDOM = () => {
  const commentRangeDOM = document.createElement("div");
  commentRangeDOM.className = "ql-range ignore-dom layer-comment";
  window.editor.container.appendChild(commentRangeDOM);
  return commentRangeDOM;
};

const buildLayerDOM = (dom: HTMLElement, ranges: Range[]) => {
  const editor = window.editor;
  dom.innerText = "";
  const color = "rgb(255, 125, 0, 0.3)";
  ranges.forEach((range) => {
    const startRect = editor.getBounds(range.index, 0);
    const endRect = editor.getBounds(range.index + range.length, 0);
    const block = document.createElement("div");
    block.style.position = "absolute";
    block.style.width = "100%";
    block.style.height = "0";
    block.style.top = startRect.top + "px";
    block.style.pointerEvents = "none";
    const head = document.createElement("div");
    const body = document.createElement("div");
    const tail = document.createElement("div");
    if (startRect.top === endRect.top) {
      head.style.marginLeft = startRect.left + "px";
      head.style.height = startRect.height + "px";
      head.style.width = endRect.right - startRect.left + "px";
      head.style.backgroundColor = color;
    } else if (endRect.top - startRect.bottom < startRect.height) {
      head.style.marginLeft = startRect.left + "px";
      head.style.height = startRect.height + "px";
      head.style.width = startRect.width - startRect.left + "px";
      head.style.backgroundColor = color;
      body.style.height = endRect.top - startRect.bottom + "px";
      tail.style.width = endRect.right + "px";
      tail.style.height = endRect.height + "px";
      tail.style.backgroundColor = color;
    } else {
      head.style.marginLeft = startRect.left + "px";
      head.style.height = startRect.height + "px";
      head.style.width = startRect.width - startRect.left + "px";
      head.style.backgroundColor = color;
      body.style.width = "100%";
      body.style.height = endRect.top - startRect.bottom + "px";
      body.style.backgroundColor = color;
      tail.style.marginLeft = "0";
      tail.style.height = endRect.height + "px";
      tail.style.width = endRect.right + "px";
      tail.style.backgroundColor = color;
    }
    block.appendChild(head);
    block.appendChild(body);
    block.appendChild(tail);
    dom.appendChild(block);
  });
};

export const renderLayer = (
  dom: HTMLDivElement,
  origin: Range[],
  ignoreLineMarker = true,
) => {
  const lines: { start: number; length: number }[] = [];
  let currentIndex = 0;
  // @ts-ignore
  window.editor.scroll.lines().forEach((line) => {
    const length = line.length();
    lines.push({ start: currentIndex, length });
    currentIndex = currentIndex + length;
  });
  const ranges = [];
  for (const item of origin) {
    const { index, length } = item;
    let traceLength = length;
    for (const line of lines) {
      if (length === 1 && index + length === line.start + line.length) {
        if (ignoreLineMarker) break;
        const payload = { index: line.start, length: line.length - 1 };
        !ignoreLineMarker && payload.length > 0 && ranges.push(payload);
        break;
      }
      if (
        index < line.start + line.length &&
        line.start <= index + traceLength
      ) {
        const nextIndex = Math.max(line.start, index);
        const nextLength = Math.min(
          traceLength,
          line.length - 1,
          line.start + line.length - nextIndex,
        );
        traceLength = traceLength - nextLength;
        const payload = { index: nextIndex, length: nextLength };
        if (nextIndex + nextLength === line.start + line.length) {
          payload.length--;
        }
        payload.length > 0 && ranges.push(payload);
      } else if (line.start > index + length || traceLength <= 0) {
        break;
      }
    }
  }
  buildLayerDOM(dom, ranges);
  return ranges;
};
