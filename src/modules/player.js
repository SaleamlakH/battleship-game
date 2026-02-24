import { GameBoard, DIRECTION_VECTORS } from './game-board';

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
