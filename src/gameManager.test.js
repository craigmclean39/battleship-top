/**
 * @jest-environment jsdom
 */

import GameBoard from './gameBoard';
import GameManager from './gameManager';

const {
  test,
  expect,
  beforeAll,
  describe,
  jest,
  afterAll,
} = require('@jest/globals');

beforeAll(() => {
  jest
    .spyOn(GameManager.prototype, 'sendPlayerMoveToDom')
    .mockImplementation(() => {
      // console.log('Spying on sendPlayerMoveToDom');
    });
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('Simulate Player Click on 0,0, expect to update dom at 0, 0, with miss', () => {
  const gm = new GameManager();

  const evt = {
    target: {
      dataset: {
        row: 0,
        col: 0,
        board: 'cpu',
      },
    },
  };
  gm.squareClicked(evt);
  expect(gm.sendPlayerMoveToDom).toBeCalledWith(
    0,
    0,
    GameBoard.attackStatus.miss
  );
});

test('Simulate Player Click on row 7, col 0, expect to update dom at 7, 0, with hit', () => {
  const gm = new GameManager();

  const evt = {
    target: {
      dataset: {
        row: 7,
        col: 0,
        board: 'cpu',
      },
    },
  };
  gm.squareClicked(evt);
  expect(gm.sendPlayerMoveToDom).toBeCalledWith(
    7,
    0,
    GameBoard.attackStatus.hit
  );
});

const gm1 = new GameManager();
describe('Sink All Ships', () => {
  test('Simulate Player Click on row 6, col 0, expect to update dom at 6, 0, with sunk', () => {
    const evt1 = {
      target: {
        dataset: {
          row: 7,
          col: 0,
          board: 'cpu',
        },
      },
    };

    gm1.squareClicked(evt1);
    gm1.gameState = GameManager.GameState.playerTurn;

    const evt2 = {
      target: {
        dataset: {
          row: 6,
          col: 0,
          board: 'cpu',
        },
      },
    };

    gm1.squareClicked(evt2);

    expect(gm1.sendPlayerMoveToDom).toBeCalledWith(
      6,
      0,
      GameBoard.attackStatus.sunk
    );
  });
});
