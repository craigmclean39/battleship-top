export const GameState = {
  playerTurn: 0,
  cpuTurn: 1,
  gameOver: 2,
  transition: 3,
  preGame: 4,
};

export const GameMessages = {
  StartGame: 0,
  RedrawCpuBoard: 1,
  ReDrawPlayerBoard: 2,
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
