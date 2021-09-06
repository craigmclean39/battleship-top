import BattleshipDom from './battleshipDom';
import GameBoard from './gameBoard';
import Ship from './ship';

export default class GameManager {
  static GameState = {
    playerTurn: 0,
    cpuTurn: 1,
    gameOver: 2,
  };

  constructor() {
    this._gameState = GameManager.GameState.playerTurn;

    this._playerBoard = new GameBoard();
    this._cpuBoard = new GameBoard();

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

    this._playerBoard.addShip(playerDestroyer, 0, 0, GameBoard.direction.down);
    this._playerBoard.addShip(playerSubmarine, 0, 1, GameBoard.direction.down);
    this._playerBoard.addShip(playerCruiser, 0, 2, GameBoard.direction.down);
    this._playerBoard.addShip(playerBattleship, 0, 3, GameBoard.direction.down);
    this._playerBoard.addShip(playerCarrier, 0, 4, GameBoard.direction.down);

    this._cpuBoard.addShip(cpuDestroyer, 7, 0, GameBoard.direction.up);
    this._cpuBoard.addShip(cpuSubmarine, 7, 1, GameBoard.direction.up);
    this._cpuBoard.addShip(cpuCruiser, 7, 2, GameBoard.direction.up);
    this._cpuBoard.addShip(cpuBattleship, 7, 3, GameBoard.direction.up);
    this._cpuBoard.addShip(cpuCarrier, 7, 4, GameBoard.direction.up);

    this._battleshipDom = new BattleshipDom();
    this._battleshipDom.setClickEventHandler(this.squareClicked);
    this._battleshipDom.setPlayerBoard(this._playerBoard._boardState);
    this._battleshipDom.setCpuBoard(this._cpuBoard._boardState);
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
    console.log(`${e.target.dataset.row}:${e.target.dataset.col}`);
  }

  testSomething() {
    this.doSomething(3);
  }

  doSomething() {
    console.log('DoSomething');
  }
}
