import { Button, Space } from "@arco-design/web-react";
import MarkdownIt from "markdown-it";
import type { FC } from "react";
import { Fragment, useEffect, useRef, useState } from "react";

import type { Message } from "../../server/utils/steam-parser";
import { StreamParser } from "../../server/utils/steam-parser";
import styles from "../styles/ping.m.scss";

export const Stream: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const [transmitting, setTransmitting] = useState(false);
  const currentIndex = useRef(0);
  const currentDOMIndex = useRef(0);
  const isAutoScroll = useRef(true);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const append = (text: string) => {
    const el = ref.current;
    if (!el) return null;
    const mdIt = MarkdownIt();
    const textHTML = mdIt.render(text);
    const dom = new DOMParser().parseFromString(textHTML, "text/html");
    const current = currentDOMIndex.current;
    const children = Array.from(el.children);
    for (let i = current; i < children.length; i++) {
      children[i] && children[i].remove();
    }
    const next = dom.body.children;
    for (let i = current; i < next.length; i++) {
      next[i] && el.appendChild(next[i].cloneNode(true));
    }
    currentDOMIndex.current = next.length - 1;
    isAutoScroll.current && el.scrollTo({ top: el.scrollHeight });
  };

  const onMessage = (e: Message) => {
    if (e.event !== "message") return null;
    const data = e.data;
    const text = data.replace(/\\n/g, "\n");
    const start = currentIndex.current;
    const len = text.length;
    const delay = len - start > 50 ? 10 : 50;
    const process = () => {
      currentIndex.current++;
      const end = currentIndex.current;
      append(text.slice(0, end));
      if (end < len) {
        timer.current = setTimeout(process, delay);
      }
    };
    setTimeout(process, delay);
  };

  const onError = () => {
    setTransmitting(false);
    controller.current?.abort();
    timer.current && clearTimeout(timer.current);
  };

  const onStart = async () => {
    setTransmitting(true);
    const signal = new AbortController();
    controller.current = signal;
    currentIndex.current = 0;
    ref.current && (ref.current.innerHTML = "");
    try {
      const res = await fetch("/proxy", { method: "POST", signal: signal.signal });
      const body = res.body;
      if (!body) return null;
      const reader = body.getReader();
      const parser = new StreamParser();
      parser.onMessage = onMessage;
      let result: ReadableStreamReadResult<Uint8Array> | null = null;
      while ((result = await reader.read())) {
        if (result.done) return null;
        parser.onBinary(result.value);
      }
    } catch (error) {
      onError();
    }
  };

  const onClose = () => {
    setTransmitting(false);
    if (controller.current) {
      controller.current.abort();
      controller.current = null;
    }
    timer.current && clearTimeout(timer.current);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.onscroll = () => {
      if (el.scrollHeight - el.scrollTop - el.clientHeight <= 1) {
        isAutoScroll.current = true;
      } else {
        isAutoScroll.current = false;
      }
    };
    return () => {
      el.onscroll = null;
    };
  }, []);

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
