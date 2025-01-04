import { cs } from "laser-utils";
import type { FC } from "react";
import React, { useEffect, useState } from "react";

import styles from "../styles/anchor.m.scss";

export const Anchor: FC = () => {
  const [len, setLen] = useState(0);

  useEffect(() => {
    const doc = document.querySelector("[data-doc]");
    if (doc) {
      const children = doc.children;
      setLen(children.length);
    }
  }, []);

  const onClick = (index: number) => {
    const doc = document.querySelector("[data-doc]");
    if (doc) {
      const children = doc.children;
      const target = children[index];
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={cs(styles.container)}>
      {Array.from({ length: len }).map((_, index) => (
        <div key={index} onClick={() => onClick(index)}>
          <div>block-{index}</div>
        </div>
      ))}
    </div>
  );
};
