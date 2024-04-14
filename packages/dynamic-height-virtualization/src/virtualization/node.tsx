import React from "react";

import { ELEMENT_TO_NODE } from "./bridge";

type NodeProps = {
  id: number;
  index: number;
  instances: Node[];
  content: JSX.Element;
  isFirstNode?: boolean;
  isLastNode?: boolean;
  initHeight: number;
  scroll: HTMLDivElement | Window;
  observer: IntersectionObserver;
};

type NodeState = {
  mode: "loading" | "placeholder" | "viewport";
  height: number;
};

export class Node extends React.PureComponent<NodeProps, NodeState> {
  private ref: React.RefObject<HTMLDivElement>;
  private observer: IntersectionObserver;
  private isActualMounted: boolean = false;

  constructor(props: NodeProps) {
    super(props);
    this.state = {
      mode: "loading",
      height: props.initHeight, // 高度未知 未实际渲染时占位
    };
    this.ref = React.createRef();
    this.observer = props.observer;
    this.props.instances[this.props.index] = this;
  }

  componentDidMount(): void {
    this.isActualMounted = true;
    const el = this.ref.current;
    if (!el) return void 0;
    ELEMENT_TO_NODE.set(el, this);
    this.observer.observe(el);
  }

  componentWillUnmount(): void {
    delete this.props.instances[this.props.index];
    this.isActualMounted = false;
    const el = this.ref.current;
    if (!el) return void 0;
    this.observer.unobserve(el);
  }

  public changeStatus = (mode: NodeState["mode"], height: number): void => {
    this.isActualMounted && this.setState({ mode, height: height || this.state.height });
  };

  public prevNode = (): Node | null => {
    return this.props.instances[this.props.index - 1] || null;
  };

  public nextNode = (): Node | null => {
    return this.props.instances[this.props.index + 1] || null;
  };

  componentDidUpdate(prevProps: Readonly<NodeProps>, prevState: Readonly<NodeState>): void {
    if (prevState.mode === "loading" && this.state.mode === "viewport" && this.ref.current) {
      const rect = this.ref.current.getBoundingClientRect();
      const SCROLL_TOP = 0;
      if (rect.height !== prevState.height && rect.top < SCROLL_TOP) {
        this.scrollDeltaY(rect.height - prevState.height);
      }
    }
  }

  private scrollDeltaY = (deltaY: number): void => {
    const scroll = this.props.scroll;
    if (scroll instanceof Window) {
      scroll.scrollTo({ top: scroll.scrollY + deltaY });
    } else {
      scroll.scrollTop = scroll.scrollTop + deltaY;
    }
  };

  render() {
    return (
      <div
        ref={this.ref}
        data-state={this.state.mode}
        data-first={this.props.isFirstNode || undefined}
        data-last={this.props.isLastNode || undefined}
      >
        {this.state.mode === "loading" && (
          <div style={{ height: this.state.height }}>loading...</div>
        )}
        {this.state.mode === "placeholder" && <div style={{ height: this.state.height }}></div>}
        {this.state.mode === "viewport" && this.props.content}
      </div>
    );
  }
}
