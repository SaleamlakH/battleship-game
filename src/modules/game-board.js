import { createFleet } from './ship';

export const DIRECTION_VECTORS = Object.freeze({
  horizontal: [1, 0],
  vertical: [0, 1],
});

export const placementStatus = Object.freeze({
  SUCCESS: 'success',
  OVERLAP: 'overlap',
  NO_ENOUGH_PLACE: 'no-enough-place',
});

export class GameBoard {
  #gameBoard = new Map();
  #missedShot = new Set();
  #hitShot = new Set();
  #boardSize = 10;
  #fleet;

  constructor(fleet = createFleet()) {
    this.#fleet = fleet;
  }

  get fleet() {
    return this.#fleet;
  }

  get boardSize() {
    return this.#boardSize;
  }

  get(coordinate) {
    const key = this.#key(coordinate);
    return this.#gameBoard.get(key);
  }

  isMissed(coordinate) {
    const key = this.#key(coordinate);
    return this.#missedShot.has(key);
  }

  isHit(coordinate) {
    const key = this.#key(coordinate);
    return this.#hitShot.has(key);
  }

  placeShip(ship, coordinate, direction) {
    if (!this.#isValidCoordinate(coordinate)) {
      throw RangeError('Invalid Coordinate');
    }

    const delta = DIRECTION_VECTORS[direction];
    if (!delta) {
      throw TypeError('Invalid Direction');
    }

    const coordinates = this.#getPlacementCoords(ship.size, coordinate, delta);

    if (!this.#hasEnoughCoords(ship.size, coordinate, delta[0])) {
      return {
        coordinates,
        overlaps: [],
        success: false,
        status: placementStatus.NO_ENOUGH_PLACE,
      };
    }

    const overlaps = this.#overlapCoordinates(coordinates);
    if (overlaps.length) {
      return {
        coordinates,
        overlaps,
        success: false,
        status: placementStatus.OVERLAP,
      };
    }

    coordinates.forEach((coord) => {
      const key = this.#key(coord);
      this.#gameBoard.set(key, ship);
    });

    return {
      coordinates,
      overlaps,
      success: true,
      status: placementStatus.SUCCESS,
    };
  }

  #overlapCoordinates(coordinates) {
    return coordinates.filter((coordinates) => this.get(coordinates));
  }

  #hasEnoughCoords(shipSize, coordinate, dx) {
    const [x, y] = coordinate;

    // 1 is subtracted because counting starts from the coordinate given;
    if (dx) {
      return x >= 1 && x + --shipSize <= this.#boardSize;
    }

    return y >= 1 && y + --shipSize <= this.#boardSize;
  }

  #getPlacementCoords(shipSize, [x, y], [dx, dy]) {
    const coordinates = [];

    for (let i = 0; i < shipSize; i++) {
      const newX = x + dx * i;
      const newY = y + dy * i;

      // not enough coords
      if (newX > this.#boardSize || newY > this.#boardSize) {
        return coordinates;
      }

      coordinates.push([newX, newY]);
    }

    return coordinates;
  }

  receiveAttack(coordinate) {
    if (!this.#isValidCoordinate(coordinate)) {
      throw RangeError('Invalid coordinate');
    }

    const key = this.#key(coordinate);

    if (this.#missedShot.has(key) || this.#hitShot.has(key)) {
      return { success: false, hit: false };
    }

    const ship = this.get(coordinate);
    if (ship) {
      ship.hit();
      this.#hitShot.add(key);
      return { success: true, hit: true };
    }

    this.#missedShot.add(key);
    return { success: true, hit: false };
  }

  #isValidCoordinate([x, y]) {
    return x >= 1 && x <= this.#boardSize && y >= 1 && y <= this.#boardSize;
  }

  #key(coordinate) {
    return `${coordinate[0]},${coordinate[1]}`;
  }

  hasAllShipsSunk() {
    return this.#fleet.every((ship) => ship.isSunk());
  }
}
