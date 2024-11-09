import { Button, Space } from "@arco-design/web-react";
import type { FC } from "react";
import { Fragment, useRef, useState } from "react";

import type { Message } from "../../server/utils/steam-parser";
import { StreamParser } from "../../server/utils/steam-parser";
import styles from "../styles/fetch.m.scss";

export const Fetch: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const ac = useRef<AbortController | null>(null);
  const [transmitting, setTransmitting] = useState(false);

  const prepend = (text: string) => {
    const el = ref.current;
    if (!el) return;
    const child = document.createElement("div");
    child.textContent = text;
    el.prepend(child);
  };

  const onMessage = (e: Message) => {
    prepend(e.event + ": " + e.data);
  };

  const onOpen = (res: Response) => {
    prepend("Connection Open: " + res.statusText);
  };

  const onError = () => {
    prepend("Connection Close");
    setTransmitting(false);
    ac.current?.abort();
  };

  const onStart = () => {
    setTransmitting(true);
    const signal = new AbortController();
    ac.current = signal;
    fetch("/proxy", { method: "POST", signal: signal.signal })
      .then(res => {
        onOpen(res);
        const body = res.body;
        if (!body) return null;
        const reader = body.getReader();
        const parser = new StreamParser();
        parser.onMessage = onMessage;
        const process = (res: ReadableStreamReadResult<Uint8Array>) => {
          if (res.done) return null;
          parser.onBinary(res.value);
          reader
            .read()
            .then(process)
            .catch(() => null);
        };
        reader.read().then(process);
      })
      .catch(() => {
        onError();
      });
  };

  const onClose = () => {
    setTransmitting(false);
    if (ac.current) {
      ac.current.abort();
      ac.current = null;
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
