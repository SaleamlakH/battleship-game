export class GameController {
  #currentPlayer;
  #opponent;

  constructor(currentPlayer, opponent) {
    this.#currentPlayer = currentPlayer;
    this.#opponent = opponent;
  }

  get currentPlayer() {
    return this.#currentPlayer;
  }

  get opponent() {
    return this.#opponent;
  }

  #changeCurrentPlayer() {
    [this.#currentPlayer, this.#opponent] = [
      this.#opponent,
      this.#currentPlayer,
    ];
  }
}
