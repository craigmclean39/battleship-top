import {
  BoardSpaceStatus,
  AttackStatus,
  Direction,
  BattleshipGridSize,
} from './messages';

export default class GameBoard {
  constructor() {
    this._boardState = [];
    this._ships = [];
    this._createBoard();
  }

  _createBoard() {
    for (let i = 0; i < BattleshipGridSize; i++) {
      const newRow = [];
      for (let j = 0; j < BattleshipGridSize; j++) {
        newRow.push(BoardSpaceStatus.empty);
      }
      this._boardState.push(newRow);
    }
  }

  _isSpaceEmpty(row, col) {
    if (this._boardState[row][col] === BoardSpaceStatus.empty) return true;

    return false;
  }

  static _isSpaceInBounds(row, col) {
    if (
      row >= BattleshipGridSize ||
      row < 0 ||
      col >= BattleshipGridSize ||
      col < 0
    ) {
      return false;
    }
    return true;
  }

  clearBoard() {
    for (let i = 0; i < BattleshipGridSize; i++) {
      for (let j = 0; j < BattleshipGridSize; j++) {
        this._boardState[i][j] = BoardSpaceStatus.empty;
      }
    }

    while (this._ships.length > 0) {
      this._ships.pop();
    }
  }

  isValidPlacement(ship, row, col, direction) {
    if (!GameBoard._isSpaceInBounds(row, col)) {
      return false;
    }

    const coordsToCheck = GameBoard.getCoordsToCheck(ship, row, col, direction);

    for (let i = 0; i < coordsToCheck.length; i++) {
      if (
        !GameBoard._isSpaceInBounds(
          coordsToCheck[i].rowVar,
          coordsToCheck[i].colVar
        )
      ) {
        return false;
      }

      if (
        !this._isSpaceEmpty(coordsToCheck[i].rowVar, coordsToCheck[i].colVar)
      ) {
        return false;
      }
    }

    return true;
  }

  static getCoordsToCheck(ship, row, col, direction) {
    const coordsToCheck = [];
    let rowVar = row;
    let colVar = col;
    for (let i = 0; i < ship.length; i++) {
      coordsToCheck.push({ rowVar, colVar });

      switch (direction) {
        case Direction.right: {
          colVar += 1;
          break;
        }
        case Direction.left: {
          colVar -= 1;
          break;
        }
        case Direction.up: {
          rowVar -= 1;
          break;
        }
        case Direction.down: {
          rowVar += 1;
          break;
        }

        default: {
          break;
        }
      }
    }

    return coordsToCheck;
  }

  // Public interface to add a ship, returns true if ship is places in valid position
  // returns false if it's immpossible
  addShip(ship, row, col, direction) {
    if (!this.isValidPlacement(ship, row, col, direction)) {
      return false;
    }

    // If we make it this far all spaces are within bounds and empty, add the ship
    this._ships.push({ ship, row, col, direction });

    const coordsToCheck = GameBoard.getCoordsToCheck(ship, row, col, direction);
    for (let i = 0; i < coordsToCheck.length; i++) {
      this._boardState[coordsToCheck[i].rowVar][coordsToCheck[i].colVar] =
        BoardSpaceStatus.ship;
    }

    return true;
  }

  receiveAttack(row, col) {
    if (!GameBoard._isSpaceInBounds(row, col)) {
      return AttackStatus.invalid;
    }
    if (
      this._boardState[row][col] === BoardSpaceStatus.emptyHit ||
      this._boardState[row][col] === BoardSpaceStatus.shipHit
    ) {
      return AttackStatus.invalid;
    }
    // A valid attack must be to an empty space, or a ship in a position it hasn't been hit
    if (this._boardState[row][col] === BoardSpaceStatus.empty) {
      this._boardState[row][col] = BoardSpaceStatus.emptyHit;
      return AttackStatus.miss;
    }
    if (this._boardState[row][col] === BoardSpaceStatus.ship) {
      this._boardState[row][col] = BoardSpaceStatus.shipHit;

      // route the hit to the proper ship
      let hitStatus;
      for (let i = 0; i < this._ships.length; i++) {
        hitStatus = GameBoard._checkIfCoordinateIsInShipBounds(
          row,
          col,
          this._ships[i]
        );

        if (hitStatus.hit) {
          this._ships[i].ship.hit(hitStatus.position);
          this._boardState[row][col] = BoardSpaceStatus.shipHit;
          if (this._ships[i].ship.isSunk) {
            this._boardState[row][col] = BoardSpaceStatus.shipSunk;

            const coords = GameBoard.getShipCoords(this._ships[i]);
            for (let j = 0; j < coords.length; j++) {
              this._boardState[coords[j].row][coords[j].col] =
                BoardSpaceStatus.shipSunk;
            }

            return AttackStatus.sunk;
          }

          break;
        }
      }

      return AttackStatus.hit;
    }

    return AttackStatus.invalid;
  }

  static getShipCoords(ship) {
    const coords = [];
    let { row } = ship;
    let { col } = ship;
    coords.push({ row, col });

    for (let i = 1; i < ship.ship.length; i++) {
      switch (ship.direction) {
        case Direction.down: {
          row += 1;
          break;
        }
        case Direction.up: {
          row -= 1;
          break;
        }
        case Direction.right: {
          col += 1;
          break;
        }
        case Direction.left: {
          col -= 1;
          break;
        }
        default:
          break;
      }

      coords.push({ row, col });
    }

    return coords;
  }

  static _checkIfCoordinateIsInShipBounds(row, col, shipWithInfo) {
    let rowToCheck = shipWithInfo.row;
    let colToCheck = shipWithInfo.col;
    switch (shipWithInfo.direction) {
      case Direction.right: {
        for (let i = 0; i < shipWithInfo.ship.length; i++) {
          if (rowToCheck === row && colToCheck === col) {
            return { hit: true, position: i };
          }
          colToCheck += 1;
        }
        break;
      }
      case Direction.left: {
        for (let i = 0; i < shipWithInfo.ship.length; i++) {
          if (rowToCheck === row && colToCheck === col) {
            return { hit: true, position: i };
          }
          colToCheck -= 1;
        }
        break;
      }
      case Direction.down: {
        for (let i = 0; i < shipWithInfo.ship.length; i++) {
          if (rowToCheck === row && colToCheck === col) {
            return { hit: true, position: i };
          }
          rowToCheck += 1;
        }
        break;
      }
      case Direction.up: {
        for (let i = 0; i < shipWithInfo.ship.length; i++) {
          if (rowToCheck === row && colToCheck === col) {
            return { hit: true, position: i };
          }
          rowToCheck -= 1;
        }
        break;
      }
      default: {
        break;
      }
    }

    return { hit: false, position: -1 };
  }

  areAllShipsSunk() {
    let allShipsSunk = true;
    for (let i = 0; i < this._ships.length; i++) {
      if (!this._ships[i].ship.isSunk) {
        allShipsSunk = false;
      }
    }
    return allShipsSunk;
  }
}
