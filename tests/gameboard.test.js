import GameBoard from '../src/gameBoard';
import Ship from '../src/ship';

const { test, expect, describe, beforeAll } = require('@jest/globals');

const gameBoard = new GameBoard();
const smallShip = new Ship(3);

test('Add ship at invalid position, expect false', () => {
  expect(gameBoard.AddShip(smallShip, -1, -1, GameBoard.direction.right)).toBe(
    false
  );
});

test('Add ship at position that will overflow board right, expect false', () => {
  expect(gameBoard.AddShip(smallShip, 7, 0, GameBoard.direction.right)).toBe(
    false
  );
});

test('Add ship at position that will overflow board up, expect false', () => {
  expect(gameBoard.AddShip(smallShip, 4, 0, GameBoard.direction.up)).toBe(
    false
  );
});

test('Add ship at position that will overflow board left, expect false', () => {
  expect(gameBoard.AddShip(smallShip, 1, 1, GameBoard.direction.left)).toBe(
    false
  );
});

test('Add ship at position that will overflow board down, expect false', () => {
  expect(gameBoard.AddShip(smallShip, 6, 6, GameBoard.direction.down)).toBe(
    false
  );
});

test('Add ship at valid position, expect true', () => {
  expect(gameBoard.AddShip(smallShip, 0, 0, GameBoard.direction.right)).toBe(
    true
  );
});
