import DomHelper from './domHelper';
import GameBoard from './gameBoard';

export default class BattleshipDom {
  constructor() {
    this._body = document.querySelector('body');

    this._playerBoard = DomHelper.createElement('div', 'battleship-grid');
    this._cpuBoard = DomHelper.createElement('div', 'battleship-grid');

    this._body.appendChild(this._playerBoard);
    this._body.appendChild(this._cpuBoard);

    BattleshipDom.createBoard(this._playerBoard);
  }

  setPlayerBoard(boardState) {
    BattleshipDom.setBoard(this._playerBoard, boardState, 'player');
  }

  setCpuBoard(boardState) {
    BattleshipDom.setBoard(this._cpuBoard, boardState, 'cpu');
  }

  setClickEventHandler(callback) {
    this._clickCallback = callback;
    this._playerBoard.addEventListener('click', callback);
    this._cpuBoard.addEventListener('click', callback);
  }

  static createBoard(board) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const square = DomHelper.createElement(
          'div',
          'battleship-square--empty'
        );
        board.appendChild(square);
      }
    }
  }

  static setBoard(board, boardState, player) {
    while (board.lastChild) {
      board.removeChild(board.firstChild);
    }

    for (let i = 0; i < boardState.length; i++) {
      for (let j = 0; j < boardState[i].length; j++) {
        const square = DomHelper.createElement('div');
        square.dataset.row = i;
        square.dataset.col = j;
        square.dataset.board = player;
        switch (boardState[i][j]) {
          case GameBoard.boardSpaceStatus.empty: {
            square.classList.add('battleship-square--empty');
            break;
          }
          case GameBoard.boardSpaceStatus.emptyHit: {
            square.classList.add('battleship-square--empty-hit');
            break;
          }
          case GameBoard.boardSpaceStatus.ship: {
            square.classList.add('battleship-square--ship');
            break;
          }
          case GameBoard.boardSpaceStatus.shipHit: {
            square.classList.add('battleship-square--ship-hit');
            break;
          }
          default:
            break;
        }
        board.appendChild(square);
      }
    }
  }
}
