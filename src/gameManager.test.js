/**
 * @jest-environment jsdom
 */

import GameManager from './gameManager';

const { test, expect, beforeAll, jest, afterAll } = require('@jest/globals');

beforeAll(() => {
  jest.spyOn(GameManager.prototype, 'doSomething').mockImplementation(() => {
    console.log('Spying on DoSomething');
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('GameManager Spy Test', () => {
  const gm = new GameManager();

  gm.testSomething();
  expect(gm.doSomething).toBeCalledWith(3);
});
