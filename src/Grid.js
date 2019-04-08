import React from 'react';

export default function Grid(props) {
  const {onClick, row, column, width, height, mineCount, type, mines, cheat, ...otherProps} = props;
  let index = width * row + column;
  return (
    <div className={`type-${props.type} grid`} onClick={(e) => onClick(e, 1, index)} onContextMenu={(e) => onClick(e, 2, index)}>
      {mines > 0? <span>{mines}</span> : <span></span>}
    </div>
  );
}
