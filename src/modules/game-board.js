export class GameBoard {
  #gameBoard = new Map();
  #boardSize = 10;

  get(coordinate) {
    const key = this.#key(coordinate);
    return this.#gameBoard.get(key);
  }

  placeShip(ship, coordinate, direction) {
    if (direction === 'horizontal') {
      // number of extra cells to span
      const numSpan = ship.size - 1;
      if (coordinate[0] + numSpan > this.#boardSize) return;

      this.#placeInHorizontal(ship, coordinate);
    }

    if (direction === 'vertical') {
      // number of extra cells to span
      const numSpan = ship.size - 1;
      if (coordinate[1] + numSpan > this.#boardSize) return;

      this.#placeInVertical(ship, coordinate);
    }
  }

  #placeInHorizontal(ship, coordinate) {
    const [x, y] = coordinate;
    const key = this.#key([x, y]);
    this.#gameBoard.set(key, ship);

    for (let i = 1; i < ship.size; i++) {
      const key = this.#key([x + i, y]);
      this.#gameBoard.set(key, ship);
    }
  }

  #placeInVertical(ship, coordinate) {
    const [x, y] = coordinate;
    const key = this.#key([x, y]);
    this.#gameBoard.set(key, ship);

    for (let i = 1; i < ship.size; i++) {
      const key = this.#key([x, y + i]);
      this.#gameBoard.set(key, ship);
    }
  }

  #key(coordinate) {
    return `${coordinate[0]},${coordinate[1]}`;
  }
}
