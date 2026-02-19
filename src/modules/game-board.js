export class GameBoard {
  #gameBoard = new Map();
  #boardSize = 10;

  get(coordinate) {
    const key = this.#key(coordinate);
    return this.#gameBoard.get(key);
  }

  #key(coordinate) {
    return `${coordinate[0]},${coordinate[1]}`;
  }
}
