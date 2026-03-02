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

  // get hit
  chooseTarget() {
    const recentVector = this.#recentHit.vector;

    const candidate = recentVector
      ? this.#calculateCandidate()
      : this.#candidateTargets.pop();

    const { target, vector, index } = candidate || this.#getRandomTarget();

    this.#recentHit.vector = vector;
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
    const recentVector = this.#recentHit.vector;

    // knows in which direction to shot
    if (recentVector) this.#removeCrossCandidates(recentVector);

    // need to set new candidates;
    if (!this.#candidateTargets.length && !recentVector) {
      this.#setCandidateTargets(coordinate);
    }

    // if we can't have valid calculated candidate
    // we don't need the vector
    // it will look in candidateTargets or get random one
    if (recentVector && !this.#calculateCandidate()) {
      this.#recentHit.vector = null;
    }
  }

  #getRandomTarget() {
    const index = Math.floor(Math.random() * this.#targets.length);
    const target = this.#targets[index];

    return { target, index, vector: null };
  }

  #calculateCandidate() {
    // knows which side to follow
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
