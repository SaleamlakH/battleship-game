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
  let computer, target;
  beforeEach(() => {
    computer = new Computer();
    target = computer.chooseTarget();
  });

  test('Choose target return coordinate', () => {
    expect(target).toBeDefined();
    expect(target.length).toBe(2);
  });

  test('Return adjacent coordinate after hit shoot', () => {
    computer.handleShotResult({ coordinate: target, hit: true });
    const [x, y] = computer.chooseTarget();

    // absolute value of their difference is 0 or 1;
    expect([0, 1]).toContain(Math.abs(target[0] - x));
    expect([0, 1]).toContain(Math.abs(target[1] - y));
  });

  test('Return adjacent coordinate after consecutive hit and miss', () => {
    computer.handleShotResult({ coordinate: target, hit: true });
    computer.handleShotResult({ coordinate: target, hit: false });

    const [x, y] = computer.chooseTarget();
    expect([0, 1]).toContain(Math.abs(target[0] - x));
    expect([0, 1]).toContain(Math.abs(target[1] - y));
  });
});
