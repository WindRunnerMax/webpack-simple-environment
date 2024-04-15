import { useThrottleFn } from "ahooks";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";

const LIST = Array.from({ length: 10000 }, (_, i) => i);

const App: React.FC<{ list: number[]; itemHeight: number }> = props => {
  const { list, itemHeight } = props;
  const [index, setIndex] = useState(0);
  const [len, setLen] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState<HTMLDivElement | null>(null);

  const totalHeight = useMemo(() => itemHeight * list.length, [itemHeight, list.length]);

  useEffect(() => {
    if (!scroll) return void 0;
    setLen(Math.ceil(scroll.clientHeight / itemHeight));
  }, [itemHeight, scroll]);

  const onScroll = useThrottleFn(
    () => {
      const containerElement = container.current;
      if (!scroll || !containerElement) return void 0;
      const scrollTop = scroll.scrollTop;
      const newIndex = Math.floor(scrollTop / itemHeight);
      containerElement.style.transform = `translateY(${newIndex * itemHeight}px)`;
      setIndex(newIndex);
    },
    { wait: 17 }
  );

  return (
    <div
      style={{ height: 500, border: "1px solid #aaa", overflow: "auto", overflowAnchor: "none" }}
      onScroll={onScroll.run}
      ref={setScroll}
    >
      {scroll && (
        <div style={{ height: totalHeight, position: "relative", overflow: "hidden" }}>
          <div ref={container} style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
            {list.slice(index, index + len).map(it => (
              <div key={it} style={{ height: itemHeight }}>
                {it}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App list={LIST} itemHeight={30} />, document.getElementById("root"));
