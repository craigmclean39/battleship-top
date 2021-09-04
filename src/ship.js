export default class Ship {
  static hitStatus = { unhit: 0, hit: 1 };

  constructor(length) {
    this._status = new Array(length);
    for (let i = 0; i < length; i++) {
      this._status[i] = Ship.hitStatus.unhit;
    }
  }

  hit(index) {
    if (index < this._status.length) {
      this._status[index] = Ship.hitStatus.hit;
    }
  }

  get isSunk() {
    let sunk = true;
    for (let i = 0; i < this._status.length; i++) {
      if (this._status[i] === Ship.hitStatus.unhit) {
        sunk = false;
      }
    }
    return sunk;
  }
}
