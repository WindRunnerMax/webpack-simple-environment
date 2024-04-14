import React from "react";

import { ELEMENT_TO_NODE } from "./bridge";

type NodeProps = {
  id: number;
  content: JSX.Element;
  observer: IntersectionObserver;
};

type NodeState = {
  mode: "loading" | "placeholder" | "viewport";
  height: number;
};

export class Node extends React.PureComponent<NodeProps, NodeState> {
  private ref: React.RefObject<HTMLDivElement>;
  private observer: IntersectionObserver;

  constructor(props: NodeProps) {
    super(props);
    this.state = {
      mode: "loading",
      height: 60, // 高度未知 未实际渲染时占位
    };
    this.ref = React.createRef();
    this.observer = props.observer;
  }

  componentDidMount(): void {
    const el = this.ref.current;
    if (!el) return void 0;
    ELEMENT_TO_NODE.set(el, this);
    this.observer.observe(el);
  }

  componentWillUnmount(): void {
    const el = this.ref.current;
    if (!el) return void 0;
    ELEMENT_TO_NODE.delete(el);
    this.observer.unobserve(el);
  }

  public changeStatus = (mode: NodeState["mode"], height: number): void => {
    this.setState({ mode, height: height || this.state.height });
  };

  render() {
    return (
      <div ref={this.ref}>
        {this.state.mode === "loading" && (
          <div style={{ height: this.state.height }}>loading...</div>
        )}
        {this.state.mode === "placeholder" && <div style={{ height: this.state.height }}></div>}
        {this.state.mode === "viewport" && this.props.content}
      </div>
    );
  }
}
