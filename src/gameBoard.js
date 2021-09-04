export default class GameBoard {
  static boardSpaceStatus = {
    empty: 0,
    emptyHit: 1,
    ship: 2,
    shipHit: 3,
  };

  constructor() {
    this._boardState = [];
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
}
