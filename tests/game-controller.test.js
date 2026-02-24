import { GameController } from '../src/modules/game-controller';
import { Player, Computer } from '../src/modules/player';

describe('Game controller', () => {
  let gameController, player, computer;
  beforeEach(() => {
    player = new Player();
    computer = new Computer();
    gameController = new GameController(player, computer);
  });

  test('start the game by assigning players', () => {
    expect(gameController.currentPlayer).toEqual(player);
    expect(gameController.enemy).toEqual(computer);
  });

  test('switch players', () => {
    gameController.changeCurrentPlayer();

    expect(gameController.currentPlayer).toEqual(computer);
    expect(gameController.enemy).toEqual(player);
  });
});
