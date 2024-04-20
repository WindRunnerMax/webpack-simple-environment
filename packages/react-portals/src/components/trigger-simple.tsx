/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CSSProperties } from "react";
import type { ReactNode } from "react";
import React from "react";
import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import { CSSTransition } from "react-transition-group";

import Portal from "./protal";

export interface TriggerState {
  popupVisible: boolean;
  popupStyle: object;
}

export interface TriggerProps {
  duration: number;
  popup: () => ReactNode;
}

function getDOMPos(dom: HTMLElement) {
  if (!dom) {
    return {};
  }
  const { width, height, left, right, top, bottom } = dom.getBoundingClientRect();
  return {
    width,
    height,
    left,
    right,
    top,
    bottom,
  };
}

export class TriggerSimple extends PureComponent<TriggerProps, TriggerState> {
  unmount = false;
  isDidMount = false;
  delayTimer: NodeJS.Timeout | undefined;
  popupContainer = document.body;
  childrenDom: HTMLElement | null = null;
  childrenDomSize: ReturnType<typeof getDOMPos> = {};
  triggerRef: HTMLSpanElement | null = null;

  constructor(props: TriggerProps) {
    super(props);
    this.state = {
      popupVisible: false,
      popupStyle: {},
    };
  }

  componentDidMount() {
    this.isDidMount = true;
    this.unmount = false;
    this.childrenDom = this.getRootElement();
    if (this.state.popupVisible) {
      this.childrenDomSize = getDOMPos(this.childrenDom);
    }
  }

  componentDidUpdate() {
    const rect = getDOMPos(this.childrenDom!);
    this.childrenDomSize = rect;
  }

  appendToContainer = (node: HTMLDivElement) => {
    if (this.isDidMount) {
      const gpc = document.body;
      gpc.appendChild(node);
    }
  };

  getContainer = () => {
    const popupContainer = document.createElement("div");
    popupContainer.style.width = "100%";
    popupContainer.style.position = "absolute";
    popupContainer.style.top = "0";
    popupContainer.style.left = "0";
    this.popupContainer = popupContainer;
    this.appendToContainer(popupContainer);
    return popupContainer;
  };

  onMouseEnter = () => {
    console.log("onMouseEnter", this.childrenDom);
    const mouseEnterDelay = this.props.duration;
    this.clearDelayTimer();
    this.setPopupVisible(true, mouseEnterDelay || 0);
  };

  onMouseLeave = () => {
    console.log("onMouseLeave", this.childrenDom);
    const mouseLeaveDelay = this.props.duration;
    this.clearDelayTimer();

    if (this.state.popupVisible) {
      this.setPopupVisible(false, mouseLeaveDelay || 0);
    }
  };

  onPopupMouseEnter = () => {
    console.log("onPopupMouseEnter", this.childrenDom);
    this.clearDelayTimer();
  };

  onPopupMouseLeave = () => {
    console.log("onPopupMouseLeave", this.childrenDom);
    // this.onMouseLeave(e);
    const mouseLeaveDelay = this.props.duration;
    this.clearDelayTimer();

    if (this.state.popupVisible) {
      this.setPopupVisible(false, mouseLeaveDelay || 0);
    }
  };

  setPopupVisible = (visible: boolean, delay = 0, callback?: () => void) => {
    const currentVisible = this.state.popupVisible;

    if (visible !== currentVisible) {
      this.delayToDo(delay, () => {
        if (visible) {
          this.setState({ popupVisible: true }, () => {
            this.showPopup(callback);
          });
        } else {
          this.setState({ popupVisible: false }, () => {
            callback && callback();
          });
        }
      });
    } else {
      callback && callback();
    }
  };

  delayToDo = (delay: number, callback: () => void) => {
    if (delay) {
      this.clearDelayTimer();
      this.delayTimer = setTimeout(() => {
        callback();
        this.clearDelayTimer();
      }, delay);
    } else {
      callback();
    }
  };

  clearDelayTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = undefined;
    }
  }

  showPopup = (callback: () => void = () => {}) => {
    const parentRect = this.childrenDomSize;
    const popupStyle = {
      top: parentRect.top,
      left: parentRect.left! + parentRect.width! + 10,
    };
    this.setState({ popupStyle }, callback);
  };

  getRootElement = (): HTMLElement => {
    this.childrenDom = findDOMNode(this) as HTMLElement;
    return this.childrenDom;
  };

  getChild = () => {
    const { children } = this.props;
    let child = children;
    if (["string", "number"].indexOf(typeof children) > -1 || React.Children.count(children) > 1) {
      child = <span>{children}</span>;
    }
    return child || <span />;
  };

  render() {
    const { children, popup, duration } = this.props;
    const isExistChildren = children || children === 0;
    const { popupVisible, popupStyle } = this.state;

    if (!popup) {
      return null;
    }

    const mergeProps: any = {};
    const popupEventProps: any = {};

    mergeProps.onMouseEnter = this.onMouseEnter;
    mergeProps.onMouseLeave = this.onMouseLeave;
    popupEventProps.onMouseEnter = this.onPopupMouseEnter;
    popupEventProps.onMouseLeave = this.onPopupMouseLeave;

    const child: any = this.getChild();
    const popupChildren: any = React.Children.only(popup());

    if (child.props.className) {
      mergeProps.className = child.props.className;
    }

    const childrenComponent =
      isExistChildren &&
      React.cloneElement(child, {
        ...mergeProps,
      });

    const portalContent = (
      <CSSTransition
        in={!!popupVisible}
        timeout={duration}
        unmountOnExit={true}
        appear
        mountOnEnter
        onEnter={(e: any) => {
          e.style.display = "initial";
          e.style.pointerEvents = "none";
        }}
        onEntered={(e: any) => {
          e.style.pointerEvents = "auto";
          this.forceUpdate();
        }}
        onExit={e => {
          // 避免消失动画时对元素的快速点击触发意外的操作
          e.style.pointerEvents = "none";
        }}
        onExited={e => {
          e.style.display = "none";
          this.triggerRef = null;
          this.setState({ popupStyle: {} });
        }}
      >
        <span
          ref={node => (this.triggerRef = node)}
          style={
            {
              ...popupStyle,
              position: "absolute",
            } as CSSProperties
          }
          {...popupEventProps}
        >
          <popupChildren.type
            ref={popupChildren.ref}
            {...popupChildren.props}
            style={{ ...popupChildren.props.style }}
          />
        </span>
      </CSSTransition>
    );

    // 如果 triggerRef 不存在，说明弹出层内容被销毁，可以隐藏portal。
    const portal =
      popupVisible || this.triggerRef ? (
        <Portal getContainer={this.getContainer}>{portalContent}</Portal>
      ) : null;

    return isExistChildren ? (
      <React.Fragment>
        {childrenComponent}
        {portal}
      </React.Fragment>
    ) : (
      portal
    );
  }
}
