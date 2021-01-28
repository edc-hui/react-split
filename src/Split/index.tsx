import React from "react";
import SplitPanel, {SplitPanelProps} from "./Split";
import Panel, {PanelProps} from "./Panel";

// 定义组件的类型 ----  将父组件和子组件两者合在一起组成一个新的组件
export type SplitPanelComponent = React.FC<SplitPanelProps> & {
    Panel: React.FC<PanelProps>
}

const Split = SplitPanel as SplitPanelComponent;
Split.Panel = Panel;

export default Split;
