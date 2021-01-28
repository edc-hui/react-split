import React, {useEffect, useRef} from "react";
import classNames from "classnames";
import {PanelProps} from "./Panel";
import _ from 'lodash';
import "./Split.scss";

export interface SplitPanelProps {
    className?: string;
    style?: React.CSSProperties;
    mode?: 'horizontal' | 'vertical';
}

interface CoordinateProps {
    x: number,
    y: number
}

interface IDom1Props {
    width: number;
    height: number;
}

const SplitPanel: React.FC<SplitPanelProps> = props => {
    const {
        className,
        style,
        mode,
        children
    } = props;

    const resizesElement = useRef<HTMLElement>(null);
    const parentContainerDOM = useRef<HTMLDivElement>(null); // 定义父容器的DOM
    const mouseDownPosition = useRef<CoordinateProps>({
        x: 0,
        y: 0
    }); // 记录鼠标按下时的位置
    const mouseDownDom1 = useRef<IDom1Props>({
        width: 0,
        height: 0
    }); // 记录鼠标按下时DOM1元素的信息
    const resizesElementPosition = useRef<CoordinateProps>({
        x: 0,
        y: 0
    }); // 记录鼠标按下时分割元素的位置
    const domId1 = useRef<string>(_.uniqueId("dataV-SplitPanel-item_"));
    const domId2 = useRef<string>(_.uniqueId("dataV-SplitPanel-item_"));

    useEffect(() => {
        return () => {
        }
    }, [])

    /**
     * 鼠标按下事件，记录鼠标按下时的坐标以及此时分割线元素的坐标以及此时dom1元素的宽度或者高度
     */
    const onMouseDown = (e: React.MouseEvent) => {
        const resizesElementDOM = resizesElement.current as HTMLElement;
        const dom1 = document.getElementById(domId1.current) as HTMLDivElement;
        mouseDownPosition.current = {
            x: e.clientX,
            y: e.clientY
        };
        mouseDownDom1.current = {
            width: dom1.getBoundingClientRect().width,
            height: dom1.getBoundingClientRect().height
        }
        resizesElementPosition.current = {
            x: resizesElementDOM.getBoundingClientRect().x,
            y: resizesElementDOM.getBoundingClientRect().y
        }
        // @ts-ignore
        parentContainerDOM.current.addEventListener('mousemove', onMousemove);
        // @ts-ignore
        window.addEventListener('mouseup', onMouseUp);
    }

    const onMousemove = (e: React.MouseEvent) => {
        const dom1 = document.getElementById(domId1.current) as HTMLDivElement;
        const mouseMovePosition = {
            x: e.clientX,
            y: e.clientY
        };
        if (mode === 'horizontal') { // 水平分割只考虑水平方向移动的距离
            const moveDistance = mouseMovePosition.x - mouseDownPosition.current.x
            if (moveDistance < 0) { // 说明鼠标向左移动
                dom1.style.width = `${mouseDownDom1.current.width - Math.abs(moveDistance)}px`;
            }
            if (moveDistance > 0) { // 说明鼠标向右移动
                dom1.style.width = `${mouseDownDom1.current.width + Math.abs(moveDistance)}px`;
            }
        }
        if (mode === 'vertical') { // 垂直分割只考虑垂直方向移动的距离
            const moveDistance = mouseMovePosition.y - mouseDownPosition.current.y;
            if (moveDistance < 0) { // 说明鼠标向上移动
                dom1.style.height = `${mouseDownDom1.current.height - Math.abs(moveDistance)}px`;
            }
            if (moveDistance > 0) { // 说明鼠标向下移动
                dom1.style.height = `${mouseDownDom1.current.height + Math.abs(moveDistance)}px`;
            }
        }
    }

    const onMouseUp = (e: React.MouseEvent) => {
        // @ts-ignore
        parentContainerDOM.current.removeEventListener('mousemove', onMousemove);
        // @ts-ignore
        window.removeEventListener('mouseup', onMouseUp);
    }


    /**
     * 自定义渲染传入的子组件的逻辑
     */
    const renderChildren = (): React.ReactNode => {
        if (React.Children.count(children) === 2) {
            return React.Children.map(children, (child, index) => {
                const childElement = child as React.FunctionComponentElement<PanelProps>;
                const displayName = childElement.type.displayName;
                if (displayName === 'SplitPanelItem') {
                    if (mode === 'horizontal') {
                        if (index === 0) {
                            return <>
                                {React.cloneElement(childElement, {
                                    className: classNames('dataV-SplitPanel-left-item', childElement.props.className),
                                    id: domId1.current
                                })}
                                <span ref={resizesElement} onMouseDown={onMouseDown}
                                      className="dataV-SplitPanel-resizes"/>
                            </>
                        }
                        if (index === 1) {
                            return React.cloneElement(childElement, {
                                className: classNames('dataV-SplitPanel-right-item', childElement.props.className),
                                id: domId2.current
                            });
                        }
                    } else {
                        if (index === 0) {
                            return (
                                <>
                                    {
                                        React.cloneElement(childElement, {
                                            className: classNames('dataV-SplitPanel-top-item', childElement.props.className),
                                            id: domId1.current
                                        })
                                    }
                                    <span ref={resizesElement} onMouseDown={onMouseDown}
                                          className="dataV-SplitPanel-resizes"/>
                                </>
                            );
                        }
                        if (index === 1) {
                            return React.cloneElement(childElement, {
                                className: classNames('dataV-SplitPanel-bottom-item', childElement.props.className),
                                id: domId2.current
                            });
                        }
                    }
                } else {
                    console.error("Split组件的子元素请使用Panel组件，Panel组件从Split身上获取");
                }
            })
        } else {
            console.error("Split组件只能接受两个Panel组件，多一个或者少一个都不行。")
        }
    }

    const classes = classNames('dataV-SplitPanel', className, {
        'dataV-SplitPanel-horizontal': mode === 'horizontal',
        'dataV-SplitPanel-vertical': mode === 'vertical',
    });

    return (
        <div className={classes} style={style} ref={parentContainerDOM}>
            {renderChildren()}
        </div>
    )
}

SplitPanel.defaultProps = {
    mode: 'horizontal',
}

export default SplitPanel;
