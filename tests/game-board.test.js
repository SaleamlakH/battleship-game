import { GameBoard } from '../src/modules/game-board';
import { Ship } from '../src/modules/ship';

describe('Game board', () => {
  const horizontal = 'horizontal';
  const vertical = 'vertical';

  let gameBoard;
  let destroyer;
  beforeEach(() => {
    gameBoard = new GameBoard();
    destroyer = new Ship('destroyer', 3);
  });

  describe('Place ship', () => {
    test('Place a ship horizontally at specific coordinates', () => {
      const coordinate = [1, 10];

      gameBoard.placeShip(destroyer, coordinate, horizontal);
      expect(gameBoard.get([1, 10])).toEqual(destroyer);
      expect(gameBoard.get([2, 10])).toEqual(destroyer);
    });

    test('Place a ship vertically at specific coordinates', () => {
      const coordinate = [1, 1];

      gameBoard.placeShip(destroyer, coordinate, vertical);
      expect(gameBoard.get([1, 1])).toEqual(destroyer);
      expect(gameBoard.get([1, 2])).toEqual(destroyer);
    });

    test('Prevent placement when there is no enough spot (horizontal)', () => {
      const coordinate = [9, 10];

      gameBoard.placeShip(destroyer, coordinate, horizontal);
      expect(gameBoard.get([9, 10])).toBe(undefined);
    });

    test('Prevent placement when there is no enough spot (vertical)', () => {
      const coordinate = [9, 10];

      gameBoard.placeShip(destroyer, coordinate, vertical);
      expect(gameBoard.get([9, 10])).toBe(undefined);
    });

    test('Place horizontally at the last coordinates', () => {
      const coordinate = [8, 10];

      gameBoard.placeShip(destroyer, coordinate, horizontal);
      expect(gameBoard.get([8, 10])).toEqual(destroyer);
    });

    test('Place vertically at the last coordinates', () => {
      const coordinate = [1, 8];

      gameBoard.placeShip(destroyer, coordinate, vertical);
      expect(gameBoard.get([1, 10])).toEqual(destroyer);
    });

    test('Return false if there is overlap (horizontal)', () => {
      let coordinate = [5, 1];
      gameBoard.placeShip(destroyer, coordinate, horizontal);

      coordinate = [3, 1]; // overlap one coordinates
      expect(gameBoard.placeShip(destroyer, coordinate, horizontal)).toBe(
        false,
      );
    });

    test('All possible coordinate are empty if there is overlap (horizontal)', () => {
      let coordinate = [5, 1];
      gameBoard.placeShip(destroyer, coordinate, horizontal);

      coordinate = [3, 1]; // overlap one coordinates
      gameBoard.placeShip(destroyer, coordinate, horizontal);
      expect(gameBoard.get([3, 1])).toBe(undefined);
      expect(gameBoard.get([4, 1])).toBe(undefined);
    });

    test('Return false if overlap (vertical) ', () => {
      let coordinate = [1, 5];

      gameBoard.placeShip(destroyer, coordinate, vertical);

      coordinate = [1, 3]; // overlap one coordinates
      expect(gameBoard.placeShip(destroyer, coordinate, vertical)).toBe(false);
    });

    test('All possible coordinate are empty if there is overlap (vertical)', () => {
      let coordinate = [1, 5];
      gameBoard.placeShip(destroyer, coordinate, vertical);

      coordinate = [1, 3]; // overlap one coordinates
      gameBoard.placeShip(destroyer, coordinate, vertical);
      expect(gameBoard.get([1, 3])).toBe(undefined);
      expect(gameBoard.get([1, 4])).toBe(undefined);
    });

    test('Reject invalid coordinate', () => {
      expect(gameBoard.placeShip(destroyer, [-1, 1], horizontal)).toBe(false);
    });

    test('Reject invalid direction', () => {
      expect(gameBoard.placeShip(destroyer, [1, 1], 'diagonal')).toBe(false);
    });
  });

  describe('Receive attack', () => {
    test('Hit attack shot increases the hit number a ship', () => {
      gameBoard.placeShip(destroyer, [1, 1], 'horizontal');

      gameBoard.receiveAttack([1, 1]);
      gameBoard.receiveAttack([2, 1]);

      gameBoard.receiveAttack([1, 2]); // missed shot
      expect(destroyer.isSunk()).toBe(false);

      gameBoard.receiveAttack([3, 1]);
      expect(destroyer.isSunk()).toBe(true);
    });

    test('Prevent shot on missed coordinate', () => {
      gameBoard.placeShip(destroyer, [1, 1], 'horizontal');

      gameBoard.receiveAttack([1, 2]);
      expect(gameBoard.receiveAttack([1, 2])).toBe(false);
    });

    test('Prevent shot on hit coordinate', () => {
      gameBoard.placeShip(destroyer, [1, 1], 'horizontal');

      gameBoard.receiveAttack([1, 1]);
      expect(gameBoard.receiveAttack([1, 1])).toBe(false);
    });

    test('Reject invalid coordinate', () => {
      expect(gameBoard.receiveAttack([0, 1])).toBe(false);
      expect(gameBoard.receiveAttack([1, 0])).toBe(false);
      expect(gameBoard.receiveAttack([11, 1])).toBe(false);
      expect(gameBoard.receiveAttack([1, 11])).toBe(false);
    });
  });

  describe('Report wether all ships has been sunk', () => {
    const mockFleet = [new Ship('destroyer', 3), new Ship('patrol-boat', 2)];
    const mockGameBoard = new GameBoard(mockFleet);

    mockFleet[0].hit();
    mockFleet[1].hit();
    mockFleet[1].hit();

    test('Return false if any ship is not sunk', () => {
      expect(mockGameBoard.hasAllShipsSunk()).toBe(false);
    });

    test('Return true if all ships are sunk', () => {
      mockFleet[0].hit();
      mockFleet[0].hit();

      expect(mockGameBoard.hasAllShipsSunk()).toBe(true);
    });
  });
});
