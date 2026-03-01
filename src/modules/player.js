import { GameBoard, DIRECTION_VECTORS } from './game-board.js';

export class Player {
  #gameBoard;

  constructor() {
    this.#gameBoard = new GameBoard();
  }

  get gameBoard() {
    return this.#gameBoard;
  }

  placeRandomly() {
    const directions = Object.keys(DIRECTION_VECTORS);
    const placement = [];

    this.#gameBoard.fleet.forEach((ship) => {
      let success = false;
      while (!success) {
        const direction =
          directions[Math.floor(Math.random() * directions.length)];

        const coordinate = [
          Math.floor(Math.random() * this.#gameBoard.boardSize) + 1,
          Math.floor(Math.random() * this.#gameBoard.boardSize) + 1,
        ];

        const result = this.#gameBoard.placeShip(ship, coordinate, direction);

        success = result.success;
        if (success) {
          placement.push({
            dirVector: DIRECTION_VECTORS[direction],
            type: ship.type,
            size: ship.size,
            coordinates: result.coordinates,
          });
        }
      }
    });

    return placement;
  }
}

export class Computer extends Player {
  #targets;

  constructor() {
    super();
    this.#targets = this.#buildTargets();
  }

  #buildTargets() {
    const targets = [];

    for (let i = 1; i <= this.gameBoard.boardSize; i++) {
      for (let j = 1; j <= this.gameBoard.boardSize; j++) {
        targets.push([i, j]);
      }
    }

    return targets;
  }

  chooseTarget() {
    const randIndex = Math.floor(Math.random() * this.#targets.length);
    const target = this.#targets[randIndex];

    // remove from #targets
    this.#deleteItem(this.#targets, randIndex);

    return target;
  }

  #deleteItem(array, index) {
    const lastIndex = array.length - 1;
    [array[index], array[lastIndex]] = [array[lastIndex], array[index]];

    this.#targets.pop();
  }
}
