import React from "react";

import { DEFAULT_HEIGHT, ELEMENT_TO_NODE } from "./bridge";

type NodeProps = {
  id: number;
  index: number;
  content: JSX.Element;
  isFirstNode?: boolean;
  isLastNode?: boolean;
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
      height: DEFAULT_HEIGHT, // 高度未知 未实际渲染时占位
    };
    this.ref = React.createRef();
    this.observer = props.observer;
  }

  componentDidMount(): void {
    this.isActualMounted = true;
    const el = this.ref.current;
    if (!el) return void 0;
    ELEMENT_TO_NODE.set(el, this);
    this.observer.observe(el);
  }

  componentWillUnmount(): void {
    this.isActualMounted = false;
    const el = this.ref.current;
    if (!el) return void 0;
    ELEMENT_TO_NODE.delete(el);
    this.observer.unobserve(el);
  }

  public changeStatus = (mode: NodeState["mode"], height: number): void => {
    this.isActualMounted && this.setState({ mode, height: height || this.state.height });
  };

  render() {
    return (
      <div ref={this.ref} data-state={this.state.mode}>
        {this.state.mode === "loading" && (
          <div style={{ height: this.state.height }}>loading...</div>
        )}
        {this.state.mode === "placeholder" && <div style={{ height: this.state.height }}></div>}
        {this.state.mode === "viewport" && this.props.content}
      </div>
    );
  }
}
