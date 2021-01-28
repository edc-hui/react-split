import React, {CSSProperties} from "react";
import classNames from "classnames";

export interface PanelProps {
  className?: string;
  id?: string;
}

const Panel: React.FC<PanelProps> = ({className,id, children}) => {

  const classes = classNames('dataV-SplitPanel-item', className);
  return (
    <div className={classes} id={id}>
      {children}
    </div>
  )
}

Panel.displayName = 'SplitPanelItem';

export default Panel;
