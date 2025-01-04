import { cs, throttle, useMemoFn } from "laser-utils";
import type { FC } from "react";
import React, { useEffect, useMemo, useState } from "react";

import styles from "../styles/table.m.scss";

export const Table: FC = () => {
  const [scrollWidth, setScrollWidth] = useState(0);
  const tableRef = React.useRef<HTMLTableElement | null>(null);
  const headerWrapRef = React.useRef<HTMLDivElement | null>(null);
  const tableWrapRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const table = tableRef.current;
    const observer = new ResizeObserver(entries => {
      const [entry] = entries;
      if (!entry) return void 0;
      const scrollWidth = entry.target.scrollWidth;
      setScrollWidth(scrollWidth);
    });
    if (table) {
      const scrollWidth = table.scrollWidth;
      setScrollWidth(scrollWidth);
      observer.observe(table);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  const syncScroll = useMemoFn((left: number) => {
    const headerWrap = headerWrapRef.current;
    const tableWrap = tableWrapRef.current;
    const scroll = scrollRef.current;
    if (headerWrap && headerWrap.scrollLeft !== left) {
      headerWrap.scrollLeft = left;
    }
    if (tableWrap && tableWrap.scrollLeft !== left) {
      tableWrap.scrollLeft = left;
    }
    if (scroll && scroll.scrollLeft !== left) {
      scroll.scrollLeft = left;
    }
  });

  const onHeaderScroll = useMemo(() => {
    return throttle(() => {
      const headerWrap = headerWrapRef.current;
      headerWrap && syncScroll(headerWrap.scrollLeft);
    }, 7);
  }, [syncScroll]);

  const onTableScroll = useMemo(() => {
    return throttle(() => {
      const tableWrap = tableWrapRef.current;
      tableWrap && syncScroll(tableWrap.scrollLeft);
    }, 7);
  }, [syncScroll]);

  const onScrollBarScroll = useMemo(() => {
    return throttle(() => {
      const scroll = scrollRef.current;
      scroll && syncScroll(scroll.scrollLeft);
    }, 7);
  }, [syncScroll]);

  return (
    <div className={styles.container}>
      <div
        className={cs(styles.tableContainer, styles.tableHeaderContainer)}
        ref={headerWrapRef}
        onScroll={onHeaderScroll}
      >
        <table className={styles.table}>
          <colgroup>
            <col style={{ width: 300 }}></col>
            <col style={{ width: 300 }}></col>
            <col style={{ width: 300 }}></col>
            <col style={{ width: 300 }}></col>
            <col style={{ width: 300 }}></col>
          </colgroup>
          <thead>
            <tr>
              <th>Header 1</th>
              <th>Header 2</th>
              <th>Header 3</th>
              <th>Header 4</th>
              <th>Header 5</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className={styles.tableContainer} ref={tableWrapRef} onScroll={onTableScroll}>
        <table className={styles.table} ref={tableRef}>
          <colgroup>
            <col style={{ width: 300 }}></col>
            <col style={{ width: 300 }}></col>
            <col style={{ width: 300 }}></col>
            <col style={{ width: 300 }}></col>
            <col style={{ width: 300 }}></col>
          </colgroup>
          <tbody>
            <tr>
              <td>Row 1 Cell 1</td>
              <td>Row 1 Cell 2</td>
              <td>Row 1 Cell 3</td>
              <td>Row 1 Cell 4</td>
              <td>Row 1 Cell 5</td>
            </tr>
            <tr>
              <td>Row 2 Cell 1</td>
              <td>Row 2 Cell 2</td>
              <td>Row 2 Cell 3</td>
              <td>Row 2 Cell 4</td>
              <td>Row 2 Cell 5</td>
            </tr>
            <tr>
              <td>Row 3 Cell 1</td>
              <td>Row 3 Cell 2</td>
              <td>Row 3 Cell 3</td>
              <td>Row 3 Cell 4</td>
              <td>Row 3 Cell 5</td>
            </tr>
            <tr>
              <td>Row 4 Cell 1</td>
              <td>Row 4 Cell 2</td>
              <td>Row 4 Cell 3</td>
              <td>Row 4 Cell 4</td>
              <td>Row 4 Cell 5</td>
            </tr>
            <tr>
              <td>Row 5 Cell 1</td>
              <td>Row 5 Cell 2</td>
              <td>Row 5 Cell 3</td>
              <td>Row 5 Cell 4</td>
              <td>Row 5 Cell 5</td>
            </tr>
            <tr>
              <td>Row 6 Cell 1</td>
              <td>Row 6 Cell 2</td>
              <td>Row 6 Cell 3</td>
              <td>Row 6 Cell 4</td>
              <td>Row 6 Cell 5</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.scroll} ref={scrollRef} onScroll={onScrollBarScroll}>
        <div style={{ height: 1, width: scrollWidth }}></div>
      </div>
    </div>
  );
};
