import DomHelper from './domHelper';
import { GameMessages, BoardSpaceStatus, AttackStatus } from './messages';

export default class BattleshipDom {
  constructor() {
    this._startButtonPressed = this._startButtonPressed.bind(this);

    this._body = document.querySelector('body');

    this._tempMessages = DomHelper.createElement('div', 'temp-messages');
    this._tempMessages.innerText = 'Battleship';

    this._playerBoard = DomHelper.createElement('div', 'battleship-grid');
    this._cpuBoard = DomHelper.createElement('div', 'battleship-grid');

    this._startButton = DomHelper.createElement('button', 'start-button');
    this._startButton.innerText = 'Start';
    this._startButton.addEventListener('click', this._startButtonPressed);

    this._body.appendChild(this._tempMessages);
    this._body.appendChild(this._playerBoard);
    this._body.appendChild(this._cpuBoard);
    this._body.appendChild(this._startButton);

    BattleshipDom.createBoard(this._playerBoard);

    this._sendMessage = null;
  }

  setPlayerBoard(boardState) {
    BattleshipDom.setBoard(this._playerBoard, boardState, 'player', false);
  }

  setCpuBoard(boardState) {
    BattleshipDom.setBoard(this._cpuBoard, boardState, 'cpu', true);
  }

  setClickEventHandler(callback) {
    this._clickCallback = callback;
    this._playerBoard.addEventListener('click', callback);
    this._cpuBoard.addEventListener('click', callback);
  }

  setMessageFunction(fn) {
    this._sendMessage = fn;
  }

  _startButtonPressed() {
    this._sendMessage(GameMessages.StartGame);
  }

  static createBoard(board) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const square = DomHelper.createElement('div', [
          'battleship-square--empty',
          'battleship-square',
        ]);
        board.appendChild(square);
      }
    }
  }

  static setBoard(board, boardState, player, hidden) {
    while (board.lastChild) {
      board.removeChild(board.firstChild);
    }

    for (let i = 0; i < boardState.length; i++) {
      for (let j = 0; j < boardState[i].length; j++) {
        const square = DomHelper.createElement('div');
        square.dataset.row = i;
        square.dataset.col = j;
        square.dataset.board = player;
        square.classList.add('battleship-square');
        switch (boardState[i][j]) {
          case BoardSpaceStatus.empty: {
            square.classList.add('battleship-square--empty');
            break;
          }
          case BoardSpaceStatus.emptyHit: {
            square.classList.add('battleship-square--empty-hit');
            break;
          }
          case BoardSpaceStatus.ship: {
            if (!hidden) {
              square.classList.add('battleship-square--ship');
            } else {
              square.classList.add('battleship-square--empty');
            }
            break;
          }
          case BoardSpaceStatus.shipHit: {
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

  receivePlayerMove(row, col, status) {
    BattleshipDom.receiveMove(row, col, status, this._cpuBoard);

    let message = '';
    if (status === AttackStatus.hit) {
      message = "It's a hit!";
    } else if (status === AttackStatus.sunk) {
      message = 'You sunk a ship!';
    } else if (status === AttackStatus.sunk) {
      message = "It's a miss";
    }

    this._tempMessages.innerText = `Player attacks row ${row} column ${col}. ${message}`;
  }

  receiveCpuMove(row, col, status) {
    BattleshipDom.receiveMove(row, col, status, this._playerBoard);
  }

  static receiveMove(row, col, status, board) {
    const squares = board.querySelectorAll('.battleship-square');

    for (let i = 0; i < squares.length; i++) {
      if (
        Number(squares[i].dataset.row) === row &&
        Number(squares[i].dataset.col) === col
      ) {
        squares[i].className = '';
        squares[i].classList.add('battleship-square');

        if (
          Number(status) === AttackStatus.hit ||
          Number(status) === AttackStatus.sunk
        ) {
          squares[i].classList.add('battleship-square--ship-hit');
        }
        if (Number(status) === AttackStatus.miss) {
          squares[i].classList.add('battleship-square--empty-hit');
        }
        break;
      }
    }
  }

  receiveGameOver() {
    this._tempMessages.innerText = 'Game Over';
  }
}
