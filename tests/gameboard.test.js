import GameBoard from '../src/gameBoard';
import Ship from '../src/ship';

const { test, expect, describe, beforeAll } = require('@jest/globals');

const gameBoard = new GameBoard();
const smallShip = new Ship(3);

test('Add ship at invalid position, expect false', () => {
  expect(gameBoard.addShip(smallShip, -1, -1, GameBoard.direction.right)).toBe(
    false
  );
});

test('Add ship at position that will overflow board right, expect false', () => {
  expect(gameBoard.addShip(smallShip, 0, 7, GameBoard.direction.right)).toBe(
    false
  );
});

test('Add ship at position that will overflow board up, expect false', () => {
  expect(gameBoard.addShip(smallShip, 0, 4, GameBoard.direction.up)).toBe(
    false
  );
});

test('Add ship at position that will overflow board left, expect false', () => {
  expect(gameBoard.addShip(smallShip, 1, 1, GameBoard.direction.left)).toBe(
    false
  );
});

test('Add ship at position that will overflow board down, expect false', () => {
  expect(gameBoard.addShip(smallShip, 6, 6, GameBoard.direction.down)).toBe(
    false
  );
});

test('Add ship at valid position, expect true', () => {
  expect(gameBoard.addShip(smallShip, 0, 0, GameBoard.direction.right)).toBe(
    true
  );
});

test('Attack empty spot, should return miss', () => {
  expect(gameBoard.receiveAttack(5, 5)).toBe(GameBoard.attackStatus.miss);
});

test('Attack empty spot thats already been attacked, should return invalid', () => {
  expect(gameBoard.receiveAttack(5, 5)).toBe(GameBoard.attackStatus.invalid);
});

test('Attack a ship, should return hit', () => {
  expect(gameBoard.receiveAttack(0, 0)).toBe(GameBoard.attackStatus.hit);
});

test('Attack a ship, should return hit', () => {
  expect(gameBoard.receiveAttack(0, 1)).toBe(GameBoard.attackStatus.hit);
});

test('Attack a ship, should return sunk', () => {
  expect(gameBoard.receiveAttack(0, 2)).toBe(GameBoard.attackStatus.sunk);
});

test('Attack a ship where its already been attacked, should return invalid', () => {
  expect(gameBoard.receiveAttack(0, 0)).toBe(GameBoard.attackStatus.invalid);
});

test('Attack a ship where its already been attacked, should return invalid', () => {
  expect(gameBoard.receiveAttack(0, 1)).toBe(GameBoard.attackStatus.invalid);
});

test('Attack out of bounds, should return invalid', () => {
  expect(gameBoard.receiveAttack(100, 100)).toBe(
    GameBoard.attackStatus.invalid
  );
});

describe('Sink All Ships', () => {
  beforeAll(() => {
    gameBoard.clearBoard();
    const tinyShip = new Ship(2);
    const tinyShip2 = new Ship(1);
    gameBoard.addShip(tinyShip, 0, 0, GameBoard.direction.down);
    gameBoard.addShip(tinyShip2, 1, 1, GameBoard.direction.down);
  });

  test('Are all ships sunk, should return false', () => {
    expect(gameBoard.areAllShipsSunk()).toBe(false);
  });

  test('Attack a ship, should return hit', () => {
    expect(gameBoard.receiveAttack(0, 0)).toBe(GameBoard.attackStatus.hit);
  });
  test('Attack a ship, should return sunk', () => {
    expect(gameBoard.receiveAttack(1, 0)).toBe(GameBoard.attackStatus.sunk);
  });

  test('Attack a ship, should return sunk', () => {
    expect(gameBoard.receiveAttack(1, 1)).toBe(GameBoard.attackStatus.sunk);
  });

  test('Are all ships sunk, should return true', () => {
    expect(gameBoard.areAllShipsSunk()).toBe(true);
  });
});
