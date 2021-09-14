import DomHelper from './domHelper';
import {
  GameMessages,
  BoardSpaceStatus,
  AttackStatus,
  BattleshipGridSize,
} from './messages';

export default class BattleshipDom {
  constructor() {
    this._sendMessage = null;
    this._resetButtonPressed = this._resetButtonPressed.bind(this);
    this.startGame = this.startGame.bind(this);

    this._body = document.querySelector('body');

    this.createElementsForGameplay();
    this.createElementsForWelcome();
  }

  createElementsForWelcome() {
    this._welcomeWrapper = DomHelper.createElement('div', 'welcome-wrapper');
    this._welcomeTitle = DomHelper.createElement(
      'h1',
      'welcome-wrapper__welcome-title'
    );
    this._welcomeMessage = DomHelper.createElement(
      'p',
      'welcome-wrapper__welcome-message'
    );
    this._welcomeButton = DomHelper.createElement(
      'button',
      'welcome-wrapper__welcome-button'
    );

    this._welcomeTitle.innerText = 'BATTLESHIP';
    this._welcomeMessage.innerText =
      "Welcome to the game of Battleship. Place the 5 ships of your fleet on your board. Be the first to sink all 5 of your opponent's ships to win!";
    this._welcomeButton.innerText = 'START';

    this._welcomeButton.addEventListener('click', this.startGame);

    this._welcomeWrapper.appendChild(this._welcomeTitle);
    this._welcomeWrapper.appendChild(this._welcomeMessage);
    this._welcomeWrapper.appendChild(this._welcomeButton);
    this._body.textContent = '';
    this._body.appendChild(this._welcomeWrapper);
  }

  createElementsForGameplay() {
    this._title = DomHelper.createElement('div', 'battleship-title');
    this._titleContent = DomHelper.createElement(
      'h1',
      'battleship-title__content'
    );
    this._titleContent.innerText = 'BATTLESHIP';
    this._title.appendChild(this._titleContent);

    this._playingField = DomHelper.createElement(
      'div',
      'battleship-playing-field'
    );

    this._playerField = DomHelper.createElement(
      'div',
      'battleship-player-field'
    );
    this._cpuField = DomHelper.createElement('div', 'battleship-player-field');

    this._playerTitle = DomHelper.createElement(
      'h2',
      'battleship-player-field__title'
    );
    this._cpuTitle = DomHelper.createElement(
      'h2',
      'battleship-player-field__title'
    );

    this._playerTitle.innerText = 'YOUR WATERS';
    this._cpuTitle.innerText = "OPPONENT'S WATERS";

    this._playerBoard = DomHelper.createElement(
      'div',
      'battleship-player-field__battleship-grid'
    );
    this._cpuBoard = DomHelper.createElement(
      'div',
      'battleship-player-field__battleship-grid'
    );

    this._playerMessage = DomHelper.createElement(
      'div',
      'battleship-player-field__message'
    );
    this._cpuMessage = DomHelper.createElement(
      'div',
      'battleship-player-field__message'
    );

    this._playerMessage.innerText = ' ';
    this._cpuMessage.innerText = ' ';

    this._tempMessages = DomHelper.createElement('div', 'temp-messages');
    this._tempMessages.innerText = '';

    this._playerField.appendChild(this._playerTitle);
    this._playerField.appendChild(this._playerBoard);
    this._playerField.appendChild(this._playerMessage);

    this._cpuField.appendChild(this._cpuTitle);
    this._cpuField.appendChild(this._cpuBoard);
    this._cpuField.appendChild(this._cpuMessage);

    this._resetButton = DomHelper.createElement('button', 'reset-button');
    this._resetButton.innerText = 'Reset';
    this._resetButton.addEventListener('click', this._resetButtonPressed);

    this._playingField.appendChild(this._cpuField);
    this._playingField.appendChild(this._playerField);
  }

  setupForGameplay() {
    this._body.textContent = '';
    this._body.appendChild(this._title);
    this._body.appendChild(this._tempMessages);
    this._body.appendChild(this._playingField);
    this._body.appendChild(this._resetButton);

    BattleshipDom.createBoard(this._playerBoard);
  }

  reset() {
    this._cpuMessage.innerText = '';
    this._playerMessage.innerText = '';
  }

  setPlayerBoard(boardState) {
    BattleshipDom.setBoard(this._playerBoard, boardState, 'player', false);
  }

  setCpuBoard(boardState) {
    BattleshipDom.setBoard(this._cpuBoard, boardState, 'cpu', false);
  }

  setClickEventHandler(callback) {
    this._clickCallback = callback;
    this._playerBoard.addEventListener('click', callback);
    this._cpuBoard.addEventListener('click', callback);
  }

  setHoverEventHandler(callback) {
    this._playerBoard.addEventListener('mouseover', callback);
  }

  setMouseLeaveEventHandler(callback) {
    this._playerBoard.addEventListener('mouseleave', callback);
  }

  setRightClickEventHandler(callback) {
    this._playerBoard.addEventListener('contextmenu', callback, false);
  }

  setMessageFunction(fn) {
    this._sendMessage = fn;
  }

  _resetButtonPressed() {
    this._sendMessage(GameMessages.ResetGame);
  }

  static createBoard(board) {
    for (let i = 0; i < BattleshipGridSize; i++) {
      for (let j = 0; j < BattleshipGridSize; j++) {
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
          case BoardSpaceStatus.shipSunk: {
            square.classList.add('battleship-square--ship-sunk');
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
    if (status === AttackStatus.sunk) {
      this._sendMessage(GameMessages.RedrawCpuBoard);
    }

    this.setCpuMessage(status);
  }

  receiveCpuMove(row, col, status) {
    BattleshipDom.receiveMove(row, col, status, this._playerBoard);
    if (status === AttackStatus.sunk) {
      this._sendMessage(GameMessages.RedrawCpuBoard);
    }
    this.setPlayerMessage(status);
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

        if (Number(status) === AttackStatus.hit) {
          squares[i].classList.add('battleship-square--ship-hit');
        } else if (Number(status) === AttackStatus.sunk) {
          squares[i].classList.add('battleship-square--ship-sunk');
        } else if (Number(status) === AttackStatus.miss) {
          squares[i].classList.add('battleship-square--empty-hit');
        }
        break;
      }
    }
  }

  setPlayerMessage(status) {
    this._playerMessage.textContent = '';
    this._playerMessage.classList.remove('message');
    // Hack to force reflow
    this._playerMessage.offsetHeight;
    this._playerMessage.classList.add('message');

    const m1 = 'Your opponent ';
    let m2 = '';
    let m3 = '';
    if (status === AttackStatus.hit) {
      m2 = "<span class='hit-message'>hit</span>";
      m3 = ' one of your ships';
    } else if (status === AttackStatus.sunk) {
      m2 = "<span class='sunk-message'>sunk</span>";
      m3 = ' one of your ships';
    } else if (status === AttackStatus.miss) {
      m2 = "<span class='missed-message'>missed!</span>";
      m3 = '';
    }

    this._playerMessage.innerHTML = `${m1}${m2}${m3}`;
  }

  setCpuMessage(status) {
    this._cpuMessage.textContent = '';
    this._cpuMessage.classList.remove('message');
    // Hack to force reflow
    this._cpuMessage.offsetHeight;
    this._cpuMessage.classList.add('message');

    const m1 = 'You ';
    let m2 = '';
    let m3 = '';
    if (status === AttackStatus.hit) {
      m2 = "<span class='hit-message'>hit</span>";
      m3 = ' an enemy ship!';
    } else if (status === AttackStatus.sunk) {
      m2 = "<span class='sunk-message'>sunk</span>";
      m3 = ' an enemy ship!!!';
    } else if (status === AttackStatus.miss) {
      m2 = "<span class='missed-message'>missed.</span>";
      m3 = '';
    }

    this._cpuMessage.innerHTML = `${m1}${m2}${m3}`;
  }

  displayMessage(value) {
    this._tempMessages.innerText = value;
  }

  highlightSquares(squaresToHighlight, valid) {
    if (squaresToHighlight !== undefined) {
      const squares = this._playerBoard.querySelectorAll('.battleship-square');
      for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squaresToHighlight.length; j++) {
          if (
            Number(squares[i].dataset.row) === squaresToHighlight[j].rowVar &&
            Number(squares[i].dataset.col) === squaresToHighlight[j].colVar
          ) {
            // highlight
            if (valid) {
              squares[i].classList.add('battleship-square--place-highlight');
            } else {
              squares[i].classList.add(
                'battleship-square--place-highlight-invalid'
              );
            }
          }
        }
      }
    }
  }

  unhighlightSquares() {
    const squares = this._playerBoard.querySelectorAll('.battleship-square');
    for (let i = 0; i < squares.length; i++) {
      squares[i].classList.remove('battleship-square--place-highlight');
      squares[i].classList.remove('battleship-square--place-highlight-invalid');
    }
  }

  hideCpuBoard() {
    this._cpuField.classList.add('hidden');
  }

  showCpuBoard() {
    this._cpuField.classList.remove('hidden');
  }

  startGame() {
    this._sendMessage(GameMessages.StartGame);
  }

  makePlayerBoardSmall() {
    this._playerBoard.classList.add(
      'battleship-player-field__battleship-grid--mini'
    );
  }
}
