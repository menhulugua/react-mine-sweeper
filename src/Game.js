import React, { Component } from 'react';
import Board from './Board'

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      row: 10,
      column: 10,
      grids: new Array(100).fill(0),
      mines: new Array(100).fill(0),
      cheat: false,
      minesMarked: 0,
      totalMines: 10
    };
  }

  updateGrid = (type, index) => {
    this.checkResult(type, index);
    let grids = this.state.grids;
    let minesMarked = this.state.minesMarked;
    if (this.state.mines[index] === 0 && type !== 2)
      this.expandGridNearby(index);
    if (type === 2) {
      minesMarked++;
    } else if (type === 0) {
      minesMarked--;
    }
    if (type === 0 && this.state.mines[index] === -1) {
      grids[index] = 3;
    } else {
      grids[index] = type;
    }
    this.setState({grids: grids, minesMarked: minesMarked});
  }

  checkResult = (type, index) => {
    if (type === 1 && this.state.grids[index] === 3) {
      this.setState({cheat: true}, () => {
        alert('You lost');
        this.restart();
      });
    } else if (type === 2 && this.allMinesMarked()) {
      alert('You win');
      this.restart();
    }
  }

  allMinesMarked = () => {
    let match = 0;
    let grids = this.state.grids;
    let mines = this.state.mines;
    for (let i = 0; i < grids; i++) {
      if (grids[i] === 2 && mines[i] === -1)
        match++;
    }
    return match === this.state.totalMines;
  }

  expandGridNearby = (index) => {
    let grids = this.state.grids;
    if (grids[index] > 0)
      return false;
    let gridsAround = this.getGridsAround(index);
    let total = this.state.row * this.state.column;
    for (let i = 0; i < gridsAround.length; i++) {
      if (gridsAround[i] >=0 && gridsAround[i] < total) {
        if (this.state.mines[gridsAround[i]] === 0 && grids[gridsAround[i]] === 0) {
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
      if (grids[i] === 3)
        mines[i] = -1;
    }
    this.setState({mines: mines});
  }

  restart = () => {
    this.setState({
      row: 10,
      column: 10,
      grids: new Array(100).fill(0),
      mines: new Array(100).fill(0),
      cheat: false,
      minesMarked: 0,
      totalMines: 10
    }, () => {this.generateMines(this.state.totalMines);});
  }

  cheatToggle = () => {
    this.setState({cheat: !this.state.cheat});
  }

  componentDidMount = () => {
    this.generateMines(this.state.totalMines);
  }

  render() {
    return (
      <div className="Game">
        <div className="buttons">
          <button onClick={this.restart}>Restart</button>
          <button onClick={this.cheatToggle}>{this.state.cheat? 'Hide Mines': 'Show Mines'}</button>
          <span>Mines marked: {this.state.minesMarked} / {this.state.totalMines}</span>
        </div>
        <Board
          row={this.state.row}
          column={this.state.column}
          grids={this.state.grids}
          mines={this.state.mines}
          cheat={this.state.cheat}
          updateGrid={this.updateGrid}
        />
      </div>
    );
  }
}

export default Game;
