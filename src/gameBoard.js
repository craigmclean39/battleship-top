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

  _isSpaceEmpty(xCoord, yCoord) {
    if (this._boardState[xCoord][yCoord] === GameBoard.boardSpaceStatus.empty)
      return true;

    return false;
  }

  static _isSpaceInBounds(xCoord, yCoord) {
    if (xCoord >= 8 || xCoord < 0 || yCoord >= 8 || yCoord < 0) {
      return false;
    }
    return true;
  }

  // Public interface to add a ship, returns true if ship is places in valid position
  // returns false if it's immpossible
  AddShip(ship, xCoord, yCoord, direction) {
    if (!GameBoard._isSpaceInBounds(xCoord, yCoord)) {
      return false;
    }

    // Make an array of coords to check
    const coordsToCheck = [];
    let x = xCoord;
    let y = yCoord;
    for (let i = 0; i < ship.length; i++) {
      coordsToCheck.push({ x, y });

      switch (direction) {
        case GameBoard.direction.right: {
          x += 1;
          break;
        }
        case GameBoard.direction.left: {
          x -= 1;
          break;
        }
        case GameBoard.direction.up: {
          y -= 1;
          break;
        }
        case GameBoard.direction.down: {
          y += 1;
          break;
        }

        default: {
          break;
        }
      }
    }

    for (let i = 0; i < coordsToCheck.length; i++) {
      if (!GameBoard._isSpaceInBounds(coordsToCheck[i].x, coordsToCheck[i].y)) {
        return false;
      }

      if (!this._isSpaceEmpty(coordsToCheck[i].x, coordsToCheck[i].y)) {
        return false;
      }
    }

    // If we make it this far all spaces are within bounds and empty, add the ship
    this._ships.push(ship);
    for (let i = 0; i < coordsToCheck.length; i++) {
      this._boardState[coordsToCheck[i].x][coordsToCheck[i].y] =
        GameBoard.boardSpaceStatus.ship;
    }

    return true;
  }
}
