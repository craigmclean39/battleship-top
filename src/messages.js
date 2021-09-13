export const GameState = {
  playerTurn: 0,
  cpuTurn: 1,
  gameOver: 2,
  transition: 3,
  preGame: 4,
  placingShips: 5,
  welcome: 6,
};

export const GameMessages = {
  StartGame: 0,
  RedrawCpuBoard: 1,
  ReDrawPlayerBoard: 2,
  ResetGame: 3,
};

export const BoardSpaceStatus = {
  empty: 0,
  emptyHit: 1,
  ship: 2,
  shipHit: 3,
  shipSunk: 4,
};

export const Direction = {
  right: 0,
  down: 1,
  left: 2,
  up: 3,
};

export const AttackStatus = {
  hit: 0,
  miss: 1,
  sunk: 2,
  invalid: 3,
};

export const BattleshipGridSize = 8;

export const PlayerShipNames = [
  'Destroyer',
  'Submarine',
  'Cruiser',
  'Battleship',
  'Carrier',
];
