import GameBoard from '../src/gameBoard';
import Ship from '../src/ship';
import { Direction, AttackStatus } from '../src/messages';

const { test, expect, describe, beforeAll } = require('@jest/globals');

const gameBoard = new GameBoard();
const smallShip = new Ship(3);

test('Add ship at invalid position, expect false', () => {
  expect(gameBoard.addShip(smallShip, -1, -1, Direction.right)).toBe(false);
});

test('Add ship at position that will overflow board right, expect false', () => {
  expect(gameBoard.addShip(smallShip, 0, 7, Direction.right)).toBe(false);
});

test('Add ship at position that will overflow board up, expect false', () => {
  expect(gameBoard.addShip(smallShip, 0, 4, Direction.up)).toBe(false);
});

test('Add ship at position that will overflow board left, expect false', () => {
  expect(gameBoard.addShip(smallShip, 1, 1, Direction.left)).toBe(false);
});

test('Add ship at position that will overflow board down, expect false', () => {
  expect(gameBoard.addShip(smallShip, 6, 6, Direction.down)).toBe(false);
});

test('Add ship at valid position, expect true', () => {
  expect(gameBoard.addShip(smallShip, 0, 0, Direction.right)).toBe(true);
});

test('Attack empty spot, should return miss', () => {
  expect(gameBoard.receiveAttack(5, 5)).toBe(AttackStatus.miss);
});

test('Attack empty spot thats already been attacked, should return invalid', () => {
  expect(gameBoard.receiveAttack(5, 5)).toBe(AttackStatus.invalid);
});

test('Attack a ship, should return hit', () => {
  expect(gameBoard.receiveAttack(0, 0)).toBe(AttackStatus.hit);
});

test('Attack a ship, should return hit', () => {
  expect(gameBoard.receiveAttack(0, 1)).toBe(AttackStatus.hit);
});

test('Attack a ship, should return sunk', () => {
  expect(gameBoard.receiveAttack(0, 2)).toBe(AttackStatus.sunk);
});

test('Attack a ship where its already been attacked, should return invalid', () => {
  expect(gameBoard.receiveAttack(0, 0)).toBe(AttackStatus.invalid);
});

test('Attack a ship where its already been attacked, should return invalid', () => {
  expect(gameBoard.receiveAttack(0, 1)).toBe(AttackStatus.invalid);
});

test('Attack out of bounds, should return invalid', () => {
  expect(gameBoard.receiveAttack(100, 100)).toBe(AttackStatus.invalid);
});

describe('Sink All Ships', () => {
  beforeAll(() => {
    gameBoard.clearBoard();
    const tinyShip = new Ship(2);
    const tinyShip2 = new Ship(1);
    gameBoard.addShip(tinyShip, 0, 0, Direction.down);
    gameBoard.addShip(tinyShip2, 1, 1, Direction.down);
  });

  test('Are all ships sunk, should return false', () => {
    expect(gameBoard.areAllShipsSunk()).toBe(false);
  });

  test('Attack a ship, should return hit', () => {
    expect(gameBoard.receiveAttack(0, 0)).toBe(AttackStatus.hit);
  });
  test('Attack a ship, should return sunk', () => {
    expect(gameBoard.receiveAttack(1, 0)).toBe(AttackStatus.sunk);
  });

  test('Attack a ship, should return sunk', () => {
    expect(gameBoard.receiveAttack(1, 1)).toBe(AttackStatus.sunk);
  });

  test('Are all ships sunk, should return true', () => {
    expect(gameBoard.areAllShipsSunk()).toBe(true);
  });
});
