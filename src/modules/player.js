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
  #candidateTargets = [];
  #recentHit = { target: null, vector: null };
  #VECTORS = { left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1] };

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
    // get hit
    if (this.#recentHit.vector || this.#candidateTargets.length) {
      const { target, index, vector } = this.#getCandidate();
      if (this.#recentHit.vector) this.#removeCrossCandidates(vector);

      this.#recentHit.vector = vector;
      this.#deleteItem(this.#targets, index);
      return target;
    }

    // random target
    const index = Math.floor(Math.random() * this.#targets.length);
    const target = this.#targets[index];

    // remove from #targets
    this.#deleteItem(this.#targets, index);

    return target;
  }

  handleShotResult({ hit, coordinate }) {
    if (!hit) {
      this.#recentHit.target = null;
      this.#recentHit.vector = null;
      return;
    }

    // save it
    this.#recentHit.target = coordinate;

    // need to set new candidates;
    if (!this.#candidateTargets.length) {
      this.#setCandidateTargets(coordinate);
    }
  }

  #getCandidate() {
    // knows which side to follow
    if (this.#recentHit.vector) {
      const [x, y] = this.#recentHit.target;
      const [dx, dy] = this.#recentHit.vector;

      const target = [x + dx, y + dy];

      // validate
      const index = this.#targets.findIndex(
        ([x, y]) => target[0] === x && target[1] === y,
      );

      if (index >= 0) {
        return { ...this.#recentHit, index, target: [x + dx, y + dy] };
      }
    }

    return this.#candidateTargets.pop();
  }

  #setCandidateTargets([x, y]) {
    for (const key in this.#VECTORS) {
      const [dx, dy] = this.#VECTORS[key];
      const target = [x + dx, y + dy];

      // check if it is in targets
      const index = this.#targets.findIndex(
        ([x, y]) => target[0] === x && target[1] === y,
      );

      if (index === -1) continue;
      this.#candidateTargets.push({
        target,
        index,
        vector: this.#VECTORS[key],
      });
    }
  }

  // remove candidate which line perpendicular to the target
  #removeCrossCandidates(vector) {
    const [dx, dy] = vector;

    this.#candidateTargets = this.#candidateTargets.filter(({ vector }) => {
      return vector[0] + dx === 0 && vector[1] + dy === 0;
    });
  }

  #deleteItem(array, index) {
    const lastIndex = array.length - 1;
    [array[index], array[lastIndex]] = [array[lastIndex], array[index]];

    return this.#targets.pop();
  }
}
