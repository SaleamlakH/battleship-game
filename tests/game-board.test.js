import { GameBoard } from '../src/modules/game-board';
import { Ship } from '../src/modules/ship';

describe('Game board', () => {
  let gameBoard;
  let destroyer;
  beforeEach(() => {
    gameBoard = new GameBoard();
    destroyer = new Ship(3);
  });

  describe('Place ship', () => {
    test('Place a ship horizontally at specific coordinates', () => {
      const coordinate = [1, 10];
      const direction = 'horizontal';

      gameBoard.placeShip(destroyer, coordinate, direction);
      expect(gameBoard.get([1, 10])).toEqual(destroyer);
      expect(gameBoard.get([2, 10])).toEqual(destroyer);
    });

    test('Place a ship vertically at specific coordinates', () => {
      const coordinate = [1, 1];
      const direction = 'vertical';

      gameBoard.placeShip(destroyer, coordinate, direction);
      expect(gameBoard.get([1, 1])).toEqual(destroyer);
      expect(gameBoard.get([1, 2])).toEqual(destroyer);
    });

    test('Prevent placement when there is no enough spot (horizontal)', () => {
      const coordinate = [9, 10];
      const direction = 'horizontal';

      gameBoard.placeShip(destroyer, coordinate, direction);
      expect(gameBoard.get([9, 10])).toBe(undefined);
    });

    test('Prevent placement when there is no enough spot (vertical)', () => {
      const coordinate = [9, 10];
      const direction = 'vertical';

      gameBoard.placeShip(destroyer, coordinate, direction);
      expect(gameBoard.get([9, 10])).toBe(undefined);
    });

    test('Place horizontally at the last coordinates', () => {
      const coordinate = [8, 10];
      const direction = 'horizontal';

      gameBoard.placeShip(destroyer, coordinate, direction);
      expect(gameBoard.get([8, 10])).toEqual(destroyer);
    });

    test('Place vertically at the last coordinates', () => {
      const coordinate = [1, 8];
      const direction = 'vertical';

      gameBoard.placeShip(destroyer, coordinate, direction);
      expect(gameBoard.get([1, 10])).toEqual(destroyer);
    });
  });
});
