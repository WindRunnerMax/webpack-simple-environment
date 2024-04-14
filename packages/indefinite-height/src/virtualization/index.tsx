import { useMemoizedFn } from "ahooks";
import type { FC } from "react";
import React, { useLayoutEffect, useMemo, useState } from "react";

import { BATCH, DEFAULT_HEIGHT, ELEMENT_TO_NODE } from "./bridge";
import { Node } from "./node";

export const VirtualizationMode: FC<{
  list: { id: number; content: JSX.Element }[];
}> = props => {
  const { list } = props;
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(BATCH);
  const startPlaceHolder = React.useRef<HTMLDivElement>(null);
  const endPlaceHolder = React.useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState<HTMLDivElement | null>(null);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  const instances: Node[] = useMemo(() => [], []);
  const record = useMemo(() => {
    return Array.from({ length: list.length }, () => DEFAULT_HEIGHT);
  }, [list]);

  const onIntersect = useMemoizedFn((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const isIntersecting = entry.isIntersecting || entry.intersectionRatio > 0;
      if (entry.target === startPlaceHolder.current) {
        // 起始占位符进入视口
        if (isIntersecting && entry.target.clientHeight > 0) {
          const delta = entry.intersectionRect.height || 1;
          let index = start - 1;
          let count = 0;
          let increment = 0;
          while (index >= 0 && count < delta) {
            count = count + record[index];
            increment++;
            index--;
          }
          setStart(index => Math.max(0, index - increment));
        }
        return void 0;
      }
      if (entry.target === endPlaceHolder.current) {
        // 结束占位符进入视口
        if (isIntersecting && entry.target.clientHeight > 0) {
          const delta = entry.intersectionRect.height || 1;
          let index = end;
          let count = 0;
          let increment = 0;
          while (index < list.length && count < delta) {
            count = count + record[index];
            increment++;
            index++;
          }
          setEnd(end => Math.min(list.length, end + increment));
        }
        return void 0;
      }
      const node = ELEMENT_TO_NODE.get(entry.target);
      if (!node) {
        console.warn("Node Not Found", entry.target);
        return void 0;
      }
      const rect = entry.boundingClientRect;
      record[node.props.index] = rect.height;
      const prev = node.prevNode();
      const next = node.nextNode();
      const isActualFirstNode = prev?.state.mode !== "viewport" && next?.state.mode === "viewport";
      const isActualLastNode = prev?.state.mode === "viewport" && next?.state.mode !== "viewport";
      if (isActualFirstNode) {
        setStart(node.props.index);
      }
      if (isActualLastNode) {
        setEnd(node.props.index + 1);
      }
      if (isIntersecting) {
        // 进入视口
        if (node.props.isFirstNode) {
          setStart(index => Math.max(0, index - 1));
        }
        if (node.props.isLastNode) {
          setEnd(end => Math.min(props.list.length, end + 1));
        }
        node.changeStatus("viewport", rect.height);
      } else {
        // 脱离视口
        if (node.props.isFirstNode) {
          setStart(index => Math.min(props.list.length, index + 1));
        }
        if (node.props.isLastNode) {
          setEnd(end => Math.max(1, end - 1));
        }
        if (node.state.mode !== "loading") {
          node.changeStatus("placeholder", rect.height);
        }
      }
    });
  });

  useLayoutEffect(() => {
    if (!scroll) return void 0;
    // 视口阈值 取滚动容器高度的一半
    const margin = scroll.clientHeight / 2;
    const current = new IntersectionObserver(onIntersect, {
      root: scroll,
      rootMargin: `${margin}px 0px`,
    });
    startPlaceHolder.current && current.observe(startPlaceHolder.current);
    endPlaceHolder.current && current.observe(endPlaceHolder.current);
    setObserver(current);
    return () => {
      current.disconnect();
    };
  }, [onIntersect, scroll]);

  return (
    <div
      ref={setScroll}
      style={{ height: 500, border: "1px solid #aaa", overflow: "auto", overflowAnchor: "none" }}
    >
      <div
        ref={startPlaceHolder}
        style={{ height: record.slice(0, start).reduce((a, b) => a + b, 0) }}
      ></div>
      {observer && (
        <React.Fragment>
          {list.slice(start, Math.max(end, start + BATCH)).map((item, index) => (
            <Node
              instances={instances}
              key={item.id}
              index={item.id}
              id={item.id}
              content={item.content}
              observer={observer}
              isFirstNode={index === 0}
              isLastNode={index === end - start - 1}
            ></Node>
          ))}
        </React.Fragment>
      )}
      <div
        ref={endPlaceHolder}
        style={{ height: record.slice(end, record.length).reduce((a, b) => a + b, 0) }}
      ></div>
    </div>
  );
};
