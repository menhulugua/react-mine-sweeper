import React, { Component } from 'react';
import Board from './Board'

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      row: 10,
      column: 10,
      grids: new Array(100).fill(1),
      mines: new Array(100).fill(0),
      cheat: false,
      minesMarked: 0,
      totalMines: 15
    };
  }

  /*
  type value:
  1. unclicked
  2. marked as mine
  3. clicked empty
  4. clicked with number
  5. mine
  */

  updateGrid = (leftRight, index, type) => {
    let grids = this.state.grids;
    let minesMarked = this.state.minesMarked;

    if (leftRight === 1) { // left
      if (type === 1) {
        let grids = this.expandGridNearby(this.state.grids, index);
        this.setState({grids: grids});
      }
    } else { // right
      if (type === 1 || type === 5) {
        grids[index] = 2;
        minesMarked++;
      }
      else if (type === 2) {
        if (this.state.cheat && this.state.mines[index] === -1)
          grids[index] = 5;
        else
          grids[index] = 1;
        minesMarked--;
      }
      this.setState({grids: grids, minesMarked: minesMarked});
    }

    setTimeout(() => {
      this.checkFinish(leftRight, index, type);
    }, 100);
  }

  checkFinish = (leftRight, index) => {
    if (leftRight === 1 && this.state.mines[index] === -1) {
        this.cheatToggle(true);
        setTimeout(() => {
          alert('You lost');
          this.restart();
          return true;
        }, 100);
    } else if (leftRight === 2 && this.allMinesMarked()) {
      alert('You win');
      this.restart();
      return true;
    }
    return false;
  }

  allMinesMarked = () => {
    let match = 0;
    let marked = 0;
    let grids = this.state.grids;
    let mines = this.state.mines;
    for (let i = 0; i < grids.length; i++) {
      if (grids[i] === 2)
        marked++;
      if (grids[i] === 2 && mines[i] === -1)
        match++;
    }
    return match === this.state.totalMines && match === marked;
  }

  expandGridNearby = (grids, index) => {
    if (grids[index] === 1) {
      if (this.state.mines[index] > 0)
        grids[index] = 4;
      else if (this.state.mines[index] === 0)
        grids[index] = 3;
      let gridsAround = this.getGridsAround(index);
      let total = this.state.row * this.state.column;
      if (this.state.mines[index] === 0) {
        for (let i = 0; i < gridsAround.length; i++) {
          if (gridsAround[i] >=0 && gridsAround[i] < total) {
            this.expandGridNearby(grids, gridsAround[i]);
          }
        }
      }
      return grids;
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
        if (grids[gridsAround[i]] === 5)
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
      } while (grids[position] === 5)
      grids[position] = 5;
      mines[position] = -1;
    }
    this.setState({grids: grids}, () => {
      for (let i = 0; i < mines.length; i++) {
        if (mines[i] === 0)
          mines[i] = this.calculateMineAround(i);
      }
      this.setState({mines: mines});

      for (let i = 0; i < grids.length; i++)
        if (grids[i] === 5)
          grids[i] = 1;
      this.setState({grids: grids});
    });
  }

  restart = () => {
    this.setState({
      row: 10,
      column: 10,
      grids: new Array(100).fill(1),
      mines: new Array(100).fill(0),
      cheat: false,
      minesMarked: 0,
      totalMines: 10
    }, () => {this.generateMines(this.state.totalMines);});
  }

  cheatToggle = (cheatState) => {
    let cheat = typeof cheatState === 'boolean'? cheatState : !this.state.cheat;
    this.setState({cheat: cheat}, () => {
      let grids = this.state.grids;
      for (let i = 0; i < grids.length; i++) {
        if (this.state.mines[i] === -1) {
          if (this.state.cheat && grids[i] !== 2)
            grids[i] = 5;
          else if (!this.state.cheat && grids[i] !== 2)
            grids[i] = 1;
        }
      }
      this.setState({grids: grids});
    });
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
