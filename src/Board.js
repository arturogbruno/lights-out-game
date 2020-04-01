import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nRows: 5,
    nCols: 5,
    chanceLightStartsOn: 0.25
  }

  constructor(props) {
    super(props);

    this.state = {
      board: this.createBoard(),
      hasWon: false
    }
  }

  createBoard() {
    let board = [];
    for(let y = 0; y < this.props.nRows; y++) {
      let row = [];
      for(let x = 0; x < this.props.nCols; x++) {
        row.push(Math.random() < this.props.chanceLightStartsOn);
      }
      board.push(row);
    }
    return board;
  }

  flipCellsAround(coord) {
    let {nCols, nRows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      if (x >= 0 && x < nCols && y >= 0 && y < nRows) {
        board[y][x] = !board[y][x];
      }
    }

    flipCell(y, x);
    flipCell(y, x - 1);
    flipCell(y, x + 1);
    flipCell(y - 1, x);
    flipCell(y + 1, x);

    let hasWon = board.every(row => row.every(cell => !cell));

    this.setState({ board: board, hasWon: hasWon })
  }

  makeTable() {
    let tableBoard = [];
    for(let y = 0; y < this.props.nRows; y++) {
      let row = [];
      for(let x = 0; x < this.props.nCols; x++) {
        let coord = `${y}-${x}`
        row.push(<Cell key={coord} isLit={this.state.board[y][x]} flipCellsAroundMe={() => this.flipCellsAround(coord)} />)
      }
      tableBoard.push(<tr key={y}>{row}</tr>)
    }
    return (
      <table className='Board'>
        <tbody>{tableBoard}</tbody>
      </table>
    );
  }

  render() {
    return (
      <div>
        {this.state.hasWon ? (
          <div className='winner'>
            <span className='neon-orange'>YOU</span>
            <span className='neon-blue'>WIN!</span>
          </div>
        ) : (
          <div>
            <div className='Board-title'>
              <div className='neon-orange'>Lights</div>
              <div className='neon-blue'>Out</div>
            </div>
            {this.makeTable()}
          </div>
        )}
      </div>
    );
  }
}

export default Board;