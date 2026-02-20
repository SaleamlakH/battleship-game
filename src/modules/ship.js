export class Ship {
  #type;
  #size;
  #hit = 0;

  constructor(type, size) {
    this.#size = size;
    this.#type = type;
  }

  get type() {
    return this.#type;
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
