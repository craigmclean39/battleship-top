import BattleshipDom from './battleshipDom';
import GameBoard from './gameBoard';
import Ship from './ship';
import { GameState, GameMessages, Direction, AttackStatus } from './messages';

export default class GameManager {
  constructor() {
    this._gameState = GameState.placingShips;
    this.squareClicked = this.squareClicked.bind(this);
    this.squareHover = this.squareHover.bind(this);
    this.receiveMessage = this.receiveMessage.bind(this);
    this.squareLeave = this.squareLeave.bind(this);
    this.rotateShip = this.rotateShip.bind(this);

    this._battleshipDom = new BattleshipDom();
    this._battleshipDom.setClickEventHandler(this.squareClicked);
    this._battleshipDom.setMessageFunction(this.receiveMessage);
    this._battleshipDom.setHoverEventHandler(this.squareHover);
    this._battleshipDom.setMouseLeaveEventHandler(this.squareLeave);
    this._battleshipDom.setRightClickEventHandler(this.rotateShip);

    this._testMode = false;

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

    this.placeShipIndex = 0;
    this.placementDirection = Direction.right;

    this._init();
  }

  _init() {
    this._playerBoard = new GameBoard();
    this._cpuBoard = new GameBoard();
    this._battleshipDom.setPlayerBoard(this._playerBoard._boardState);
    this._battleshipDom.setCpuBoard(this._cpuBoard._boardState);
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

    /* GameManager._randomlyPlaceShips(
      [
        playerDestroyer,
        playerSubmarine,
        playerCruiser,
        playerBattleship,
        playerCarrier,
      ],
      this._playerBoard
    ); */

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
      return true;
    }
    if (this._cpuBoard.areAllShipsSunk()) {
      return true;
    }
    return false;
  }

  squareClicked(e) {
    // The Player has clicked a square
    if (this._gameState === GameState.playerTurn) {
      if (e.target.dataset.board === 'cpu') {
        this.playerSelection({
          row: Number(e.target.dataset.row),
          col: Number(e.target.dataset.col),
        });
      }
    } else if (this._gameState === GameState.placingShips) {
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
          this.placeShipIndex += 1;
          this._battleshipDom.setPlayerBoard(this._playerBoard._boardState);

          if (this.placeShipIndex >= this._playerShips.length) {
            this.gameState = GameState.preGame;
          }
        }
      }
    }
  }

  squareHover(e) {
    if (this._gameState === GameState.placingShips) {
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
    if (this._gameState === GameState.placingShips) {
      this._battleshipDom.unhighlightSquares();
    }
  }

  rotateShip(e) {
    e.preventDefault();

    if (this.placementDirection !== Direction.up) {
      this.placementDirection += 1;
    } else {
      this.placementDirection = Direction.right;
    }

    this.squareLeave();
    this.squareHover(e);

    return false;
  }

  playerSelection(selection) {
    const selectionStatus = this._cpuBoard.receiveAttack(
      selection.row,
      selection.col
    );

    if (selectionStatus !== AttackStatus.invalid) {
      // if it's a valid selection, send info to update the dom
      this._gameState = GameState.transition;
      this.sendPlayerMoveToDom(selection.row, selection.col, selectionStatus);

      if (this.isGameOver()) {
        this.doGameOver();
      } else {
        this._gameState = GameState.cpuTurn;
        this.doCpuTurn();
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

    this._gameState = GameState.transition;
    this.sendCpuMoveToDom(row, col, selectionStatus);

    if (this.isGameOver()) {
      this.doGameOver();
    } else {
      this._gameState = GameState.playerTurn;
    }
  }

  sendCpuMoveToDom(row, col, status) {
    this._battleshipDom.receiveCpuMove(row, col, status);
  }

  doGameOver() {
    this._gameState = GameState.gameOver;
    this._battleshipDom.receiveGameOver();
  }

  receiveMessage(msg) {
    switch (msg) {
      case GameMessages.StartGame: {
        this._handleGameStartMessage();
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
      default:
        break;
    }
  }

  _handleGameStartMessage() {
    if (this._gameState !== GameState.preGame) {
      this._init();
      this._gameState = GameState.playerTurn;
      this._battleshipDom.reset();
      this.startGame();
      return;
    }
    this._gameState = GameState.playerTurn;
    this.startGame();
  }

  // This is for tests to be able to set gamestate and run properly
  set gameState(value) {
    this._gameState = value;
  }

  setGameState(value) {
    if (value === GameState.placingShips) {
    } else if (value === playerTurn) {
    }

    this.gameState = value;
  }
}
