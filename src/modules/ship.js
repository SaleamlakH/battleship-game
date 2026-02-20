const SHIP_TYPES = [
  { type: 'carrier', size: 5 },
  { type: 'battleship', size: 4 },
  { type: 'destroyer', size: 3 },
  { type: 'submarine', size: 3 },
  { type: 'patrol-boat', size: 2 },
];

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

export const createFleet = () => {
  return SHIP_TYPES.map(({ type, size }) => new Ship(type, size));
};
