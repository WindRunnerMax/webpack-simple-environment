import { useMemoizedFn } from "ahooks";
import type { FC } from "react";
import React, { useLayoutEffect, useMemo, useState } from "react";

import { BATCH, DEFAULT_HEIGHT, ELEMENT_TO_NODE, THRESHOLD } from "./bridge";
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

  const setSafeStart = useMemoizedFn((next: number | ((index: number) => number)) => {
    if (typeof next === "function") {
      setStart(v => {
        const index = next(v);
        return Math.min(Math.max(0, index), list.length);
      });
    } else {
      setStart(Math.min(Math.max(0, next), list.length));
    }
  });

  const setSafeEnd = useMemoizedFn((next: number | ((index: number) => number)) => {
    if (typeof next === "function") {
      setEnd(v => {
        const index = next(v);
        return Math.max(Math.min(list.length, index), 1);
      });
    } else {
      setEnd(Math.max(Math.min(list.length, next), 1));
    }
  });

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
          setSafeStart(index => index - increment);
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
          setSafeEnd(end => end + increment);
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
      if (isIntersecting) {
        // 进入视口
        if (node.props.isFirstNode) {
          setSafeStart(index => index - THRESHOLD);
        }
        if (node.props.isLastNode) {
          setSafeEnd(end => end + THRESHOLD);
        }
        node.changeStatus("viewport", rect.height);
      } else {
        // 脱离视口
        if (node.props.isFirstNode) {
          setSafeStart(index => index + 1);
        }
        if (node.props.isLastNode) {
          setSafeEnd(end => end - 1);
        }
        if (node.state.mode !== "loading") {
          node.changeStatus("placeholder", rect.height);
        }
      }
      const prev = node.prevNode();
      const next = node.nextNode();
      const isActualFirstNode = prev?.state.mode !== "viewport" && next?.state.mode === "viewport";
      const isActualLastNode = prev?.state.mode === "viewport" && next?.state.mode !== "viewport";
      if (isActualFirstNode) {
        setSafeStart(node.props.index - THRESHOLD);
      }
      if (isActualLastNode) {
        setSafeEnd(node.props.index + THRESHOLD);
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
      {scroll && observer && (
        <React.Fragment>
          {list.slice(start, Math.max(end, start + BATCH)).map((item, index, current) => (
            <Node
              scroll={scroll}
              instances={instances}
              key={item.id}
              index={item.id}
              id={item.id}
              content={item.content}
              observer={observer}
              isFirstNode={index === 0}
              initHeight={record[item.id]}
              isLastNode={index === current.length - 1}
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
