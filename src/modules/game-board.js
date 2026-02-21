import { createFleet } from './ship';

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

    if (direction === 'horizontal') {
      // number of extra cells to span
      const numSpan = ship.size - 1;
      if (coordinate[0] + numSpan > this.#boardSize) return;

      return this.#placeInHorizontal(ship, coordinate);
    }

    if (direction === 'vertical') {
      // number of extra cells to span
      const numSpan = ship.size - 1;
      if (coordinate[1] + numSpan > this.#boardSize) return;

      return this.#placeInVertical(ship, coordinate);
    }

    return false;
  }

  #placeInHorizontal(ship, coordinate) {
    const [x, y] = coordinate;
    const possibleCoords = [];

    for (let i = 0; i < ship.size; i++) {
      if (this.get([x + i, y])) return false;
      possibleCoords.push([x + i, y]);
    }

    possibleCoords.forEach((coord) => {
      let key = this.#key(coord);
      this.#gameBoard.set(key, ship);
    });

    return true;
  }

  #placeInVertical(ship, coordinate) {
    const [x, y] = coordinate;
    const possibleCoords = [];

    for (let i = 0; i < ship.size; i++) {
      if (this.get([x, y + i])) return false;
      possibleCoords.push([x, y + i]);
    }

    possibleCoords.forEach((coord) => {
      const key = this.#key(coord);
      this.#gameBoard.set(key, ship);
    });

    return true;
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
