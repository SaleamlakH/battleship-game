export class Ship {
  #size;
  #hit = 0;

  constructor(size) {
    this.#size = size;
  }

  get size() {
    return this.#size;
  }

  hit() {
    return this.#hit++;
  }

  isSunk() {
    return this.#hit >= this.#size;
  }
}
