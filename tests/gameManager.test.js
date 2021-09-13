/**
 * @jest-environment jsdom
 */

import GameManager from '../src/gameManager';
import { GameState, AttackStatus, GameMessages } from '../src/messages';

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

  jest
    .spyOn(GameManager.prototype, 'sendCpuMoveToDom')
    .mockImplementation(() => {
      // console.log('Spying on sendPlayerMoveToDom');
    });
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('Simulate Player Click on 0,0, expect to update dom at 0, 0, with miss', () => {
  const gm = new GameManager();
  gm.testMode = true;
  gm.receiveMessage(GameMessages.StartGame);
  gm.gameState = GameState.preGame;

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
  expect(gm.sendPlayerMoveToDom).toBeCalledWith(0, 0, AttackStatus.miss);
});

test('Simulate Player Click on row 7, col 0, expect to update dom at 7, 0, with hit', () => {
  const gm = new GameManager();
  gm.testMode = true;
  gm.receiveMessage(GameMessages.StartGame);
  gm.gameState = GameState.preGame;

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
  expect(gm.sendPlayerMoveToDom).toBeCalledWith(7, 0, AttackStatus.hit);
});

const gm1 = new GameManager();
gm1.testMode = true;
gm1.receiveMessage(GameMessages.StartGame);
gm1.gameState = GameState.preGame;
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
    gm1.gameState = GameState.playerTurn;

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

    expect(gm1.sendPlayerMoveToDom).toBeCalledWith(6, 0, AttackStatus.sunk);
  });
});
