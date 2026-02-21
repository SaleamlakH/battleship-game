import { createFleet } from './ship';

const DIRECTION_VECTORS = Object.freeze({
  horizontal: [1, 0],
  vertical: [0, 1],
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
    return this.#fleet.map((ship) => ({ type: ship.type, size: ship.size }));
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
    if (!this.#isValidCoordinate(coordinate)) return false;

    const delta = DIRECTION_VECTORS[direction];
    if (!delta) return false;

    if (!this.#hasEnoughCoords(ship.size, coordinate, delta[0])) return false;

    const coordinates = this.#getPlacementCoords(ship.size, coordinate, delta);
    if (this.#hasOverlap(coordinates)) return false;

    coordinates.forEach((coord) => {
      const key = this.#key(coord);
      this.#gameBoard.set(key, ship);
    });

    return true;
  }

  #hasOverlap(coordinates) {
    return coordinates.some((coordinates) => this.get(coordinates));
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
    if (!this.#isValidCoordinate(coordinate)) return false;

    const key = this.#key(coordinate);

    if (this.#missedShot.has(key) || this.#hitShot.has(key)) {
      return false;
    }

    const ship = this.get(coordinate);
    if (ship) {
      ship.hit();
      this.#hitShot.add(key);
    } else {
      this.#missedShot.add(key);
    }

    return true;
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
