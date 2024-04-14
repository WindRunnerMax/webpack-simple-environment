import React from "react";

type NodeProps = {
  id: number;
  index: number;
  content: JSX.Element;
  heightTable: number[];
};

export class Node extends React.PureComponent<NodeProps> {
  private ref: React.RefObject<HTMLDivElement>;

  constructor(props: NodeProps) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount(): void {
    const el = this.ref.current;
    if (!el) return void 0;
    const rect = el.getBoundingClientRect();
    this.props.heightTable[this.props.index] = rect.height;
  }

  render() {
    return (
      <div ref={this.ref} data-index={this.props.index}>
        {this.props.content}
      </div>
    );
  }
}
