import React, { Component } from 'react';
import Board from './Board'

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      row: 10,
      column: 10,
      grids: new Array(100).fill(0),
      mines: new Array(100).fill(0)
    };
  }

  updateGrid = (type, index) => {
    let grids = this.state.grids;
    if (this.state.mines[index] === 0)
      this.expandGridNearby(index);
    grids[index] = type;
    this.setState({grids: grids});
  }

  expandGridNearby = (index) => {
    let grids = this.state.grids;
    if (grids[index] > 0)
      return false;
    let gridsAround = this.getGridsAround(index); console.log(index, gridsAround);
    let total = this.state.row * this.state.column;
    for (let i = 0; i < gridsAround.length; i++) {
      if (gridsAround[i] >=0 && gridsAround[i] < total) {
        if (this.state.mines[gridsAround[i]] === 0) {
          this.expandGridNearby(gridsAround[i]);
        }
        grids[gridsAround[i]] = 1;
        grids[index] = 1;
        this.setState({grids: grids});
      }
    }
  }

  getGridsAround = (index) => {
    let column = this.state.column;
    let topLeft = index - column - 1;
    if (topLeft % 10 > index % 10)
      topLeft = -1;

    let top = index - column;

    let topRight = index - column + 1;
    if (topRight % 10 < index % 10)
      topRight = -1;

    let left = index - 1;
    if (left % 10 > index % 10)
      left = -1;

    let right = index + 1;
    if (right % 10 < index % 10)
      right = -1;


    let bottomLeft = index + column - 1;
    if (bottomLeft % 10 > index % 10)
      bottomLeft = -1;

    let bottom = index + column;

    let bottomRight = index + column + 1;
    if (bottomRight % 10 < index % 10)
      bottomRight = -1;

    let gridsAround = [topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight];

    let total = this.state.row * this.state.column;

    for (let i = 0; i < gridsAround.length; i++) {
      if (gridsAround[i] < 0 || gridsAround[i] > total - 1)
        gridsAround[i] = -1;
    }

    return gridsAround;
  }

  calculateMineAround = (index) => {
    let grids = this.state.grids;
    let column = this.state.column;
    let total = column * this.state.row;
    let count = 0;

    let gridsAround = this.getGridsAround(index);
    for (let i = 0; i < gridsAround.length; i++) {
      if (gridsAround[i] >=0 && gridsAround[i] < total) {
        if (grids[gridsAround[i]] === 3)
          count++;
      }
    }

    return count;
  }

  generateMines = (number) => {
    let mines = this.state.mines;
    let grids = this.state.grids;
    for (let i = 0; i < number; i++) {
      let position;
      do {
        position = Math.floor(Math.random() * this.state.row * this.state.column);
      } while (grids[position] === 3)
      grids[position] = 3;
    }
    this.setState({grids: grids});
    for (let i = 0; i < mines.length; i++) {
      mines[i] = this.calculateMineAround(i);
    }
    this.setState({mines: mines});
  }

  componentDidMount = () => {
    this.generateMines(10);
  }

  render() {
    return (
      <div className="Game">
        <Board
          row={this.state.row}
          column={this.state.column}
          grids={this.state.grids}
          mines={this.state.mines}
          updateGrid={this.updateGrid}
        />
      </div>
    );
  }
}

export default Game;
