import { Button, Space } from "@arco-design/web-react";
import { useMemoFn } from "laser-utils";
import type { FC } from "react";
import { Fragment, useRef, useState } from "react";

import styles from "../styles/ping.m.scss";

export const Ping: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const es = useRef<EventSource | null>(null);
  const [transmitting, setTransmitting] = useState(false);

  const prepend = (text: string) => {
    const el = ref.current;
    if (!el) return;
    const child = document.createElement("div");
    child.textContent = text;
    el.prepend(child);
  };

  const onMessage = (e: MessageEvent<string>) => {
    prepend("Ping: " + e.data);
  };

  const onConnect = useMemoFn((e: MessageEvent<string>) => {
    prepend("Start Time: " + e.data);
  });

  const onOpen = () => {
    prepend("Connection Open ...");
  };

  const onError = () => {
    prepend("Connection Close");
    setTransmitting(false);
    es.current?.close();
  };

  const onStart = () => {
    setTransmitting(true);
    const source = new EventSource("/ping");
    source.onopen = onOpen;
    source.onerror = onError;
    source.addEventListener("connect", onConnect);
    source.onmessage = onMessage;
    es.current = source;
  };

  const onClose = () => {
    setTransmitting(false);
    if (es.current) {
      es.current.close();
      es.current.removeEventListener("connect", onConnect);
      es.current = null;
    }
  };

  return (
    <Fragment>
      <div className={styles.textarea} ref={ref}></div>
      <Space size="medium">
        <Button onClick={onStart} type="primary" disabled={transmitting}>
          启动
        </Button>
        <Button onClick={onClose} disabled={!transmitting}>
          关闭
        </Button>
      </Space>
    </Fragment>
  );
};
