export class GameController {
  #currentPlayer;
  #opponent;
  #isVsComputer;

  constructor(currentPlayer, opponent, isVsComputer) {
    this.#currentPlayer = currentPlayer;
    this.#opponent = opponent;
    this.#isVsComputer = isVsComputer;
  }

  get currentPlayer() {
    return this.#currentPlayer;
  }

  get opponent() {
    return this.#opponent;
  }

  playRound(coordinate) {
    const roundResult = {
      human: null,
      computer: null,
      winner: null,
    };

    const { human, winner } = this.#humanAttack(coordinate);
    [roundResult.human, roundResult.winner] = [human, winner];

    if (!human.success) return { invalid: true };
    if (winner) return roundResult;

    this.#changeCurrentPlayer();

    if (this.#isVsComputer) {
      const { computer, winner } = this.#computerAttack();
      [roundResult.computer, roundResult.winner] = [computer, winner];

      this.#changeCurrentPlayer();
    }

    return roundResult;
  }

  #humanAttack(coordinate) {
    const humanAttack = this.#opponent.gameBoard.receiveAttack(coordinate);
    const human = { coordinate, ...humanAttack };
    const winner = this.#hasWinner() ? this.#currentPlayer : null;

    return { human, winner };
  }

  #computerAttack() {
    const target = this.#currentPlayer.chooseTarget();
    const computerAttack = this.#opponent.gameBoard.receiveAttack(target);

    const computer = { ...computerAttack, coordinate: target };
    const winner = this.#hasWinner() ? this.#opponent : null;

    return { computer, winner };
  }

  #changeCurrentPlayer() {
    [this.#currentPlayer, this.#opponent] = [
      this.#opponent,
      this.#currentPlayer,
    ];
  }

  #hasWinner() {
    return this.#opponent.gameBoard.hasAllShipsSunk();
  }
}
