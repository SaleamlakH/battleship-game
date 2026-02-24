import { GameBoard, placementStatus } from '../src/modules/game-board';
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
    test('returns coordinates where a ship placed (horizontal)', () => {
      const coordinate = [1, 10];
      // prettier-ignore
      const expCoordinates = [[1, 10], [2, 10], [3, 10]]
      const result = gameBoard.placeShip(destroyer, coordinate, horizontal);

      expect(result.success).toBe(true);
      expect(result.coordinates).toEqual(expCoordinates);
    });

    test('return coordinates where a ship placed (vertical)', () => {
      const coordinate = [1, 1];
      // prettier-ignore
      const expCoordinates = [[1, 1], [1, 2], [1, 3]];

      const result = gameBoard.placeShip(destroyer, coordinate, vertical);
      expect(result.success).toBe(true);
      expect(result.coordinates).toEqual(expCoordinates);
    });

    test('all coordinates are occupied by a ship (horizontal)', () => {
      const coordinate = [1, 10];
      const result = gameBoard.placeShip(destroyer, coordinate, horizontal);

      result.coordinates.forEach((coordinate) => {
        expect(gameBoard.get(coordinate)).toStrictEqual(destroyer);
      });
    });

    test('all coordinates are occupied by a ship (vertical)', () => {
      const coordinate = [1, 1];
      const result = gameBoard.placeShip(destroyer, coordinate, vertical);

      result.coordinates.forEach((coordinate) => {
        expect(gameBoard.get(coordinate)).toStrictEqual(destroyer);
      });
    });

    test('Prevent if there is no enough coords to place (horizontal)', () => {
      const coordinate = [9, 10];
      const result = gameBoard.placeShip(destroyer, coordinate, horizontal);

      expect(result.success).toBe(false);
      expect(result.status).toBe(placementStatus.NO_ENOUGH_PLACE);
    });

    test('Prevent if there is no enough coords to place (vertical)', () => {
      const coordinate = [9, 10];
      const result = gameBoard.placeShip(destroyer, coordinate, vertical);

      expect(result.success).toBe(false);
      expect(result.status).toBe(placementStatus.NO_ENOUGH_PLACE);
    });

    test('Place at the last coordinates (horizontal)', () => {
      const coordinate = [8, 10];
      const result = gameBoard.placeShip(destroyer, coordinate, horizontal);

      expect(result.success).toBe(true);
    });

    test('Place at the last coordinates (vertical)', () => {
      const coordinate = [1, 8];
      const result = gameBoard.placeShip(destroyer, coordinate, vertical);

      expect(result.success).toBe(true);
    });

    test('Prevent overlap (horizontal)', () => {
      let coordinate = [5, 1];
      gameBoard.placeShip(destroyer, coordinate, horizontal);

      coordinate = [3, 1]; // overlap one coordinates
      const result = gameBoard.placeShip(destroyer, coordinate, horizontal);

      expect(result.success).toBe(false);
      expect(result.status).toBe(placementStatus.OVERLAP);
    });

    test('All coordinates are not occupied if there is overlap (horizontal)', () => {
      let coordinate = [5, 1];
      gameBoard.placeShip(destroyer, coordinate, horizontal);

      coordinate = [3, 1]; // overlap one coordinates
      // prettier-ignore
      const expCoordinates = [[3, 1], [4, 1], [5, 1]];
      gameBoard.placeShip(destroyer, coordinate, horizontal);

      expCoordinates.forEach((coordinate) => {
        expect(gameBoard.get(coordinate)).toBeUndefined;
      });
    });

    test('Prevent overlap (vertical) ', () => {
      let coordinate = [1, 5];
      gameBoard.placeShip(destroyer, coordinate, vertical);

      coordinate = [1, 3]; // overlap one coordinates
      const result = gameBoard.placeShip(destroyer, coordinate, vertical);

      expect(result.success).toBe(false);
      expect(result.status).toBe(placementStatus.OVERLAP);
    });

    test('All coordinate are not occupied if there is overlap (vertical)', () => {
      let coordinate = [1, 5];
      gameBoard.placeShip(destroyer, coordinate, vertical);

      coordinate = [1, 3]; // overlap one coordinates
      // prettier-ignore
      const expCoordinates = [[1, 3], [1, 4], [1, 5]];
      gameBoard.placeShip(destroyer, coordinate, vertical);

      expCoordinates.forEach((coordinate) => {
        expect(gameBoard.get(coordinate)).toBeUndefined;
      });
    });

    test('Throw error for invalid coordinate', () => {
      expect(() => gameBoard.placeShip(destroyer, [-1, 1], horizontal)).toThrow(
        RangeError,
      );
    });

    test('Throw error for invalid direction', () => {
      expect(() => gameBoard.placeShip(destroyer, [1, 1], 'diagonal')).toThrow(
        TypeError,
      );
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

      const attack = gameBoard.receiveAttack([1, 2]);
      expect(attack.success).toBe(false);
    });

    test('Prevent shot on hit coordinate', () => {
      gameBoard.placeShip(destroyer, [1, 1], 'horizontal');
      gameBoard.receiveAttack([1, 1]);

      const attack = gameBoard.receiveAttack([1, 1]);
      expect(attack.success).toBe(false);
    });

    test('Reject invalid coordinate', () => {
      // prettier-ignore
      const invalidCoords = [[0, 1], [1, 0], [11, 1], [1, 11]];

      invalidCoords.forEach((coordinate) => {
        expect(() => gameBoard.receiveAttack(coordinate)).toThrow(RangeError);
      });
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
