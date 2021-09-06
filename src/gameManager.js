import GameBoard from './gameBoard';
import Ship from './ship';

export default class GameManager {
  constructor() {
    this._playerTurn = true;

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
    /* this._playerBoard.addShip(playerSubmarine, 0, 1, GameBoard.direction.down);
    this._playerBoard.addShip(playerCruiser, 0, 2, GameBoard.direction.down);
    this._playerBoard.addShip(playerBattleship, 0, 3, GameBoard.direction.down);
    this._playerBoard.addShip(playerCarrier, 0, 4, GameBoard.direction.down); */

    this._cpuBoard.addShip(cpuDestroyer, 7, 0, GameBoard.direction.up);
    /* this._cpuBoard.addShip(cpuSubmarine, 7, 1, GameBoard.direction.up);
    this._cpuBoard.addShip(cpuCruiser, 7, 2, GameBoard.direction.up);
    this._cpuBoard.addShip(cpuBattleship, 7, 3, GameBoard.direction.up);
    this._cpuBoard.addShip(cpuCarrier, 7, 4, GameBoard.direction.up); */
  }

  render() {
    console.log('PlayerBoard');
    this._playerBoard.printBoard();
    console.log('CpuBoard');
    this._cpuBoard.printBoard();

    this.doTurn();
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

  doTurn() {
    if (this._playerTurn) {
      let playerMove = GameBoard.attackStatus.invalid;
      while (playerMove === GameBoard.attackStatus.invalid) {
        let row = window.prompt('Enter row', 'row');
        let col = window.prompt('Enter col', 'col');

        playerMove = this._cpuBoard.receiveAttack(Number(row), Number(col));
      }
      console.log(`Player: ${GameManager._logMoveType(playerMove)}`);

      this._playerTurn = false;
    } else {
      let cpuMove = GameBoard.attackStatus.invalid;
      while (cpuMove === GameBoard.attackStatus.invalid) {
        let row = Math.round(Math.random() * 7);
        let col = Math.round(Math.random() * 7);

        cpuMove = this._playerBoard.receiveAttack(row, col);
      }

      console.log(`CPU: ${GameManager._logMoveType(cpuMove)}`);
      this._playerTurn = true;
    }

    if (this._playerBoard.areAllShipsSunk()) {
      console.log('CPU WON');
    } else if (this._cpuBoard.areAllShipsSunk()) {
      console.log('Player Won');
    } else {
      this.render();
    }
  }

  static _logMoveType(move) {
    switch (move) {
      case GameBoard.attackStatus.hit: {
        return 'hit';
      }
      case GameBoard.attackStatus.miss: {
        return 'miss';
      }
      case GameBoard.attackStatus.sunk: {
        return 'sunk';
      }
      default: {
        break;
      }
    }

    return 'null';
  }
}
