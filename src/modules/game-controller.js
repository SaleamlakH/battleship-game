export class GameController {
  #currentPlayer;
  #enemy;

  constructor(currentPlayer, enemy) {
    this.#currentPlayer = currentPlayer;
    this.#enemy = enemy;
  }

  get currentPlayer() {
    return this.#currentPlayer;
  }

  get enemy() {
    return this.#enemy;
  }

  changeCurrentPlayer() {
    [this.#currentPlayer, this.#enemy] = [this.#enemy, this.#currentPlayer];
  }
}
