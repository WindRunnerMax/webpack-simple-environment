import React from "react";

import { DEFAULT_HEIGHT, ELEMENT_TO_NODE } from "./bridge";

type NodeProps = {
  id: number;
  index: number;
  instances: Node[];
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
