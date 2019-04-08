import React, { Component } from 'react';
import Grid from './Grid';

class Board extends Component {
  handleClick = (event, type, index) => {
    event.preventDefault();
    if (!event.target.classList.contains('type-1')) {
      if (event.target.classList.contains('type-2')) {
        if (type === 2)
          this.props.updateGrid(0, index);
      } else
        this.props.updateGrid(type, index);
    }
  }

  render() {
    let grids = [];
    let row = this.props.row;
    let column = this.props.column;
    let index = 0;
    for (let i = 0; i < row; i++) {
      let columns = [];
      for (let j = 0; j < column; j++) {
        columns.push(<Grid onClick={this.handleClick} key={`row-${i}-col-${j}`} row={i} column={j} width={column} height={row} type={this.props.grids[index]} mines={this.props.mines[index]} cheat={this.props.cheat}/>);
        index++;
      }
      grids.push(<div className="boardRow" key={`row-${i}`}>{columns}</div>);
    }
    return (
      <div>
        {grids}
      </div>
    );
  }
}

export default Board;
