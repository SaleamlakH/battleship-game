export class BoardDisplay {
  #ownBoard;
  #opponentBoard;

  constructor(boardSize, playRound) {
    this.#ownBoard = this.#buildBoard(false, boardSize, playRound);
    this.#opponentBoard = this.#buildBoard(true, boardSize, playRound);
  }

  get ownBoard() {
    return this.#ownBoard;
  }

  get opponentBoard() {
    return this.#opponentBoard;
  }

  #buildBoard(opponent, boardSize, playRound) {
    const container = document.createElement('div');
    container.classList.add('game-board');

    this.#appendChildren(boardSize, container);

    if (opponent) {
      container.addEventListener('click', (e) =>
        this.#attackHandler(e, playRound),
      );
    }

    return container;
  }

  #appendChildren(size, container) {
    for (let y = 1; y <= size; y++) {
      for (let x = 1; x <= size; x++) {
        const cell = document.createElement('div');

        cell.dataset.x = x;
        cell.dataset.y = y;
        container.appendChild(cell);
      }
    }
  }

  async #attackHandler(e, playRound) {
    const element = e.target;
    if (!element.dataset.x) return;

    // read coordinates and pass to playRound
    const x = Number(element.dataset.x);
    const y = Number(element.dataset.y);
    const roundResult = playRound([x, y]);

    // return when invalid/ attack not successful
    if (roundResult.invalid) return;

    // style attack target square
    this.#setAttackStyle(element, roundResult.human.hit);

    // style computer attack target square
    await this.#delay(500);
    if (roundResult.computer) {
      this.#styleComputerTarget(roundResult.computer);
    }
  }

  #styleComputerTarget(computerAttack) {
    const [x, y] = computerAttack.coordinate;
    const element = this.#ownBoard.querySelector(
      `[data-x='${x}'][data-y='${y}']`,
    );

    this.#setAttackStyle(element, computerAttack.hit);
  }

  #delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  #setAttackStyle(element, hit) {
    const className = hit ? 'hit' : 'missed';
    element.classList.add(className);
  }

  static showFleet(fleetPlacement, boardContainer) {
    fleetPlacement.forEach(({ size, dirVector, coordinates }) => {
      const [col, row] = coordinates[0];

      const [dx, dy] = dirVector;
      const rowSpan = dy ? size : 1;
      const colSpan = dx ? size : 1;

      const overlay = this.#overlayElement(row, rowSpan, col, colSpan);
      boardContainer.appendChild(overlay);
    });
  }

  static #overlayElement(rowStart, rowSpan, colStart, colSpan) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    overlay.style.gridColumn = `${colStart} / span ${colSpan}`;
    overlay.style.gridRow = `${rowStart} / span ${rowSpan}`;
    return overlay;
  }
}
