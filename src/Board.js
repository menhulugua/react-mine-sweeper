import React, { Component } from 'react';
import Grid from './Grid';

class Board extends Component {
  handleClick = (event, leftRight, index, type) => {
    event.preventDefault();
    this.props.updateGrid(leftRight, index, type);
  }

  render() {
    let grids = [];
    let row = this.props.row;
    let column = this.props.column;
    let index = 0;
    for (let i = 0; i < row; i++) {
      let columns = [];
      for (let j = 0; j < column; j++) {
        columns.push(<Grid onClick={this.handleClick} key={`row-${i}-col-${j}`} index={index} type={this.props.grids[index]} mines={this.props.mines[index]} />);
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
