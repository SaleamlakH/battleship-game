import { Ship } from '../src/modules/ship';

describe('Ship', () => {
  test('ship sinks when number of hit equal its size', () => {
    let patrolBoat = new Ship('patrol-boat', 2);

    patrolBoat.hit();
    expect(patrolBoat.isSunk()).toBe(false);

    patrolBoat.hit();
    expect(patrolBoat.isSunk()).toBe(true);
  });
});
