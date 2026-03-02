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
      humanAttack: null,
      computerAttack: null,
      winner: null,
    };

    const { humanAttack, winner } = this.#humanAttack(coordinate);
    [roundResult.humanAttack, roundResult.winner] = [humanAttack, winner];

    if (!humanAttack.success) return { invalid: true };
    if (winner) return roundResult;

    this.#changeCurrentPlayer();

    if (this.#isVsComputer) {
      const { computerAttack, winner } = this.#computerAttack();
      [roundResult.computerAttack, roundResult.winner] = [
        computerAttack,
        winner,
      ];

      this.#currentPlayer.handleShotResult(computerAttack);
      this.#changeCurrentPlayer();
    }

    return roundResult;
  }

  #humanAttack(coordinate) {
    const attack = this.#opponent.gameBoard.receiveAttack(coordinate);
    const humanAttack = { coordinate, ...attack };
    const winner = this.#hasWinner() ? this.#currentPlayer : null;

    return { humanAttack, winner };
  }

  #computerAttack() {
    const target = this.#currentPlayer.chooseTarget();
    const attack = this.#opponent.gameBoard.receiveAttack(target);

    const computerAttack = { ...attack, coordinate: target };
    const winner = this.#hasWinner() ? this.#opponent : null;

    return { computerAttack, winner };
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
