export default class GameBoard {
  static boardSpaceStatus = {
    empty: 0,
    emptyHit: 1,
    ship: 2,
    shipHit: 3,
  };

  static direction = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  static attackStatus = {
    hit: 0,
    miss: 1,
    sunk: 2,
    invalid: 3,
  };

  constructor() {
    this._boardState = [];
    this._ships = [];
    this._createBoard();
  }

  _createBoard() {
    for (let i = 0; i < 8; i++) {
      const newRow = [];
      for (let j = 0; j < 8; j++) {
        newRow.push(GameBoard.boardSpaceStatus.empty);
      }
      this._boardState.push(newRow);
    }
  }

  _isSpaceEmpty(row, col) {
    if (this._boardState[row][col] === GameBoard.boardSpaceStatus.empty)
      return true;

    return false;
  }

  static _isSpaceInBounds(row, col) {
    if (row >= 8 || row < 0 || col >= 8 || col < 0) {
      return false;
    }
    return true;
  }

  clearBoard() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        this._boardState[i][j] = GameBoard.boardSpaceStatus.empty;
      }
    }

    while (this._ships.length > 0) {
      this._ships.pop();
    }
  }

  // TODO: REMOVE
  printBoard() {
    let row = '';
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this._boardState[i][j] === GameBoard.boardSpaceStatus.empty) {
          row += '_';
        } else if (
          this._boardState[i][j] === GameBoard.boardSpaceStatus.emptyHit
        ) {
          row += '*';
        } else if (this._boardState[i][j] === GameBoard.boardSpaceStatus.ship) {
          row += 'O';
        } else if (
          this._boardState[i][j] === GameBoard.boardSpaceStatus.shipHit
        ) {
          row += '0';
        }
      }
      row += '\n';
    }
    console.log(row);
  }

  // Public interface to add a ship, returns true if ship is places in valid position
  // returns false if it's immpossible
  addShip(ship, row, col, direction) {
    if (!GameBoard._isSpaceInBounds(row, col)) {
      return false;
    }

    // Make an array of coords to check
    const coordsToCheck = [];
    let rowVar = row;
    let colVar = col;
    for (let i = 0; i < ship.length; i++) {
      coordsToCheck.push({ rowVar, colVar });

      switch (direction) {
        case GameBoard.direction.right: {
          colVar += 1;
          break;
        }
        case GameBoard.direction.left: {
          colVar -= 1;
          break;
        }
        case GameBoard.direction.up: {
          rowVar -= 1;
          break;
        }
        case GameBoard.direction.down: {
          rowVar += 1;
          break;
        }

        default: {
          break;
        }
      }
    }

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

    // If we make it this far all spaces are within bounds and empty, add the ship
    this._ships.push({ ship, row, col, direction });

    for (let i = 0; i < coordsToCheck.length; i++) {
      this._boardState[coordsToCheck[i].rowVar][coordsToCheck[i].colVar] =
        GameBoard.boardSpaceStatus.ship;
    }

    return true;
  }

  receiveAttack(row, col) {
    if (!GameBoard._isSpaceInBounds(row, col)) {
      return GameBoard.attackStatus.invalid;
    }
    if (
      this._boardState[row][col] === GameBoard.boardSpaceStatus.emptyHit ||
      this._boardState[row][col] === GameBoard.boardSpaceStatus.shipHit
    ) {
      return GameBoard.attackStatus.invalid;
    }
    // A valid attack must be to an empty space, or a ship in a position it hasn't been hit
    if (this._boardState[row][col] === GameBoard.boardSpaceStatus.empty) {
      this._boardState[row][col] = GameBoard.boardSpaceStatus.emptyHit;
      return GameBoard.attackStatus.miss;
    }
    if (this._boardState[row][col] === GameBoard.boardSpaceStatus.ship) {
      this._boardState[row][col] = GameBoard.boardSpaceStatus.shipHit;

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
          this._boardState[row][col] = GameBoard.boardSpaceStatus.shipHit;
          if (this._ships[i].ship.isSunk) {
            return GameBoard.attackStatus.sunk;
          }

          break;
        }
      }

      return GameBoard.attackStatus.hit;
    }

    return GameBoard.attackStatus.invalid;
  }

  static _checkIfCoordinateIsInShipBounds(row, col, shipWithInfo) {
    let rowToCheck = shipWithInfo.row;
    let colToCheck = shipWithInfo.col;
    switch (shipWithInfo.direction) {
      case GameBoard.direction.right: {
        for (let i = 0; i < shipWithInfo.ship.length; i++) {
          if (rowToCheck === row && colToCheck === col) {
            return { hit: true, position: i };
          }
          colToCheck += 1;
        }
        break;
      }
      case GameBoard.direction.left: {
        for (let i = 0; i < shipWithInfo.ship.length; i++) {
          if (rowToCheck === row && colToCheck === col) {
            return { hit: true, position: i };
          }
          colToCheck -= 1;
        }
        break;
      }
      case GameBoard.direction.down: {
        for (let i = 0; i < shipWithInfo.ship.length; i++) {
          if (rowToCheck === row && colToCheck === col) {
            return { hit: true, position: i };
          }
          rowToCheck += 1;
        }
        break;
      }
      case GameBoard.direction.up: {
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
