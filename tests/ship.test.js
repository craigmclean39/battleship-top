import Ship from '../src/ship';

const { test, expect, describe, beforeAll } = require('@jest/globals');

const testShip = new Ship(5);

function hitShip() {
  testShip.hit(3);
}

function sinkShip() {
  testShip.hit(0);
  testShip.hit(1);
  testShip.hit(2);
  testShip.hit(3);
  testShip.hit(4);
}

test('Ship with no hits should not be sunk', () => {
  expect(testShip.isSunk).toBe(false);
});

describe('Partially hit ship', () => {
  beforeAll(() => {
    hitShip();
  });

  test('Partially hit ships should not be sunk', () => {
    expect(testShip.isSunk).toBe(false);
  });
});

describe('Fully hit ship', () => {
  beforeAll(() => {
    sinkShip();
  });

  test('Fully hit ships should be sunk', () => {
    expect(testShip.isSunk).toBe(true);
  });
});
