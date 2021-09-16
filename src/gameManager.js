import BattleshipDom from './battleshipDom';
import GameBoard from './gameBoard';
import Ship from './ship';
import {
  GameState,
  GameMessages,
  Direction,
  AttackStatus,
  PlayerShipNames,
} from './messages';

export default class GameManager {
  constructor() {
    this.squareClicked = this.squareClicked.bind(this);
    this.squareHover = this.squareHover.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.squareLeave = this.squareLeave.bind(this);
    this.rotateShip = this.rotateShip.bind(this);
    this.doCpuTurn = this.doCpuTurn.bind(this);
    this.setPlacementIndex = this.setPlacementIndex.bind(this);

    const playerDestroyer = new Ship(2);
    const playerSubmarine = new Ship(3);
    const playerCruiser = new Ship(3);
    const playerBattleship = new Ship(4);
    const playerCarrier = new Ship(5);

    this._playerShips = [
      playerDestroyer,
      playerSubmarine,
      playerCruiser,
      playerBattleship,
      playerCarrier,
    ];

    const domFleet = this._playerShips.map(GameManager.shipsToDomFleet);

    this._battleshipDom = new BattleshipDom(domFleet);
    this._battleshipDom.setClickEventHandler(this.squareClicked);
    this._battleshipDom.setMessageFunction(this.receiveMessage);
    this._battleshipDom.setHoverEventHandler(this.squareHover);
    this._battleshipDom.setMouseLeaveEventHandler(this.squareLeave);
    this._battleshipDom.setRightClickEventHandler(this.rotateShip);
    this._battleshipDom.setShipSelect(this.setPlacementIndex);

    this._testMode = false;
    this._playerWon = false;
  }

  static shipsToDomFleet(elmt, i) {
    return { length: elmt.length, name: PlayerShipNames[i] };
  }

  _init() {
    this.placementDirection = Direction.right;
    this.placementComplete = new Array(this._playerShips.length);
    for (let i = 0; i < this.placementComplete.length; i++) {
      this.placementComplete[i] = false;
    }

    for (let i = 0; i < this._playerShips.length; i++) {
      this._playerShips[i].reset();
    }

    this.setPlacementIndex(0);

    this._playerBoard = new GameBoard();
    this._cpuBoard = new GameBoard();

    this._battleshipDom.reset();
    this._battleshipDom.setPlayerBoard(this._playerBoard._boardState);
    this._battleshipDom.setCpuBoard(this._cpuBoard._boardState);
    this._battleshipDom.displayMessage('');

    this.updateDomShipProxy();

    this.gameState = GameState.placingShips;
  }

  set testMode(value) {
    this._testMode = value;
  }

  startGame() {
    if (this._testMode) {
      this.doTestSetup();
    } else {
      this.doSetup();
    }
  }

  doTestSetup() {
    const playerDestroyer = new Ship(2);
    const playerSubmarine = new Ship(3);
    const playerCruiser = new Ship(3);
    const playerBattleship = new Ship(4);
    const playerCarrier = new Ship(5);

    const cpuDestroyer = new Ship(2);
    const cpuSubmarine = new Ship(3);
    const cpuCruiser = new Ship(3);
    const cpuBattleship = new Ship(4);
    const cpuCarrier = new Ship(5);

    this._playerBoard.addShip(playerDestroyer, 0, 0, Direction.down);
    this._playerBoard.addShip(playerSubmarine, 0, 1, Direction.down);
    this._playerBoard.addShip(playerCruiser, 0, 2, Direction.down);
    this._playerBoard.addShip(playerBattleship, 0, 3, Direction.down);
    this._playerBoard.addShip(playerCarrier, 0, 4, Direction.down);

    this._cpuBoard.addShip(cpuDestroyer, 7, 0, Direction.up);
    this._cpuBoard.addShip(cpuSubmarine, 7, 1, Direction.up);
    this._cpuBoard.addShip(cpuCruiser, 7, 2, Direction.up);
    this._cpuBoard.addShip(cpuBattleship, 7, 3, Direction.up);
    this._cpuBoard.addShip(cpuCarrier, 7, 4, Direction.up);
  }

  doSetup() {
    const cpuDestroyer = new Ship(2);
    const cpuSubmarine = new Ship(3);
    const cpuCruiser = new Ship(3);
    const cpuBattleship = new Ship(4);
    const cpuCarrier = new Ship(5);

    GameManager._randomlyPlaceShips(
      [cpuDestroyer, cpuSubmarine, cpuCarrier, cpuCruiser, cpuBattleship],
      this._cpuBoard
    );

    this._battleshipDom.setPlayerBoard(this._playerBoard._boardState);
    this._battleshipDom.setCpuBoard(this._cpuBoard._boardState);
  }

  static _randomlyPlaceShips(ships, board) {
    // Pick a random spot and direction, attempt to add ship

    for (let i = 0; i < ships.length; i++) {
      let validPlacement = false;

      while (!validPlacement) {
        const row = Math.round(Math.random() * 7);
        const col = Math.round(Math.random() * 7);
        const dir = Math.round(Math.random() * 3);

        validPlacement = board.addShip(ships[i], row, col, dir);
      }
    }
  }

  isGameOver() {
    if (this._playerBoard.areAllShipsSunk()) {
      this._playerWon = false;
      return true;
    }
    if (this._cpuBoard.areAllShipsSunk()) {
      this._playerWon = true;
      return true;
    }
    return false;
  }

  squareClicked(e) {
    // The Player has clicked a square
    if (this.gameState === GameState.playerTurn) {
      if (e.target.dataset.board === 'cpu') {
        this.playerSelection({
          row: Number(e.target.dataset.row),
          col: Number(e.target.dataset.col),
        });
      }
    } else if (this.gameState === GameState.placingShips) {
      if (e.target.dataset.board === 'player') {
        if (
          this._playerBoard.isValidPlacement(
            this._playerShips[this.placeShipIndex],
            Number(e.target.dataset.row),
            Number(e.target.dataset.col),
            this.placementDirection
          )
        ) {
          // console.log('Place Ship');
          this._playerBoard.addShip(
            this._playerShips[this.placeShipIndex],
            Number(e.target.dataset.row),
            Number(e.target.dataset.col),
            this.placementDirection
          );

          this.placementComplete[this.placeShipIndex] = true;
          this._battleshipDom.removeFleetButton(this.placeShipIndex);

          let allTrue = true;
          for (let i = 0; i < this.placementComplete.length; i++) {
            if (this.placementComplete[i] === false) {
              this.placeShipIndex = i;
              allTrue = false;
              break;
            }
          }

          this._battleshipDom.setPlayerBoard(this._playerBoard._boardState);

          if (allTrue) {
            this.gameState = GameState.preGame;
          } else {
            this.updateAfterShipSelection();
          }
        }
      }
    }
  }

  updateAfterShipSelection() {
    const message = `Place your ${PlayerShipNames[this.placeShipIndex]}`;
    this._battleshipDom.displayMessage(message);
    this._battleshipDom.highlightFleetButton(this.placeShipIndex);
    this.updateDomShipProxy();
  }

  updateDomShipProxy() {
    this._battleshipDom.setRotationProxy(
      this._playerShips[this.placeShipIndex].length,
      this.placementDirection
    );
  }

  squareHover(e) {
    if (this.gameState === GameState.placingShips) {
      if (
        e.target.dataset.row !== this.cachedRow ||
        e.target.dataset.col !== this.cachedCol
      ) {
        this._battleshipDom.unhighlightSquares();
      }

      this.cachedRow = e.target.dataset.row;
      this.cachedCol = e.target.dataset.col;

      if (e.target.classList.contains('battleship-square')) {
        const row = Number(e.target.dataset.row);
        const col = Number(e.target.dataset.col);
        if (
          this._playerBoard.isValidPlacement(
            this._playerShips[this.placeShipIndex],
            row,
            col,
            this.placementDirection
          )
        ) {
          const squaresToHighlight = GameBoard.getCoordsToCheck(
            this._playerShips[this.placeShipIndex],
            row,
            col,
            this.placementDirection
          );

          this._battleshipDom.highlightSquares(squaresToHighlight, true);
        } else {
          const squaresToHighlight = GameBoard.getCoordsToCheck(
            this._playerShips[this.placeShipIndex],
            row,
            col,
            this.placementDirection
          );
          this._battleshipDom.highlightSquares(squaresToHighlight, false);
        }
      }
    }
  }

  squareLeave() {
    if (this.gameState === GameState.placingShips) {
      this._battleshipDom.unhighlightSquares();
    }
  }

  rotateShip(e) {
    if (e != null && e !== undefined) {
      e.preventDefault();
    }

    if (this.placementDirection !== Direction.up) {
      this.placementDirection += 1;
    } else {
      this.placementDirection = Direction.right;
    }

    if (e != null && e !== undefined) {
      this.squareLeave();
      this.squareHover(e);
    }

    this.updateDomShipProxy();
    return false;
  }

  playerSelection(selection) {
    const selectionStatus = this._cpuBoard.receiveAttack(
      selection.row,
      selection.col
    );

    if (selectionStatus !== AttackStatus.invalid) {
      // if it's a valid selection, send info to update the dom
      this.gameState = GameState.transition;
      this.sendPlayerMoveToDom(selection.row, selection.col, selectionStatus);

      if (this.isGameOver()) {
        this.doGameOver();
      } else {
        this.gameState = GameState.cpuTurn;
        setTimeout(this.doCpuTurn, 250);
      }
    }
  }

  sendPlayerMoveToDom(row, col, status) {
    this._battleshipDom.receivePlayerMove(row, col, status);
  }

  doCpuTurn() {
    let selectionStatus = AttackStatus.invalid;
    let row = -1;
    let col = -1;
    while (selectionStatus === AttackStatus.invalid) {
      row = Math.round(Math.random() * 7);
      col = Math.round(Math.random() * 7);

      selectionStatus = this._playerBoard.receiveAttack(row, col);
    }

    this.gameState = GameState.transition;
    this.sendCpuMoveToDom(row, col, selectionStatus);

    if (this.isGameOver()) {
      this.doGameOver();
    } else {
      this.gameState = GameState.playerTurn;
    }
  }

  sendCpuMoveToDom(row, col, status) {
    this._battleshipDom.receiveCpuMove(row, col, status);
  }

  doGameOver() {
    this.gameState = GameState.gameOver;
    let winLoss = '';
    if (this._playerWon) {
      winLoss = 'You Won!';
    } else {
      winLoss = 'You Lost...';
    }
    this._battleshipDom.displayMessage(`Game Over. ${winLoss}`);
  }

  receiveMessage(msg) {
    switch (msg) {
      case GameMessages.ResetGame: {
        this._handleResetMessage();
        break;
      }
      case GameMessages.ReDrawPlayerBoard: {
        this._battleshipDom.setPlayerBoard(this._playerBoard._boardState);
        break;
      }
      case GameMessages.RedrawCpuBoard: {
        this._battleshipDom.setCpuBoard(this._cpuBoard._boardState);
        break;
      }
      case GameMessages.StartGame: {
        this._battleshipDom.setupForGameplay();
        this._init();
        break;
      }
      case GameMessages.Rotate: {
        if (this.gameState === GameState.placingShips) {
          this.rotateShip();
          this.updateDomShipProxy();
        }
        break;
      }
      default:
        break;
    }
  }

  _handleResetMessage() {
    this.gameState = GameState.reset;
    this._init();
    this._battleshipDom.removeAllFleetButtons();
    this._battleshipDom.addFleetButtons();
    this.setPlacementIndex(0);
  }

  setPlacementIndex(newIndex) {
    if (this.placementComplete[newIndex] === false) {
      this.placeShipIndex = newIndex;
      this.updateAfterShipSelection();
    }
  }

  // This is for tests to be able to set gamestate and run properly
  set gameState(value) {
    // console.log('Setting GameState = ' + value);
    this._gameState = value;

    if (this.gameState === GameState.preGame) {
      this.gameState = GameState.gameplayStart;
      this.startGame();
      this._battleshipDom.displayMessage('Attack your opponent');
    }
    if (this.gameState === GameState.reset) {
      this._battleshipDom.makePlayerBoardRegular();
      this._battleshipDom.showPlacementOptions();
    } else if (this.gameState === GameState.gameplayStart) {
      this._battleshipDom.makePlayerBoardSmall();
      this._battleshipDom.hidePlacementOptions();
      this.gameState = GameState.playerTurn;
    } else if (this.gameState === GameState.placingShips) {
      const message = `Place your ${PlayerShipNames[this.placeShipIndex]}`;
      this._battleshipDom.displayMessage(message);
      // just show player board
      this._battleshipDom.hideCpuBoard();
    } else if (this.gameState === GameState.playerTurn) {
      // show both boards
      this._battleshipDom.showCpuBoard();
    } else if (this.gameState === GameState.transition) {
      this._battleshipDom.displayMessage('');
    }
  }

  get gameState() {
    return this._gameState;
  }
}
