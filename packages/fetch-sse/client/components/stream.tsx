import { Button, Space } from "@arco-design/web-react";
import { cs, useMemoFn, useStateRef } from "laser-utils";
import MarkdownIt from "markdown-it";
import type { FC } from "react";
import { Fragment, useEffect, useRef, useState } from "react";

import type { Message } from "../../server/utils/steam-parser";
import { StreamParser } from "../../server/utils/steam-parser";
import styles from "../styles/stream.m.scss";

export const Stream: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const [painting, setPainting] = useState(false);
  const currentIndex = useRef(0);
  const currentDOMIndex = useRef(0);
  const isAutoScroll = useRef(true);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [transmitting, setTransmitting, transmittingRef] = useStateRef(false);

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

  const onMessage = useMemoFn((e: Message) => {
    if (e.event !== "message") return null;
    setPainting(true);
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
      if (!transmittingRef.current && end >= len) {
        setPainting(false);
      }
    };
    setTimeout(process, delay);
  });

  const onError = () => {
    setPainting(false);
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
      if (!body) {
        setTransmitting(false);
        return null;
      }
      const reader = body.getReader();
      const parser = new StreamParser();
      parser.onMessage = onMessage;
      let result: ReadableStreamReadResult<Uint8Array> | null = null;
      while ((result = await reader.read())) {
        if (result.done) break;
        parser.onBinary(result.value);
      }
      setTransmitting(false);
    } catch (error) {
      onError();
    }
  };

  const onClose = () => {
    setPainting(false);
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
      <div className={cs(styles.textarea, painting && styles.painting)} ref={ref}></div>
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
