import { useMemoizedFn } from "ahooks";
import type { FC } from "react";
import React, { useLayoutEffect, useState } from "react";

import { ELEMENT_TO_NODE } from "./bridge";
import { Node } from "./node";

export const PlaceholderMode: FC<{
  list: { id: number; content: JSX.Element }[];
}> = props => {
  const [scroll, setScroll] = useState<HTMLDivElement | null>(null);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);

  const onIntersect = useMemoizedFn((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const node = ELEMENT_TO_NODE.get(entry.target);
      if (!node) {
        console.warn("Node Not Found", entry.target);
        return void 0;
      }
      const rect = entry.boundingClientRect;
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        // 进入视口
        node.changeStatus("viewport", rect.height);
      } else {
        // 脱离视口
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
      {observer && (
        <div>
          {props.list.map(item => (
            <Node key={item.id} id={item.id} content={item.content} observer={observer}></Node>
          ))}
        </div>
      )}
    </div>
  );
};
