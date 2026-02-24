import { Player, Computer } from '../src/modules/player';

describe('Player', () => {
  describe('Place randomly', () => {
    let player, gameBoard, placement;
    beforeEach(() => {
      player = new Player();
      gameBoard = player.gameBoard;
      placement = player.placeRandomly();
    });

    test('Return placement object', () => {
      expect(placement).toBeDefined();
    });

    test('Number coordinates in placement matches total fleet size', () => {
      expect(placement.length).toBe(gameBoard.fleet.length);
    });

    test('the number of coordinates of a ship matches ship size', () => {
      placement.forEach(({ size, coordinates }) => {
        expect(coordinates.length).toBe(size);
      });
    });

    test('All coordinates in the direction has expected ship', () => {
      placement.forEach(({ type, coordinates }) => {
        coordinates.forEach((coordinate) => {
          expect(gameBoard.get(coordinate)).toBeDefined();
          expect(gameBoard.get(coordinate).type).toBe(type);
        });
      });
    });
  });
});

describe('Computer', () => {
  let player, computer, gameBoard;
  beforeEach(() => {
    player = new Player();
    player.placeRandomly();
    gameBoard = player.gameBoard;
    computer = new Computer();
  });

  test('Shoot return coordinate and whether it is hit', () => {
    const { target, hit } = computer.shoot(gameBoard);
    expect(target).toBeDefined();
    expect(hit).toBeDefined();
  });
});
