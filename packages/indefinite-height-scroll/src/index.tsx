import { useThrottleFn } from "ahooks";
import { useMemo, useRef, useState } from "react";
import React from "react";
import ReactDOM from "react-dom";

import { DEFAULT_HEIGHT } from "./constant";
import { Node } from "./node";

const LIST = Array.from({ length: 1000 }, (_, i) => {
  const height = Math.floor(Math.random() * 30) + 60;
  return {
    id: i,
    index: i,
    content: (
      <div style={{ height }}>
        {i}-高度:{height}
      </div>
    ),
  };
});

const App: React.FC<{ list: typeof LIST }> = props => {
  const { list } = props;
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(1);
  const [scroll, setScroll] = useState<HTMLDivElement | null>(null);

  const buffer = useRef(0);
  const heightTable = useMemo(() => {
    return Array.from({ length: list.length }, () => DEFAULT_HEIGHT);
  }, [list]);

  const getStartIndex = (top: number) => {
    const topStart = top - buffer.current;
    let count = 0;
    let index = 0;
    while (count < topStart) {
      count = count + heightTable[index];
      index++;
    }
    return index;
  };

  const getEndIndex = (clientHeight: number, startIndex: number) => {
    const topEnd = clientHeight + buffer.current;
    let count = 0;
    let index = startIndex;
    while (count < topEnd) {
      count = count + heightTable[index];
      index++;
    }
    return index;
  };

  const onScroll = useThrottleFn(
    () => {
      if (!scroll) return void 0;
      const scrollTop = scroll.scrollTop;
      const clientHeight = scroll.clientHeight;
      const startIndex = getStartIndex(scrollTop);
      const endIndex = getEndIndex(clientHeight, startIndex);
      setStart(startIndex);
      setEnd(endIndex);
    },
    { wait: 17 }
  );

  const onUpdateInformation = (el: HTMLDivElement) => {
    if (!el) return void 0;
    buffer.current = el.clientHeight / 2;
    setScroll(el);
    Promise.resolve().then(onScroll.run);
  };

  const startPlaceHolderHeight = useMemo(() => {
    return heightTable.slice(0, start).reduce((a, b) => a + b, 0);
  }, [heightTable, start]);

  const endPlaceHolderHeight = useMemo(() => {
    return heightTable.slice(end, heightTable.length).reduce((a, b) => a + b, 0);
  }, [end, heightTable]);

  return (
    <div
      style={{ height: 500, border: "1px solid #aaa", overflow: "auto", overflowAnchor: "none" }}
      onScroll={onScroll.run}
      ref={onUpdateInformation}
    >
      <div data-index={`0-${start}`} style={{ height: startPlaceHolderHeight }}></div>
      {scroll && (
        <React.Fragment>
          {list.slice(start, end).map(item => (
            <Node
              key={item.id}
              index={item.id}
              id={item.id}
              content={item.content}
              heightTable={heightTable}
            ></Node>
          ))}
        </React.Fragment>
      )}
      <div data-index={`${end}-${list.length}`} style={{ height: endPlaceHolderHeight }}></div>
    </div>
  );
};

ReactDOM.render(<App list={LIST} />, document.getElementById("root"));
