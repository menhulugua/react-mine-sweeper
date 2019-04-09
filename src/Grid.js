import React from 'react';

export default function Grid(props) {
  /*
  type value:
  1. unclicked
  2. marked as mine
  3. clicked empty
  4. clicked with number
  5. mine
  */
  const {type, index, mines, onClick, ...otherProps} = props;

  return (
    <div className={`type-${props.type} grid`} onClick={(e) => onClick(e, 1, index, type)} onContextMenu={(e) => onClick(e, 2, index, type)}>
      {type === 4 && <span>{mines}</span>}
    </div>
  );
}
